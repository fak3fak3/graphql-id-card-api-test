import {
  GraphQLError,
  Kind,
  type SelectionSetNode,
  type ValidationContext,
  type ValidationRule,
} from 'graphql';

export const QUERY_TOO_DEEP = 'QUERY_TOO_DEEP';

/**
 * Rejects operations nested deeper than `maxDepth` during validation, before
 * any resolver runs.
 *
 * The schema has a cycle (Skill.projects <-> Project.skills), so without a
 * limit a client could write an arbitrarily deep query, each level multiplying
 * the amount of data to load.
 *
 * Depth is the number of nested fields: `{ profile { name } }` has depth 2.
 * Fragments are followed. Introspection fields (`__schema`, `__type`) are not
 * counted, otherwise the query Apollo Sandbox sends to read the schema would
 * be rejected.
 */
export function depthLimitRule(maxDepth: number): ValidationRule {
  return (context: ValidationContext) => ({
    OperationDefinition(operation) {
      const depth = measureDepth(operation.selectionSet, context, new Set());

      if (depth > maxDepth) {
        context.reportError(
          new GraphQLError(
            `Query is too deep: ${depth} levels, the maximum is ${maxDepth}`,
            {
              nodes: [operation],
              extensions: { code: QUERY_TOO_DEEP, depth, maxDepth },
            },
          ),
        );
      }
    },
  });
}

function measureDepth(
  selectionSet: SelectionSetNode,
  context: ValidationContext,
  /** Fragments on the current path: guards against fragment cycles. */
  visitedFragments: ReadonlySet<string>,
): number {
  let deepest = 0;

  for (const selection of selectionSet.selections) {
    let depth = 0;

    switch (selection.kind) {
      case Kind.FIELD:
        if (selection.name.value.startsWith('__')) {
          break;
        }
        depth =
          1 +
          (selection.selectionSet
            ? measureDepth(selection.selectionSet, context, visitedFragments)
            : 0);
        break;

      case Kind.INLINE_FRAGMENT:
        depth = measureDepth(selection.selectionSet, context, visitedFragments);
        break;

      case Kind.FRAGMENT_SPREAD: {
        const name = selection.name.value;
        const fragment = context.getFragment(name);

        // An unknown or recursive fragment is reported by GraphQL's own rules.
        if (fragment && !visitedFragments.has(name)) {
          depth = measureDepth(
            fragment.selectionSet,
            context,
            new Set(visitedFragments).add(name),
          );
        }
        break;
      }
    }

    deepest = Math.max(deepest, depth);
  }

  return deepest;
}

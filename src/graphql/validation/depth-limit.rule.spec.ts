import { buildSchema, parse, validate } from 'graphql';
import { depthLimitRule } from './depth-limit.rule.js';

const schema = buildSchema(`
  type Query { skills: [Skill!]! }
  type Skill { name: String! projects: [Project!]! }
  type Project { name: String! skills: [Skill!]! }
`);

const check = (query: string, maxDepth: number) =>
  validate(schema, parse(query), [depthLimitRule(maxDepth)]);

describe('depthLimitRule', () => {
  it('accepts a query exactly at the limit', () => {
    expect(check('{ skills { projects { name } } }', 3)).toEqual([]);
  });

  it('rejects a query one level deeper, with a code and both numbers', () => {
    const [error, ...rest] = check('{ skills { projects { name } } }', 2);

    expect(rest).toHaveLength(0);
    expect(error?.message).toBe(
      'Query is too deep: 3 levels, the maximum is 2',
    );
    expect(error?.extensions).toEqual({
      code: 'QUERY_TOO_DEEP',
      depth: 3,
      maxDepth: 2,
    });
  });

  it('measures the deepest branch, not the first one', () => {
    expect(
      check('{ skills { name projects { skills { name } } } }', 3),
    ).toHaveLength(1);
  });

  it('follows named and inline fragments', () => {
    const query = `
      { skills { ...SkillFields } }
      fragment SkillFields on Skill { projects { ... on Project { name } } }
    `;

    expect(check(query, 3)).toEqual([]);
    expect(check(query, 2)).toHaveLength(1);
  });

  it('checks every operation of a document', () => {
    const query = `
      query Shallow { skills { name } }
      query Deep { skills { projects { skills { name } } } }
    `;

    expect(check(query, 2)).toHaveLength(1);
  });

  it('terminates on a fragment that refers to itself', () => {
    const query = `
      { skills { ...Loop } }
      fragment Loop on Skill { projects { skills { ...Loop } } }
    `;

    expect(() => check(query, 10)).not.toThrow();
  });

  it('does not count introspection', () => {
    const query = `{
      __schema { types { fields { type { ofType { ofType { name } } } } } }
    }`;

    expect(check(query, 1)).toEqual([]);
  });

  it('does not count __typename as a level', () => {
    expect(check('{ skills { __typename } }', 1)).toEqual([]);
  });
});

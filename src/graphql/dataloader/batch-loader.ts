import DataLoader from 'dataloader';
import type { GraphQLContext } from '../graphql-context.js';

/**
 * Base class for loaders that resolve a relation without N+1 queries.
 *
 * All `load(key)` calls made while one level of a GraphQL query is being
 * resolved are collected and passed to `loadMany` as a single batch, so a
 * relation costs one SQL query no matter how many parent objects ask for it.
 *
 * Subclasses are ordinary singleton providers: the per-request state lives in
 * the GraphQL context, which avoids request-scoped providers (and the
 * re-instantiation of resolvers on every request that comes with them).
 */
export abstract class BatchLoader<K, V> {
  /** Loads values for all keys at once, keyed so that order does not matter. */
  protected abstract loadMany(keys: readonly K[]): Promise<Map<K, V>>;

  /** The value for a key that `loadMany` returned nothing for. */
  protected abstract emptyValue(): V;

  load(context: GraphQLContext, key: K): Promise<V> {
    return context.loaders
      .get(this, () => new DataLoader<K, V>((keys) => this.batch(keys)))
      .load(key);
  }

  /** DataLoader requires results in exactly the order of the keys. */
  private async batch(keys: readonly K[]): Promise<V[]> {
    const values = await this.loadMany(keys);

    return keys.map((key) => values.get(key) ?? this.emptyValue());
  }
}

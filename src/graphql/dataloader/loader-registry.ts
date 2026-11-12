import DataLoader from 'dataloader';

/**
 * Holds the DataLoader instances of one GraphQL request.
 *
 * A DataLoader caches what it loads, so it must not outlive a request. The
 * registry is created in the GraphQL context factory (once per request) and
 * hands every loader class its own instance, created on first use.
 */
export class LoaderRegistry {
  private readonly loaders = new Map<object, DataLoader<unknown, unknown>>();

  get<K, V>(owner: object, create: () => DataLoader<K, V>): DataLoader<K, V> {
    let loader = this.loaders.get(owner) as DataLoader<K, V> | undefined;

    if (!loader) {
      loader = create();
      this.loaders.set(owner, loader);
    }

    return loader;
  }
}

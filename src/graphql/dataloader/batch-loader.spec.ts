import { createGraphQLContext } from '../graphql-context.js';
import { BatchLoader } from './batch-loader.js';

class ItemsLoader extends BatchLoader<string, string[]> {
  readonly batches: string[][] = [];

  protected loadMany(keys: readonly string[]): Promise<Map<string, string[]>> {
    this.batches.push([...keys]);

    // Deliberately out of key order and without an entry for "missing".
    return Promise.resolve(
      new Map(
        [...keys]
          .reverse()
          .filter((key) => key !== 'missing')
          .map((key) => [key, [`${key}-item`]]),
      ),
    );
  }

  protected emptyValue(): string[] {
    return [];
  }
}

describe('BatchLoader', () => {
  it('collects loads of one tick into a single batch, in key order', async () => {
    const loader = new ItemsLoader();
    const context = createGraphQLContext();

    const results = await Promise.all([
      loader.load(context, 'a'),
      loader.load(context, 'missing'),
      loader.load(context, 'b'),
    ]);

    expect(loader.batches).toEqual([['a', 'missing', 'b']]);
    expect(results).toEqual([['a-item'], [], ['b-item']]);
  });

  it('caches a key within a request', async () => {
    const loader = new ItemsLoader();
    const context = createGraphQLContext();

    await loader.load(context, 'a');
    await loader.load(context, 'a');

    expect(loader.batches).toEqual([['a']]);
  });

  it('does not share the cache between requests', async () => {
    const loader = new ItemsLoader();

    await loader.load(createGraphQLContext(), 'a');
    await loader.load(createGraphQLContext(), 'a');

    expect(loader.batches).toEqual([['a'], ['a']]);
  });
});

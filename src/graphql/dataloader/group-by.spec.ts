import { groupBy } from './group-by.js';

describe('groupBy', () => {
  it('groups items by key and keeps their order inside a group', () => {
    const items = [
      { parent: 'a', n: 1 },
      { parent: 'b', n: 2 },
      { parent: 'a', n: 3 },
    ];

    expect(groupBy(items, (item) => item.parent)).toEqual(
      new Map([
        ['a', [items[0], items[2]]],
        ['b', [items[1]]],
      ]),
    );
  });

  it('returns an empty map for no items', () => {
    expect(groupBy([], () => 'key').size).toBe(0);
  });
});

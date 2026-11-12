import { Kind } from 'graphql';
import { DateScalar } from './date.scalar.js';

describe('DateScalar', () => {
  it('serializes a date without the time part', () => {
    expect(DateScalar.serialize(new Date('2025-01-31T00:00:00.000Z'))).toBe(
      '2025-01-31',
    );
  });

  it('refuses to serialize a value that is not a date', () => {
    expect(() => DateScalar.serialize('2025-01-31')).toThrow();
  });

  it('parses an ISO date from variables and from query literals', () => {
    const expected = new Date('2025-01-31T00:00:00.000Z');

    expect(DateScalar.parseValue('2025-01-31')).toEqual(expected);
    expect(
      DateScalar.parseLiteral({ kind: Kind.STRING, value: '2025-01-31' }),
    ).toEqual(expected);
  });

  it.each(['31.01.2025', '2025-13-01', 20250131])('rejects %s', (value) => {
    expect(() => DateScalar.parseValue(value)).toThrow();
  });
});

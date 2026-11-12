import { GraphQLError, GraphQLScalarType, Kind } from 'graphql';

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function parse(value: unknown): Date {
  if (typeof value !== 'string' || !ISO_DATE.test(value)) {
    throw new GraphQLError('Date must be a string in the YYYY-MM-DD format');
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  if (Number.isNaN(date.getTime())) {
    throw new GraphQLError(`"${value}" is not a valid calendar date`);
  }

  return date;
}

/**
 * A calendar date without time, e.g. `2025-01-31`.
 *
 * The built-in DateTime scalar would expose `2025-01-31T00:00:00.000Z` for a
 * PostgreSQL `date` column and suggest a precision the data does not have.
 */
export const DateScalar = new GraphQLScalarType<Date, string>({
  name: 'Date',
  description: 'A calendar date in the ISO 8601 format: YYYY-MM-DD.',
  serialize(value) {
    if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
      throw new GraphQLError('Date cannot represent a non-date value');
    }

    return value.toISOString().slice(0, 10);
  },
  parseValue: parse,
  parseLiteral(ast) {
    return parse(ast.kind === Kind.STRING ? ast.value : null);
  },
});

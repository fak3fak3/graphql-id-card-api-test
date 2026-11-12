import { ForbiddenException, Logger } from '@nestjs/common';
import { GraphQLError, type GraphQLFormattedError } from 'graphql';
import { NotFoundError } from '../../common/errors/domain.error.js';
import { formatGraphQLError } from './format-error.js';

/** What Apollo passes to formatError for an error thrown inside a resolver. */
function thrownInResolver(original: Error): [GraphQLFormattedError, unknown] {
  const error = new GraphQLError(original.message, {
    originalError: original,
    path: ['profile'],
  });

  return [
    {
      message: error.message,
      path: ['profile'],
      locations: [{ line: 1, column: 3 }],
      extensions: {
        code: 'INTERNAL_SERVER_ERROR',
        stacktrace: ['secret stack line'],
      },
    },
    error,
  ];
}

describe('formatGraphQLError', () => {
  const logError = vi
    .spyOn(Logger.prototype, 'error')
    .mockImplementation(() => undefined);

  beforeEach(() => {
    logError.mockClear();
  });

  it('exposes the message and code of a domain error', () => {
    const result = formatGraphQLError(
      ...thrownInResolver(new NotFoundError('Profile not found')),
    );

    expect(result).toEqual({
      message: 'Profile not found',
      path: ['profile'],
      locations: [{ line: 1, column: 3 }],
      extensions: { code: 'NOT_FOUND' },
    });
    expect(logError).not.toHaveBeenCalled();
  });

  it('maps a Nest HTTP exception to a code by its status', () => {
    const result = formatGraphQLError(
      ...thrownInResolver(new ForbiddenException('No access')),
    );

    expect(result).toMatchObject({
      message: 'No access',
      extensions: { code: 'FORBIDDEN' },
    });
  });

  it('hides an unexpected error from the client and logs it', () => {
    const result = formatGraphQLError(
      ...thrownInResolver(new Error('connect ECONNREFUSED 10.0.0.5:5432')),
    );

    expect(result).toEqual({
      message: 'Internal server error',
      path: ['profile'],
      locations: [{ line: 1, column: 3 }],
      extensions: { code: 'INTERNAL_SERVER_ERROR' },
    });
    expect(JSON.stringify(result)).not.toContain('ECONNREFUSED');
    expect(logError).toHaveBeenCalledTimes(1);
  });

  it('keeps request errors as they are, minus the stack trace', () => {
    const error = new GraphQLError('Cannot query field "nope"', {
      extensions: { code: 'GRAPHQL_VALIDATION_FAILED' },
    });

    const result = formatGraphQLError(
      {
        message: error.message,
        extensions: {
          code: 'GRAPHQL_VALIDATION_FAILED',
          stacktrace: ['secret stack line'],
        },
      },
      error,
    );

    expect(result).toEqual({
      message: 'Cannot query field "nope"',
      extensions: { code: 'GRAPHQL_VALIDATION_FAILED' },
    });
    expect(logError).not.toHaveBeenCalled();
  });

  it('prefers the code of a validation rule over the generic one', () => {
    const fromRule = new GraphQLError('Query is too deep', {
      extensions: { code: 'QUERY_TOO_DEEP', depth: 7, maxDepth: 6 },
    });
    // The way Apollo re-wraps an error reported by a validation rule.
    const wrapped = new GraphQLError(fromRule.message, {
      originalError: fromRule,
      extensions: { ...fromRule.extensions, code: 'GRAPHQL_VALIDATION_FAILED' },
    });

    const result = formatGraphQLError(
      { message: wrapped.message, extensions: wrapped.extensions },
      wrapped,
    );

    expect(result.extensions).toEqual({
      code: 'QUERY_TOO_DEEP',
      depth: 7,
      maxDepth: 6,
    });
  });
});

import { unwrapResolverError } from '@apollo/server/errors';
import { HttpException, Logger } from '@nestjs/common';
import { GraphQLError, type GraphQLFormattedError } from 'graphql';
import { DomainError } from '../../common/errors/domain.error.js';

export const INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR';

const logger = new Logger('GraphQL');

const HTTP_STATUS_CODES: Record<number, string> = {
  400: 'BAD_REQUEST',
  401: 'UNAUTHENTICATED',
  403: 'FORBIDDEN',
  404: 'NOT_FOUND',
};

/**
 * The single place that decides what an error looks like to a client.
 *
 * Every error leaves in one shape:
 *
 *   { message, locations?, path?, extensions: { code, ... } }
 *
 * - errors of the request itself (syntax, validation, depth limit) keep their
 *   message and code;
 * - domain errors expose their own message and code;
 * - anything else is a bug or an infrastructure failure: it is logged in full
 *   and the client only learns that something went wrong. Stack traces and
 *   the original exception never leave the server.
 */
export function formatGraphQLError(
  formatted: GraphQLFormattedError,
  error: unknown,
): GraphQLFormattedError {
  const original = unwrapResolverError(error);
  const { locations, path } = formatted;
  const respond = (
    message: string,
    extensions: Record<string, unknown>,
  ): GraphQLFormattedError => ({
    message,
    ...(locations && { locations }),
    ...(path && { path }),
    extensions,
  });

  if (original instanceof DomainError) {
    return respond(original.message, { code: original.code });
  }

  if (original instanceof HttpException) {
    const code = HTTP_STATUS_CODES[original.getStatus()];

    if (code) {
      return respond(original.message, { code });
    }
  }

  // Produced by GraphQL itself or by a validation rule, not thrown in a
  // resolver: the request is at fault and the message is meant for the client.
  if (original instanceof GraphQLError) {
    const extensions = { ...formatted.extensions };
    delete extensions.stacktrace;

    // Apollo wraps validation errors and overwrites their code with
    // GRAPHQL_VALIDATION_FAILED; a rule's own, more specific code wins.
    const source =
      original.originalError instanceof GraphQLError
        ? original.originalError
        : original;

    return respond(formatted.message, {
      ...extensions,
      code: source.extensions.code ?? extensions.code ?? INTERNAL_SERVER_ERROR,
    });
  }

  logger.error(
    `Unhandled error in "${path?.join('.') ?? 'request'}"`,
    original instanceof Error ? original.stack : String(original),
  );

  return respond('Internal server error', { code: INTERNAL_SERVER_ERROR });
}

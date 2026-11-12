import { type ArgumentsHost, Catch } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import type { GqlContextType } from '@nestjs/graphql';

/**
 * Hands errors thrown in resolvers to Apollo untouched.
 *
 * Without it Nest's default handler treats everything that is not an HTTP
 * exception as unknown and logs it as an error — including expected domain
 * errors — before `formatGraphQLError` gets to decide what the error means.
 * Requests outside GraphQL (e.g. /health) keep Nest's standard handling.
 */
@Catch()
export class GraphQLExceptionFilter extends BaseExceptionFilter {
  override catch(exception: unknown, host: ArgumentsHost): unknown {
    if (host.getType<GqlContextType>() === 'graphql') {
      return exception;
    }

    return super.catch(exception, host);
  }
}

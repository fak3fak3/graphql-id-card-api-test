import { join } from 'node:path';
import type { ApolloServerPlugin } from '@apollo/server';
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver, type ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GraphQLModule as NestGraphQLModule } from '@nestjs/graphql';
import type { Env } from '../config/env.validation.js';

/**
 * GraphQL transport: Apollo Server with a code-first schema.
 * Feature modules only declare resolvers; everything Apollo-specific is here.
 */
@Module({
  imports: [
    NestGraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      inject: [ConfigService],
      useFactory: (config: ConfigService<Env, true>): ApolloDriverConfig => {
        const isProduction =
          config.get('NODE_ENV', { infer: true }) === 'production';
        const sandbox = config.get('GRAPHQL_SANDBOX', { infer: true });

        // Apollo picks the landing page by NODE_ENV and hides Sandbox in
        // production. The choice is made explicit and driven by configuration
        // instead, so the Docker image (NODE_ENV=production) still serves it.
        const landingPage: ApolloServerPlugin = sandbox
          ? ApolloServerPluginLandingPageLocalDefault({ embed: true })
          : ApolloServerPluginLandingPageDisabled();

        return {
          path: '/graphql',
          // In development the schema is also written to schema.gql, which is
          // committed: the API contract is readable and reviewable in diffs.
          // The production container only builds it in memory.
          autoSchemaFile: isProduction
            ? true
            : join(process.cwd(), 'schema.gql'),
          sortSchema: true,
          // The legacy GraphQL Playground is replaced by Apollo Sandbox.
          playground: false,
          introspection: sandbox,
          plugins: [landingPage],
        };
      },
    }),
  ],
})
export class GraphQLModule {}

import { LoaderRegistry } from './dataloader/loader-registry.js';

/** The per-request context every resolver receives. */
export interface GraphQLContext {
  loaders: LoaderRegistry;
}

export function createGraphQLContext(): GraphQLContext {
  return { loaders: new LoaderRegistry() };
}

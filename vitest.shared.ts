import type { ViteUserConfig } from 'vitest/config';

/**
 * Settings shared by the unit and e2e configurations.
 *
 * The `graphql` package ships both CommonJS and ES module builds without an
 * `exports` map. Node resolves it to the CommonJS build, Vite to the ES one;
 * with two copies loaded, `instanceof` checks inside GraphQL fail ("Cannot
 * determine a GraphQL output type"). The alias makes tests load the same build
 * as the running application.
 */
export const sharedConfig: ViteUserConfig = {
  resolve: {
    alias: [{ find: /^graphql$/, replacement: 'graphql/index.js' }],
  },
};

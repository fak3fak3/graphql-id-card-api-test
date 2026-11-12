import { defineConfig, mergeConfig } from 'vitest/config';
import { sharedConfig } from './vitest.shared.js';

// e2e tests: boot the whole application through its HTTP interface.
export default mergeConfig(
  sharedConfig,
  defineConfig({
    test: {
      globals: true,
      root: './',
      include: ['test/**/*.e2e-spec.ts'],
      globalSetup: ['./test/global-setup.ts'],
      setupFiles: ['./test/setup-env.ts'],
      // All files share one test database, so they must not run concurrently.
      fileParallelism: false,
    },
  }),
);

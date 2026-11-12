import { defineConfig } from 'vitest/config';

// e2e tests: boot the whole application through its HTTP interface.
export default defineConfig({
  test: {
    globals: true,
    root: './',
    include: ['test/**/*.e2e-spec.ts'],
    globalSetup: ['./test/global-setup.ts'],
    setupFiles: ['./test/setup-env.ts'],
  },
});

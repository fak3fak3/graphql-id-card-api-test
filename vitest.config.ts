import { defineConfig, mergeConfig } from 'vitest/config';
import { sharedConfig } from './vitest.shared.js';

// Unit tests: live next to the code they cover.
export default mergeConfig(
  sharedConfig,
  defineConfig({
    test: {
      globals: true,
      root: './',
      include: ['src/**/*.spec.ts'],
    },
  }),
);

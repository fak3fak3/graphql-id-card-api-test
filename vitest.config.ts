import { defineConfig } from 'vitest/config';

// Unit tests: live next to the code they cover.
export default defineConfig({
  test: {
    globals: true,
    root: './',
    include: ['src/**/*.spec.ts'],
  },
});

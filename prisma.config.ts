import { existsSync } from 'node:fs';
import { defineConfig } from 'prisma/config';

// Prisma CLI does not read .env on its own. Node's built-in loader keeps the
// CLI working on the host without an extra dependency; inside containers the
// variables come from the environment and no file exists.
if (existsSync('.env')) {
  process.loadEnvFile('.env');
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    // The seed is compiled together with the application (`npm run build`),
    // so the production image runs it with plain Node, without a TS runtime.
    seed: 'node dist/seed/main.js',
  },
  datasource: {
    // Not validated here on purpose: `prisma generate` needs no database and
    // must work without the variable (e.g. during the image build).
    url: process.env.DATABASE_URL,
  },
});

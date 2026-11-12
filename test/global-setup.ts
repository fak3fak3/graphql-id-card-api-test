import { execSync } from 'node:child_process';
import { TEST_DATABASE_URL } from './test-env.js';

/**
 * Runs once before the e2e suite: creates the test database if needed and
 * brings it to the current schema with the same command production uses.
 */
export default function setup(): void {
  execSync('npx prisma migrate deploy', {
    env: { ...process.env, DATABASE_URL: TEST_DATABASE_URL },
    stdio: 'pipe',
  });
}

import { TEST_DATABASE_URL } from './test-env.js';

// e2e tests must not depend on a developer's local .env file.
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = TEST_DATABASE_URL;

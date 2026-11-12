/**
 * e2e tests run against a dedicated database on the PostgreSQL from
 * compose.yaml (`docker compose up -d db`), never against the dev database.
 */
export const TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL ??
  'postgresql://postgres:postgres@localhost:5433/id_card_test';

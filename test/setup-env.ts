// e2e tests must not depend on a developer's local .env file.
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL ??=
  'postgresql://postgres:postgres@localhost:5432/id_card_test?schema=public';

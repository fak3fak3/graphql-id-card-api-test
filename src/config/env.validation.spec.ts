import { validateEnv } from './env.validation.js';

const validEnv = {
  DATABASE_URL: 'postgresql://user:password@localhost:5432/db',
};

describe('validateEnv', () => {
  it('applies defaults to optional variables', () => {
    expect(validateEnv(validEnv)).toEqual({
      ...validEnv,
      NODE_ENV: 'development',
      PORT: 3000,
      GRAPHQL_SANDBOX: true,
      GRAPHQL_MAX_DEPTH: 6,
      DATABASE_LOG_QUERIES: false,
    });
  });

  it('coerces PORT to a number', () => {
    expect(validateEnv({ ...validEnv, PORT: '8080' }).PORT).toBe(8080);
  });

  it('parses GRAPHQL_SANDBOX as a boolean', () => {
    const parse = (value: string) =>
      validateEnv({ ...validEnv, GRAPHQL_SANDBOX: value }).GRAPHQL_SANDBOX;

    expect(parse('false')).toBe(false);
    expect(parse('true')).toBe(true);
  });

  it('fails when a required variable is missing', () => {
    expect(() => validateEnv({})).toThrow(/DATABASE_URL/);
  });

  it('rejects a connection string of another database', () => {
    expect(() =>
      validateEnv({ DATABASE_URL: 'mysql://user:password@localhost/db' }),
    ).toThrow(/DATABASE_URL/);
  });

  it('reports every invalid variable at once', () => {
    expect(() => validateEnv({ PORT: 'abc', NODE_ENV: 'staging' })).toThrow(
      /NODE_ENV[\s\S]*PORT[\s\S]*DATABASE_URL/,
    );
  });
});

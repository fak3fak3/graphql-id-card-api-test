import { z } from 'zod';

/**
 * The single source of truth for the process environment: the schema validates
 * it at startup and the inferred type is what the rest of the app reads.
 */
export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  DATABASE_URL: z
    .url({ protocol: /^postgres(ql)?$/ })
    .describe('PostgreSQL connection string'),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Passed to ConfigModule: a broken environment stops the bootstrap with a
 * message listing every invalid variable, instead of failing later at runtime.
 */
export function validateEnv(config: Record<string, unknown>): Env {
  const result = envSchema.safeParse(config);

  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');

    throw new Error(`Invalid environment variables:\n${issues}`);
  }

  return result.data;
}

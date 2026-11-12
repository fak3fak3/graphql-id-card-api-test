import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { App } from 'supertest/types.js';
import { AppModule } from '../src/app.module.js';
import { SANDBOX_DOCUMENT } from '../src/graphql/sandbox-document.js';
import { ProfileRepository } from '../src/profile/profile.repository.js';
import { PrismaService } from '../src/prisma/prisma.service.js';
import { seedDatabase } from '../src/seed/seed.js';
import { executeGraphQL } from './graphql-request.js';

/** `{ skills { projects { skills { ... { name } } } } }` of the given depth. */
function nestedQuery(depth: number): string {
  let selection = 'name';

  for (let level = depth - 1; level >= 1; level -= 1) {
    selection = `${level % 2 === 1 ? 'skills' : 'projects'} { ${selection} }`;
  }

  return `{ ${selection} }`;
}

describe('GraphQL: limits and errors (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    const prisma = app.get(PrismaService);
    await prisma.profile.deleteMany();
    await seedDatabase(prisma);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('query depth', () => {
    it('accepts a query at the default limit of 6 levels', async () => {
      const result = await executeGraphQL(app, nestedQuery(6));

      expect(result.errors).toBeUndefined();
    });

    it('rejects a deeper query before executing it', async () => {
      const findProfile = vi.spyOn(app.get(PrismaService).skill, 'findMany');

      const result = await executeGraphQL(app, nestedQuery(7), 400);

      expect(result).toEqual({
        errors: [
          {
            message: 'Query is too deep: 7 levels, the maximum is 6',
            locations: [{ line: 1, column: 1 }],
            extensions: { code: 'QUERY_TOO_DEEP', depth: 7, maxDepth: 6 },
          },
        ],
      });
      expect(findProfile).not.toHaveBeenCalled();
    });

    it('leaves room for the whole business card', async () => {
      const result = await executeGraphQL(app, SANDBOX_DOCUMENT);

      expect(result.errors).toBeUndefined();
    });
  });

  describe('error format', () => {
    it('reports an invalid query with a code and no internals', async () => {
      const result = await executeGraphQL(app, '{ profile { nope } }', 400);

      expect(result.errors).toHaveLength(1);
      expect(result.errors?.[0]?.extensions).toEqual({
        code: 'GRAPHQL_VALIDATION_FAILED',
      });
    });

    it('reports a syntax error with a code', async () => {
      const result = await executeGraphQL(app, '{ profile {', 400);

      expect(result.errors?.[0]?.extensions).toEqual({
        code: 'GRAPHQL_PARSE_FAILED',
      });
    });

    it('masks an unexpected failure', async () => {
      vi.spyOn(app.get(ProfileRepository), 'findProfile').mockRejectedValue(
        new Error('connect ECONNREFUSED 10.0.0.5:5432'),
      );

      const result = await executeGraphQL(app, '{ profile { name } }');

      expect(result).toEqual({
        data: null,
        errors: [
          {
            message: 'Internal server error',
            path: ['profile'],
            locations: [{ line: 1, column: 3 }],
            extensions: { code: 'INTERNAL_SERVER_ERROR' },
          },
        ],
      });
    });
  });
});

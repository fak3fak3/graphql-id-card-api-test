import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { AppModule } from '../src/app.module.js';
import { SANDBOX_DOCUMENT } from '../src/graphql/sandbox-document.js';
import { PrismaService } from '../src/prisma/prisma.service.js';
import { seedData, seedDatabase } from '../src/seed/seed.js';
import { executeGraphQL } from './graphql-request.js';

describe('GraphQL: profile (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    prisma = app.get(PrismaService);
  });

  beforeEach(async () => {
    await prisma.profile.deleteMany();
    await seedDatabase(prisma);
  });

  afterAll(async () => {
    await app.close();
  });

  it('returns the seeded profile with its links', async () => {
    const result = await executeGraphQL(
      app,
      `{
        profile {
          name
          headline
          description
          links {
            kind
            label
            url
          }
        }
      }`,
    );

    const { name, headline, description, links } = seedData.profile;

    expect(result).toEqual({
      data: {
        profile: {
          name,
          headline,
          description,
          links: links.map(({ kind, label, url }) => ({ kind, label, url })),
        },
      },
    });
  });

  it('reports NOT_FOUND when the database is not seeded', async () => {
    await prisma.profile.deleteMany();

    const result = await executeGraphQL(app, '{ profile { name } }');

    expect(result.data).toBeNull();
    expect(result.errors).toHaveLength(1);
    expect(result.errors?.[0]).toMatchObject({
      message: 'Profile not found',
      path: ['profile'],
    });
  });

  it('serves Apollo Sandbox to browsers', async () => {
    const response = await request(app.getHttpServer())
      .get('/graphql')
      .set('Accept', 'text/html')
      .expect(200);

    expect(response.text).toContain('embeddable-sandbox');
  });

  it('opens Sandbox with an operation that is valid for the schema', async () => {
    const result = await executeGraphQL<{ profile: { name: string } }>(
      app,
      SANDBOX_DOCUMENT,
    );

    expect(result.errors).toBeUndefined();
    expect(result.data?.profile.name).toBe(seedData.profile.name);
  });

  it('allows introspection, which Sandbox relies on', async () => {
    const result = await executeGraphQL<{
      __schema: { queryType: { name: string } };
    }>(app, '{ __schema { queryType { name } } }');

    expect(result.data?.__schema.queryType.name).toBe('Query');
  });
});

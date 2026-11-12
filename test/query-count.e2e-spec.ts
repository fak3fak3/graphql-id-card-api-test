import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { App } from 'supertest/types.js';
import { AppModule } from '../src/app.module.js';
import { PrismaService } from '../src/prisma/prisma.service.js';
import { seedDatabase } from '../src/seed/seed.js';
import { executeGraphQL } from './graphql-request.js';
import { QueryRecorder } from './query-recorder.js';

/**
 * The number of SQL queries is part of the API's contract with the database:
 * these tests fail if a nested field starts to cause N+1 queries.
 */
describe('GraphQL: number of SQL queries (e2e)', () => {
  let app: INestApplication<App>;
  let recorder: QueryRecorder;

  const tablesQueried = async (query: string): Promise<string[]> => {
    const statements = await recorder.record(async () => {
      const result = await executeGraphQL(app, query);

      expect(result.errors).toBeUndefined();
    });

    return statements.map(
      (sql) => /FROM "public"\."(\w+)"/.exec(sql)?.[1] ?? sql,
    );
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    const prisma = app.get(PrismaService);
    await prisma.profile.deleteMany();
    await seedDatabase(prisma);

    recorder = new QueryRecorder(prisma);
  });

  afterAll(async () => {
    await app.close();
  });

  it('loads only what the query asks for', async () => {
    expect(await tablesQueried('{ profile { name } }')).toEqual(['profiles']);
  });

  it('costs one query per relation', async () => {
    const tables = await tablesQueried(
      '{ profile { name links { url } skills { name } } }',
    );

    expect(tables.sort()).toEqual(['profile_links', 'profiles', 'skills']);
  });

  it('batches a relation requested by several parent objects', async () => {
    // Two `profile` fields are two parent objects. Without batching each of
    // them would load its own skills and links: 2 + 2 + 2 = 6 queries.
    const tables = await tablesQueried(`{
      first: profile { skills { name } links { url } }
      second: profile { skills { name } links { url } }
    }`);

    expect(tables.sort()).toEqual([
      'profile_links',
      'profiles',
      'profiles',
      'skills',
    ]);
  });

  it('loads two levels of nesting without N+1', async () => {
    // Five places of work: without batching the achievements alone would
    // take five queries. The cost must not depend on the number of rows.
    const tables = await tablesQueried(
      '{ profile { experience { company achievements { text } } } }',
    );

    expect(tables).toEqual(['profiles', 'experiences', 'achievements']);
  });

  it('serves the whole business card with one query per table', async () => {
    const tables = await tablesQueried(`{
      profile {
        name
        links { url }
        skills { name }
        experience { company position achievements { text } }
      }
    }`);

    expect(tables.sort()).toEqual([
      'achievements',
      'experiences',
      'profile_links',
      'profiles',
      'skills',
    ]);
  });

  it('batches achievements for the root experiences query', async () => {
    expect(
      await tablesQueried('{ experiences { company achievements { text } } }'),
    ).toEqual(['experiences', 'achievements']);
  });

  it('serves the root skills query with a single query', async () => {
    expect(await tablesQueried('{ skills { name category } }')).toEqual([
      'skills',
    ]);
  });
});

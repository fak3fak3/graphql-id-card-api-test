import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { App } from 'supertest/types.js';
import { AppModule } from '../src/app.module.js';
import { PrismaService } from '../src/prisma/prisma.service.js';
import { seedData, seedDatabase } from '../src/seed/seed.js';
import { executeGraphQL } from './graphql-request.js';

describe('GraphQL: projects (e2e)', () => {
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

  afterAll(async () => {
    await app.close();
  });

  it('answers the query from the assignment, exactly as it is written there', async () => {
    const result = await executeGraphQL(
      app,
      `query {
        profile {
          name
          description
          skills {
            name
          }
          experience {
            company
            position
          }
          projects {
            name
          }
        }
      }`,
    );

    const byStartDateDesc = [...seedData.experience].sort((a, b) =>
      b.startDate.localeCompare(a.startDate),
    );

    expect(result).toEqual({
      data: {
        profile: {
          name: seedData.profile.name,
          description: seedData.profile.description,
          skills: seedData.skills.map(({ name }) => ({ name })),
          experience: byStartDateDesc.map(({ company, position }) => ({
            company,
            position,
          })),
          projects: seedData.projects.map(({ name }) => ({ name })),
        },
      },
    });
  });

  it('returns projects with their links and skills', async () => {
    const result = await executeGraphQL<{
      projects: Array<{
        name: string;
        url: string | null;
        repositoryUrl: string | null;
        skills: Array<{ name: string }>;
      }>;
    }>(app, '{ projects { name url repositoryUrl skills { name } } }');

    expect(result.errors).toBeUndefined();
    expect(
      result.data?.projects.map((p) => ({
        ...p,
        skills: p.skills.map((s) => s.name).sort(),
      })),
    ).toEqual(
      seedData.projects.map((p) => ({
        name: p.name,
        url: p.url,
        repositoryUrl: p.repositoryUrl,
        skills: [...p.skills].sort(),
      })),
    );
  });

  it('exposes the relation from the skill side as well', async () => {
    const result = await executeGraphQL<{
      skills: Array<{ name: string; projects: Array<{ name: string }> }>;
    }>(app, '{ skills { name projects { name } } }');

    const projectsOf = (skill: string) =>
      result.data?.skills
        .find((s) => s.name === skill)
        ?.projects.map((p) => p.name);

    expect(projectsOf('Go')).toEqual(
      seedData.projects
        .filter((p) => p.skills.includes('Go'))
        .map((p) => p.name),
    );
    expect(projectsOf('Python')).toEqual([]);
  });
});

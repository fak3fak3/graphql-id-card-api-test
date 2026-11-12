import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { App } from 'supertest/types.js';
import { AppModule } from '../src/app.module.js';
import { PrismaService } from '../src/prisma/prisma.service.js';
import { seedData, seedDatabase } from '../src/seed/seed.js';
import { executeGraphQL } from './graphql-request.js';

interface ExperienceNode {
  company: string;
  companyUrl: string | null;
  position: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  period: string;
  durationMonths: number;
  achievements: Array<{ text: string }>;
}

const FIELDS = `
  company
  companyUrl
  position
  startDate
  endDate
  isCurrent
  period
  durationMonths
  achievements { text }
`;

describe('GraphQL: experience (e2e)', () => {
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

  it('returns experience with achievements under the profile, newest first', async () => {
    const result = await executeGraphQL<{
      profile: { experience: ExperienceNode[] };
    }>(app, `{ profile { experience { ${FIELDS} } } }`);

    expect(result.errors).toBeUndefined();

    const experience = result.data?.profile.experience ?? [];
    const expected = [...seedData.experience].sort((a, b) =>
      b.startDate.localeCompare(a.startDate),
    );

    expect(
      experience.map((e) => ({
        company: e.company,
        companyUrl: e.companyUrl,
        position: e.position,
        startDate: e.startDate,
        endDate: e.endDate,
        achievements: e.achievements.map((a) => a.text),
      })),
    ).toEqual(
      expected.map((e) => ({
        company: e.company,
        companyUrl: e.companyUrl,
        position: e.position,
        startDate: e.startDate,
        endDate: e.endDate,
        achievements: e.achievements.map((a) => a.text),
      })),
    );
  });

  it('computes the period fields', async () => {
    const result = await executeGraphQL<{ experiences: ExperienceNode[] }>(
      app,
      `{ experiences { ${FIELDS} } }`,
    );
    const finished = result.data?.experiences.find(
      (e) => e.company === 'Henar Foundation',
    );
    const current = result.data?.experiences.find((e) => e.isCurrent);

    expect(finished).toMatchObject({
      startDate: '2022-12-01',
      endDate: '2024-12-01',
      isCurrent: false,
      period: 'декабрь 2022 — декабрь 2024',
      durationMonths: 25,
    });
    expect(current).toMatchObject({
      endDate: null,
      period: 'январь 2025 — настоящее время',
    });
    expect(current?.durationMonths).toBeGreaterThanOrEqual(23);
  });
});

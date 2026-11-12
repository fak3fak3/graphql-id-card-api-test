import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';
import { LinkKind, SkillCategory } from '../src/generated/prisma/enums.js';
import { seedData, seedDatabase, type SeedData } from '../src/seed/seed.js';
import { TEST_DATABASE_URL } from './test-env.js';

const id = (group: number, n: number) =>
  `00000000-0000-7000-800${group}-00000000000${n}`;

const link = (n: number) => ({
  id: id(1, n),
  kind: LinkKind.OTHER,
  label: `Link ${n}`,
  url: `https://example.com/${n}`,
});

const skill = (n: number) => ({
  id: id(2, n),
  name: `Skill ${n}`,
  category: SkillCategory.TOOLS,
});

const achievement = (n: number) => ({ id: id(4, n), text: `Achievement ${n}` });

const job = (n: number, achievements: Array<{ id: string; text: string }>) => ({
  id: id(3, n),
  company: `Company ${n}`,
  companyUrl: null,
  position: 'Engineer',
  startDate: `202${n}-01-01`,
  endDate: null,
  achievements,
});

describe('Database seed (e2e)', () => {
  let prisma: PrismaClient;

  const snapshot = () =>
    prisma.profile.findMany({
      include: {
        links: { orderBy: { position: 'asc' } },
        skills: { orderBy: { position: 'asc' } },
        experience: {
          orderBy: { startDate: 'desc' },
          include: { achievements: { orderBy: { position: 'asc' } } },
        },
      },
    });

  beforeAll(() => {
    prisma = new PrismaClient({
      adapter: new PrismaPg({ connectionString: TEST_DATABASE_URL }),
    });
  });

  beforeEach(async () => {
    await prisma.profile.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('fills an empty database with the whole business card', async () => {
    await seedDatabase(prisma);

    const [profile, ...rest] = await snapshot();

    expect(rest).toHaveLength(0);
    expect(profile).toMatchObject({
      id: seedData.profile.id,
      name: seedData.profile.name,
    });
    expect(profile?.links.map((l) => l.url)).toEqual(
      seedData.profile.links.map((l) => l.url),
    );
    expect(profile?.skills.map((s) => s.name)).toEqual(
      seedData.skills.map((s) => s.name),
    );
    expect(
      profile?.experience.map((e) => [e.company, e.achievements.length]),
    ).toEqual(
      seedData.experience.map((e) => [e.company, e.achievements.length]),
    );
  });

  it('is idempotent: a second run changes nothing', async () => {
    await seedDatabase(prisma);
    const first = await snapshot();

    await seedDatabase(prisma);

    expect(await snapshot()).toEqual(first);
  });

  it('applies edits, reordering and removals from the seed data', async () => {
    const initial: SeedData = {
      profile: { ...seedData.profile, links: [link(1), link(2), link(3)] },
      skills: [skill(1), skill(2)],
      experience: [
        job(1, [achievement(1), achievement(2)]),
        job(2, [achievement(3)]),
      ],
    };
    const edited: SeedData = {
      profile: {
        ...seedData.profile,
        headline: 'Updated headline',
        links: [link(3), link(1)],
      },
      skills: [skill(2)],
      experience: [job(1, [achievement(2)])],
    };

    await seedDatabase(prisma, initial);
    await seedDatabase(prisma, edited);

    const [profile] = await snapshot();

    expect(profile?.headline).toBe('Updated headline');
    expect(profile?.links.map((l) => [l.label, l.position])).toEqual([
      ['Link 3', 0],
      ['Link 1', 1],
    ]);
    expect(profile?.skills.map((s) => [s.name, s.position])).toEqual([
      ['Skill 2', 0],
    ]);
    expect(
      profile?.experience.map((e) => [
        e.company,
        e.achievements.map((a) => [a.text, a.position]),
      ]),
    ).toEqual([['Company 1', [['Achievement 2', 0]]]]);
    // The removed job took its achievements with it.
    expect(await prisma.achievement.count()).toBe(1);
  });
});

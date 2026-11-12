import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';
import { LinkKind } from '../src/generated/prisma/enums.js';
import { seedData, seedDatabase, type SeedData } from '../src/seed/seed.js';
import { TEST_DATABASE_URL } from './test-env.js';

describe('Database seed (e2e)', () => {
  let prisma: PrismaClient;

  const snapshot = () =>
    prisma.profile.findMany({
      include: { links: { orderBy: { position: 'asc' } } },
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

  it('fills an empty database with the profile and its links', async () => {
    await seedDatabase(prisma);

    const [profile, ...rest] = await snapshot();

    expect(rest).toHaveLength(0);
    expect(profile).toMatchObject({
      id: seedData.profile.id,
      name: seedData.profile.name,
    });
    expect(profile?.links.map((link) => link.url)).toEqual(
      seedData.profile.links.map((link) => link.url),
    );
  });

  it('is idempotent: a second run changes nothing', async () => {
    await seedDatabase(prisma);
    const first = await snapshot();

    await seedDatabase(prisma);

    expect(await snapshot()).toEqual(first);
  });

  it('applies edits, reordering and removals from the seed data', async () => {
    const link = (n: number) => ({
      id: `00000000-0000-7000-8000-00000000000${n}`,
      kind: LinkKind.OTHER,
      label: `Link ${n}`,
      url: `https://example.com/${n}`,
    });
    const initial: SeedData = {
      profile: { ...seedData.profile, links: [link(1), link(2), link(3)] },
    };
    const edited: SeedData = {
      profile: {
        ...seedData.profile,
        headline: 'Updated headline',
        links: [link(3), link(1)],
      },
    };

    await seedDatabase(prisma, initial);
    await seedDatabase(prisma, edited);

    const [profile] = await snapshot();

    expect(profile?.headline).toBe('Updated headline');
    expect(profile?.links.map((l) => [l.label, l.position])).toEqual([
      ['Link 3', 0],
      ['Link 1', 1],
    ]);
  });
});

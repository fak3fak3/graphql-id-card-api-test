import type { PrismaClient } from '../generated/prisma/client.js';
import { profile as defaultProfile, type ProfileSeed } from './data/profile.js';

export interface SeedData {
  profile: ProfileSeed;
}

export const seedData: SeedData = {
  profile: defaultProfile,
};

/**
 * Brings the database to the state described by `data`.
 *
 * Idempotent: records are matched by their fixed ids and upserted, and child
 * records that are no longer in the data are removed, so the seed files stay
 * the single source of truth. Everything runs in one transaction — a failed
 * seed leaves the previous state untouched.
 */
export async function seedDatabase(
  prisma: PrismaClient,
  data: SeedData = seedData,
): Promise<void> {
  const { links, ...profile } = data.profile;

  await prisma.$transaction(async (tx) => {
    await tx.profile.upsert({
      where: { id: profile.id },
      create: profile,
      update: profile,
    });

    await tx.profileLink.deleteMany({
      where: {
        profileId: profile.id,
        id: { notIn: links.map((link) => link.id) },
      },
    });

    for (const [position, link] of links.entries()) {
      const record = { ...link, position, profileId: profile.id };

      await tx.profileLink.upsert({
        where: { id: link.id },
        create: record,
        update: record,
      });
    }
  });
}

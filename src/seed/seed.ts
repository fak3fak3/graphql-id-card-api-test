import type { PrismaClient } from '../generated/prisma/client.js';
import { profile as defaultProfile, type ProfileSeed } from './data/profile.js';
import { skills as defaultSkills, type SkillSeed } from './data/skills.js';

export interface SeedData {
  profile: ProfileSeed;
  skills: SkillSeed[];
}

export const seedData: SeedData = {
  profile: defaultProfile,
  skills: defaultSkills,
};

const idsOf = (items: ReadonlyArray<{ id: string }>): string[] =>
  items.map((item) => item.id);

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
  const profileId = profile.id;

  await prisma.$transaction(async (tx) => {
    await tx.profile.upsert({
      where: { id: profileId },
      create: profile,
      update: profile,
    });

    await tx.profileLink.deleteMany({
      where: { profileId, id: { notIn: idsOf(links) } },
    });
    for (const [position, link] of links.entries()) {
      const record = { ...link, position, profileId };

      await tx.profileLink.upsert({
        where: { id: link.id },
        create: record,
        update: record,
      });
    }

    await tx.skill.deleteMany({
      where: { profileId, id: { notIn: idsOf(data.skills) } },
    });
    for (const [position, skill] of data.skills.entries()) {
      const record = { ...skill, position, profileId };

      await tx.skill.upsert({
        where: { id: skill.id },
        create: record,
        update: record,
      });
    }
  });
}

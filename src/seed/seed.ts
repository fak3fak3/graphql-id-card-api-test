import type { Prisma, PrismaClient } from '../generated/prisma/client.js';
import {
  experience as defaultExperience,
  type ExperienceSeed,
} from './data/experience.js';
import { profile as defaultProfile, type ProfileSeed } from './data/profile.js';
import {
  projects as defaultProjects,
  type ProjectSeed,
} from './data/projects.js';
import { skills as defaultSkills, type SkillSeed } from './data/skills.js';

export interface SeedData {
  profile: ProfileSeed;
  skills: SkillSeed[];
  experience: ExperienceSeed[];
  projects: ProjectSeed[];
}

export const seedData: SeedData = {
  profile: defaultProfile,
  skills: defaultSkills,
  experience: defaultExperience,
  projects: defaultProjects,
};

type Tx = Prisma.TransactionClient;

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
  const profileId = data.profile.id;

  await prisma.$transaction(async (tx) => {
    await seedProfile(tx, data.profile);
    await seedSkills(tx, profileId, data.skills);
    await seedExperience(tx, profileId, data.experience);
    // After skills: projects refer to them by name.
    await seedProjects(tx, profileId, data.projects, data.skills);
  });
}

async function seedProfile(tx: Tx, data: ProfileSeed): Promise<void> {
  const { links, ...profile } = data;
  const profileId = profile.id;

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
}

async function seedSkills(
  tx: Tx,
  profileId: string,
  skills: SkillSeed[],
): Promise<void> {
  await tx.skill.deleteMany({
    where: { profileId, id: { notIn: idsOf(skills) } },
  });
  for (const [position, skill] of skills.entries()) {
    const record = { ...skill, position, profileId };

    await tx.skill.upsert({
      where: { id: skill.id },
      create: record,
      update: record,
    });
  }
}

async function seedExperience(
  tx: Tx,
  profileId: string,
  experience: ExperienceSeed[],
): Promise<void> {
  // Removing an experience also removes its achievements (ON DELETE CASCADE).
  await tx.experience.deleteMany({
    where: { profileId, id: { notIn: idsOf(experience) } },
  });

  for (const { achievements, ...item } of experience) {
    const record = {
      ...item,
      profileId,
      startDate: new Date(item.startDate),
      endDate: item.endDate ? new Date(item.endDate) : null,
    };

    await tx.experience.upsert({
      where: { id: item.id },
      create: record,
      update: record,
    });

    await tx.achievement.deleteMany({
      where: { experienceId: item.id, id: { notIn: idsOf(achievements) } },
    });
    for (const [position, achievement] of achievements.entries()) {
      const child = { ...achievement, position, experienceId: item.id };

      await tx.achievement.upsert({
        where: { id: achievement.id },
        create: child,
        update: child,
      });
    }
  }
}

async function seedProjects(
  tx: Tx,
  profileId: string,
  projects: ProjectSeed[],
  skills: SkillSeed[],
): Promise<void> {
  const skillIdByName = new Map(skills.map((skill) => [skill.name, skill.id]));

  await tx.project.deleteMany({
    where: { profileId, id: { notIn: idsOf(projects) } },
  });

  for (const [
    position,
    { skills: skillNames, ...project },
  ] of projects.entries()) {
    const record = { ...project, position, profileId };

    await tx.project.upsert({
      where: { id: project.id },
      create: record,
      update: record,
    });

    const skillIds = skillNames.map((name) => {
      const skillId = skillIdByName.get(name);

      if (!skillId) {
        throw new Error(
          `Project "${project.name}" refers to an unknown skill "${name}"`,
        );
      }

      return skillId;
    });

    await tx.projectSkill.deleteMany({
      where: { projectId: project.id, skillId: { notIn: skillIds } },
    });
    await tx.projectSkill.createMany({
      data: skillIds.map((skillId) => ({ projectId: project.id, skillId })),
      skipDuplicates: true,
    });
  }
}

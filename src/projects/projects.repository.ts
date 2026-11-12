import { Injectable } from '@nestjs/common';
import type {
  Project as ProjectRecord,
  Skill as SkillRecord,
} from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';

export interface ProjectSkillRecord {
  projectId: string;
  skill: SkillRecord;
}

export interface SkillProjectRecord {
  skillId: string;
  project: ProjectRecord;
}

@Injectable()
export class ProjectsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<ProjectRecord[]> {
    return this.prisma.project.findMany({
      orderBy: [{ profileId: 'asc' }, { position: 'asc' }],
    });
  }

  /** One query for any number of profiles: the batch behind the DataLoader. */
  findByProfileIds(profileIds: readonly string[]): Promise<ProjectRecord[]> {
    return this.prisma.project.findMany({
      where: { profileId: { in: [...profileIds] } },
      orderBy: { position: 'asc' },
    });
  }

  /**
   * Skills of any number of projects. Prisma runs two statements for it (the
   * link table, then the skills), and that number does not grow with the
   * number of projects.
   */
  findSkillsByProjectIds(
    projectIds: readonly string[],
  ): Promise<ProjectSkillRecord[]> {
    return this.prisma.projectSkill.findMany({
      where: { projectId: { in: [...projectIds] } },
      select: { projectId: true, skill: true },
      orderBy: { skill: { position: 'asc' } },
    });
  }

  /** The same relation in the opposite direction: projects of skills. */
  findProjectsBySkillIds(
    skillIds: readonly string[],
  ): Promise<SkillProjectRecord[]> {
    return this.prisma.projectSkill.findMany({
      where: { skillId: { in: [...skillIds] } },
      select: { skillId: true, project: true },
      orderBy: { project: { position: 'asc' } },
    });
  }
}

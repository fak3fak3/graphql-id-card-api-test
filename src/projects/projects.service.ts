import { Injectable } from '@nestjs/common';
import { groupBy } from '../graphql/dataloader/group-by.js';
import type { Skill } from '../skills/models/skill.model.js';
import { toSkill } from '../skills/skills.mapper.js';
import type { Project } from './models/project.model.js';
import { toProject } from './projects.mapper.js';
import { ProjectsRepository } from './projects.repository.js';

@Injectable()
export class ProjectsService {
  constructor(private readonly repository: ProjectsRepository) {}

  async getProjects(): Promise<Project[]> {
    const records = await this.repository.findAll();

    return records.map(toProject);
  }

  /** Projects of several profiles at once, grouped by profile id. */
  async getProjectsByProfileIds(
    profileIds: readonly string[],
  ): Promise<Map<string, Project[]>> {
    const records = await this.repository.findByProfileIds(profileIds);
    const byProfile = groupBy(records, (record) => record.profileId);

    return new Map(
      [...byProfile].map(([profileId, group]) => [
        profileId,
        group.map(toProject),
      ]),
    );
  }

  /** Skills of several projects at once, grouped by project id. */
  async getSkillsByProjectIds(
    projectIds: readonly string[],
  ): Promise<Map<string, Skill[]>> {
    const links = await this.repository.findSkillsByProjectIds(projectIds);
    const byProject = groupBy(links, (link) => link.projectId);

    return new Map(
      [...byProject].map(([projectId, group]) => [
        projectId,
        group.map((link) => toSkill(link.skill)),
      ]),
    );
  }

  /** Projects of several skills at once, grouped by skill id. */
  async getProjectsBySkillIds(
    skillIds: readonly string[],
  ): Promise<Map<string, Project[]>> {
    const links = await this.repository.findProjectsBySkillIds(skillIds);
    const bySkill = groupBy(links, (link) => link.skillId);

    return new Map(
      [...bySkill].map(([skillId, group]) => [
        skillId,
        group.map((link) => toProject(link.project)),
      ]),
    );
  }
}

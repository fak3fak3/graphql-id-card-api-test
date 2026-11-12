import { Injectable } from '@nestjs/common';
import { BatchLoader } from '../graphql/dataloader/batch-loader.js';
import type { Skill } from '../skills/models/skill.model.js';
import type { Project } from './models/project.model.js';
import { ProjectsService } from './projects.service.js';

/** Batches `Profile.projects`. */
@Injectable()
export class ProjectsByProfileLoader extends BatchLoader<string, Project[]> {
  constructor(private readonly projectsService: ProjectsService) {
    super();
  }

  protected loadMany(
    profileIds: readonly string[],
  ): Promise<Map<string, Project[]>> {
    return this.projectsService.getProjectsByProfileIds(profileIds);
  }

  protected emptyValue(): Project[] {
    return [];
  }
}

/** Batches `Project.skills`. */
@Injectable()
export class SkillsByProjectLoader extends BatchLoader<string, Skill[]> {
  constructor(private readonly projectsService: ProjectsService) {
    super();
  }

  protected loadMany(
    projectIds: readonly string[],
  ): Promise<Map<string, Skill[]>> {
    return this.projectsService.getSkillsByProjectIds(projectIds);
  }

  protected emptyValue(): Skill[] {
    return [];
  }
}

/** Batches `Skill.projects`. */
@Injectable()
export class ProjectsBySkillLoader extends BatchLoader<string, Project[]> {
  constructor(private readonly projectsService: ProjectsService) {
    super();
  }

  protected loadMany(
    skillIds: readonly string[],
  ): Promise<Map<string, Project[]>> {
    return this.projectsService.getProjectsBySkillIds(skillIds);
  }

  protected emptyValue(): Project[] {
    return [];
  }
}

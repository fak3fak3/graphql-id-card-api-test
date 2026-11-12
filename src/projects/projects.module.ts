import { Module } from '@nestjs/common';
import {
  ProfileProjectsResolver,
  SkillProjectsResolver,
} from './project-relations.resolver.js';
import {
  ProjectsByProfileLoader,
  ProjectsBySkillLoader,
  SkillsByProjectLoader,
} from './projects.loaders.js';
import { ProjectsRepository } from './projects.repository.js';
import { ProjectsResolver } from './projects.resolver.js';
import { ProjectsService } from './projects.service.js';

@Module({
  providers: [
    ProjectsResolver,
    ProfileProjectsResolver,
    SkillProjectsResolver,
    ProjectsByProfileLoader,
    SkillsByProjectLoader,
    ProjectsBySkillLoader,
    ProjectsService,
    ProjectsRepository,
  ],
})
export class ProjectsModule {}

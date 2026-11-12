import {
  Context,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import type { GraphQLContext } from '../graphql/graphql-context.js';
import { Skill } from '../skills/models/skill.model.js';
import { Project } from './models/project.model.js';
import { SkillsByProjectLoader } from './projects.loaders.js';
import { ProjectsService } from './projects.service.js';

@Resolver(() => Project)
export class ProjectsResolver {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly skillsByProject: SkillsByProjectLoader,
  ) {}

  @Query(() => [Project], { description: 'All projects, in display order.' })
  projects(): Promise<Project[]> {
    return this.projectsService.getProjects();
  }

  @ResolveField(() => [Skill], {
    description: 'Skills the project was built with.',
  })
  skills(
    @Parent() project: Project,
    @Context() context: GraphQLContext,
  ): Promise<Skill[]> {
    return this.skillsByProject.load(context, project.id);
  }
}

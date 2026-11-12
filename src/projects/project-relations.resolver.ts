import { Context, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import type { GraphQLContext } from '../graphql/graphql-context.js';
import { Profile } from '../profile/models/profile.model.js';
import { Skill } from '../skills/models/skill.model.js';
import { Project } from './models/project.model.js';
import {
  ProjectsByProfileLoader,
  ProjectsBySkillLoader,
} from './projects.loaders.js';

/**
 * Fields that the projects module adds to types owned by other modules.
 * Dependencies point one way: projects know about profiles and skills, while
 * those modules stay unaware of projects.
 */
@Resolver(() => Profile)
export class ProfileProjectsResolver {
  constructor(private readonly projectsByProfile: ProjectsByProfileLoader) {}

  @ResolveField(() => [Project], { description: 'Projects, in display order.' })
  projects(
    @Parent() profile: Profile,
    @Context() context: GraphQLContext,
  ): Promise<Project[]> {
    return this.projectsByProfile.load(context, profile.id);
  }
}

@Resolver(() => Skill)
export class SkillProjectsResolver {
  constructor(private readonly projectsBySkill: ProjectsBySkillLoader) {}

  @ResolveField(() => [Project], {
    description: 'Projects in which the skill was used.',
  })
  projects(
    @Parent() skill: Skill,
    @Context() context: GraphQLContext,
  ): Promise<Project[]> {
    return this.projectsBySkill.load(context, skill.id);
  }
}

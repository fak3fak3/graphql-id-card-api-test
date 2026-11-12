import { Context, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import type { GraphQLContext } from '../graphql/graphql-context.js';
import { Profile } from '../profile/models/profile.model.js';
import { ExperienceByProfileLoader } from './experience-by-profile.loader.js';
import { Experience } from './models/experience.model.js';

/** Adds `Profile.experience`; see ProfileSkillsResolver for the reasoning. */
@Resolver(() => Profile)
export class ProfileExperienceResolver {
  constructor(
    private readonly experienceByProfile: ExperienceByProfileLoader,
  ) {}

  @ResolveField(() => [Experience], {
    description: 'Work experience, newest first.',
  })
  experience(
    @Parent() profile: Profile,
    @Context() context: GraphQLContext,
  ): Promise<Experience[]> {
    return this.experienceByProfile.load(context, profile.id);
  }
}

import { Context, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import type { GraphQLContext } from '../graphql/graphql-context.js';
import { Profile } from '../profile/models/profile.model.js';
import { Skill } from './models/skill.model.js';
import { SkillsByProfileLoader } from './skills-by-profile.loader.js';

/**
 * Adds `Profile.skills`. The field lives in the skills module, so the profile
 * module does not know that skills exist: a new section of the card is a new
 * module, not an edit of an existing one.
 */
@Resolver(() => Profile)
export class ProfileSkillsResolver {
  constructor(private readonly skillsByProfile: SkillsByProfileLoader) {}

  @ResolveField(() => [Skill], { description: 'Skills, in display order.' })
  skills(
    @Parent() profile: Profile,
    @Context() context: GraphQLContext,
  ): Promise<Skill[]> {
    return this.skillsByProfile.load(context, profile.id);
  }
}

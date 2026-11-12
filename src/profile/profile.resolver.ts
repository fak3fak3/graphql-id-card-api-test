import {
  Context,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import type { GraphQLContext } from '../graphql/graphql-context.js';
import { LinksByProfileLoader } from './links-by-profile.loader.js';
import { ProfileLink } from './models/profile-link.model.js';
import { Profile } from './models/profile.model.js';
import { ProfileService } from './profile.service.js';

/** GraphQL entry points of the profile. No logic: it delegates to the service. */
@Resolver(() => Profile)
export class ProfileResolver {
  constructor(
    private readonly profileService: ProfileService,
    private readonly linksByProfile: LinksByProfileLoader,
  ) {}

  @Query(() => Profile, { description: 'The owner of this business card.' })
  profile(): Promise<Profile> {
    return this.profileService.getProfile();
  }

  @ResolveField(() => [ProfileLink], {
    description: 'Links to professional resources, in display order.',
  })
  links(
    @Parent() profile: Profile,
    @Context() context: GraphQLContext,
  ): Promise<ProfileLink[]> {
    return this.linksByProfile.load(context, profile.id);
  }
}

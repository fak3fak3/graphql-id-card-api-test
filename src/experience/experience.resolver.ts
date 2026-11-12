import {
  Context,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import type { GraphQLContext } from '../graphql/graphql-context.js';
import { AchievementsByExperienceLoader } from './achievements-by-experience.loader.js';
import { ExperienceService } from './experience.service.js';
import { Achievement } from './models/achievement.model.js';
import { Experience } from './models/experience.model.js';

@Resolver(() => Experience)
export class ExperienceResolver {
  constructor(
    private readonly experienceService: ExperienceService,
    private readonly achievementsByExperience: AchievementsByExperienceLoader,
  ) {}

  @Query(() => [Experience], {
    description: 'Work experience, newest first.',
  })
  experiences(): Promise<Experience[]> {
    return this.experienceService.getExperience();
  }

  @ResolveField(() => [Achievement], {
    description: 'Achievements at this place of work, in display order.',
  })
  achievements(
    @Parent() experience: Experience,
    @Context() context: GraphQLContext,
  ): Promise<Achievement[]> {
    return this.achievementsByExperience.load(context, experience.id);
  }
}

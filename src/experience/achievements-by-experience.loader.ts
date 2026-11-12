import { Injectable } from '@nestjs/common';
import { BatchLoader } from '../graphql/dataloader/batch-loader.js';
import { ExperienceService } from './experience.service.js';
import type { Achievement } from './models/achievement.model.js';

/**
 * Batches `Experience.achievements`. This is the relation where N+1 would
 * really hurt: without the loader every place of work would run its own query.
 */
@Injectable()
export class AchievementsByExperienceLoader extends BatchLoader<
  string,
  Achievement[]
> {
  constructor(private readonly experienceService: ExperienceService) {
    super();
  }

  protected loadMany(
    experienceIds: readonly string[],
  ): Promise<Map<string, Achievement[]>> {
    return this.experienceService.getAchievementsByExperienceIds(experienceIds);
  }

  protected emptyValue(): Achievement[] {
    return [];
  }
}

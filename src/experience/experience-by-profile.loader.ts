import { Injectable } from '@nestjs/common';
import { BatchLoader } from '../graphql/dataloader/batch-loader.js';
import { ExperienceService } from './experience.service.js';
import type { Experience } from './models/experience.model.js';

/** Batches `Profile.experience`: one query for all profiles in a request. */
@Injectable()
export class ExperienceByProfileLoader extends BatchLoader<
  string,
  Experience[]
> {
  constructor(private readonly experienceService: ExperienceService) {
    super();
  }

  protected loadMany(
    profileIds: readonly string[],
  ): Promise<Map<string, Experience[]>> {
    return this.experienceService.getExperienceByProfileIds(profileIds);
  }

  protected emptyValue(): Experience[] {
    return [];
  }
}

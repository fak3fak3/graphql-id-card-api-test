import { Injectable } from '@nestjs/common';
import { groupBy } from '../graphql/dataloader/group-by.js';
import { toAchievement, toExperience } from './experience.mapper.js';
import { ExperienceRepository } from './experience.repository.js';
import type { Achievement } from './models/achievement.model.js';
import type { Experience } from './models/experience.model.js';

@Injectable()
export class ExperienceService {
  constructor(private readonly repository: ExperienceRepository) {}

  /** All experience, newest first. */
  async getExperience(): Promise<Experience[]> {
    const records = await this.repository.findAll();
    const now = new Date();

    return records.map((record) => toExperience(record, now));
  }

  /** Experience of several profiles at once, grouped by profile id. */
  async getExperienceByProfileIds(
    profileIds: readonly string[],
  ): Promise<Map<string, Experience[]>> {
    const records = await this.repository.findByProfileIds(profileIds);
    const now = new Date();
    const byProfile = groupBy(records, (record) => record.profileId);

    return new Map(
      [...byProfile].map(([profileId, group]) => [
        profileId,
        group.map((record) => toExperience(record, now)),
      ]),
    );
  }

  /** Achievements of several experiences at once, grouped by experience id. */
  async getAchievementsByExperienceIds(
    experienceIds: readonly string[],
  ): Promise<Map<string, Achievement[]>> {
    const records =
      await this.repository.findAchievementsByExperienceIds(experienceIds);
    const byExperience = groupBy(records, (record) => record.experienceId);

    return new Map(
      [...byExperience].map(([experienceId, group]) => [
        experienceId,
        group.map(toAchievement),
      ]),
    );
  }
}

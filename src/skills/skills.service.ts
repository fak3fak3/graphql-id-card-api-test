import { Injectable } from '@nestjs/common';
import { groupBy } from '../graphql/dataloader/group-by.js';
import type { Skill } from './models/skill.model.js';
import { toSkill } from './skills.mapper.js';
import { SkillsRepository } from './skills.repository.js';

@Injectable()
export class SkillsService {
  constructor(private readonly repository: SkillsRepository) {}

  async getSkills(): Promise<Skill[]> {
    const records = await this.repository.findAll();

    return records.map(toSkill);
  }

  /** Skills of several profiles at once, grouped by profile id. */
  async getSkillsByProfileIds(
    profileIds: readonly string[],
  ): Promise<Map<string, Skill[]>> {
    const records = await this.repository.findByProfileIds(profileIds);
    const byProfile = groupBy(records, (record) => record.profileId);

    return new Map(
      [...byProfile].map(([profileId, group]) => [
        profileId,
        group.map(toSkill),
      ]),
    );
  }
}

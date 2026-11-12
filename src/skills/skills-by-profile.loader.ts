import { Injectable } from '@nestjs/common';
import { BatchLoader } from '../graphql/dataloader/batch-loader.js';
import type { Skill } from './models/skill.model.js';
import { SkillsService } from './skills.service.js';

/** Batches `Profile.skills`: one query for all profiles in a request. */
@Injectable()
export class SkillsByProfileLoader extends BatchLoader<string, Skill[]> {
  constructor(private readonly skillsService: SkillsService) {
    super();
  }

  protected loadMany(
    profileIds: readonly string[],
  ): Promise<Map<string, Skill[]>> {
    return this.skillsService.getSkillsByProfileIds(profileIds);
  }

  protected emptyValue(): Skill[] {
    return [];
  }
}

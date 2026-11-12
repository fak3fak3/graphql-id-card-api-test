import { Injectable } from '@nestjs/common';
import { BatchLoader } from '../graphql/dataloader/batch-loader.js';
import type { ProfileLink } from './models/profile-link.model.js';
import { ProfileService } from './profile.service.js';

/** Batches `Profile.links`: one query for all profiles in a request. */
@Injectable()
export class LinksByProfileLoader extends BatchLoader<string, ProfileLink[]> {
  constructor(private readonly profileService: ProfileService) {
    super();
  }

  protected loadMany(
    profileIds: readonly string[],
  ): Promise<Map<string, ProfileLink[]>> {
    return this.profileService.getLinksByProfileIds(profileIds);
  }

  protected emptyValue(): ProfileLink[] {
    return [];
  }
}

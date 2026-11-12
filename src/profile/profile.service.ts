import { Injectable, NotFoundException } from '@nestjs/common';
import { groupBy } from '../graphql/dataloader/group-by.js';
import type { ProfileLink } from './models/profile-link.model.js';
import type { Profile } from './models/profile.model.js';
import { toProfile, toProfileLink } from './profile.mapper.js';
import { ProfileRepository } from './profile.repository.js';

@Injectable()
export class ProfileService {
  constructor(private readonly repository: ProfileRepository) {}

  async getProfile(): Promise<Profile> {
    const record = await this.repository.findProfile();

    if (!record) {
      // Only possible when the database has not been seeded.
      throw new NotFoundException('Profile not found');
    }

    return toProfile(record);
  }

  /** Links of several profiles at once, grouped by profile id. */
  async getLinksByProfileIds(
    profileIds: readonly string[],
  ): Promise<Map<string, ProfileLink[]>> {
    const records = await this.repository.findLinksByProfileIds(profileIds);
    const byProfile = groupBy(records, (record) => record.profileId);

    return new Map(
      [...byProfile].map(([profileId, group]) => [
        profileId,
        group.map(toProfileLink),
      ]),
    );
  }
}

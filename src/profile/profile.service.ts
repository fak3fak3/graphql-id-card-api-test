import { Injectable, NotFoundException } from '@nestjs/common';
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

  async getLinks(profileId: string): Promise<ProfileLink[]> {
    const records = await this.repository.findLinksByProfileId(profileId);

    return records.map(toProfileLink);
  }
}

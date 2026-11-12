import { NotFoundException } from '@nestjs/common';
import type {
  Profile as ProfileRecord,
  ProfileLink as ProfileLinkRecord,
} from '../generated/prisma/client.js';
import type { ProfileRepository } from './profile.repository.js';
import { ProfileService } from './profile.service.js';

const profileRecord: ProfileRecord = {
  id: 'profile-1',
  name: 'Jane Doe',
  headline: 'Engineer',
  description: 'About Jane',
};

const linkRecord: ProfileLinkRecord = {
  id: 'link-1',
  profileId: 'profile-1',
  kind: 'GITHUB',
  label: 'GitHub',
  url: 'https://github.com/jane',
  position: 0,
};

describe('ProfileService', () => {
  const repository = {
    findProfile: vi.fn<ProfileRepository['findProfile']>(),
    findLinksByProfileIds: vi.fn<ProfileRepository['findLinksByProfileIds']>(),
  };
  const service = new ProfileService(
    repository as unknown as ProfileRepository,
  );

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('returns the profile as an API model', async () => {
    repository.findProfile.mockResolvedValue(profileRecord);

    await expect(service.getProfile()).resolves.toEqual(profileRecord);
  });

  it('throws NotFoundException when the database is not seeded', async () => {
    repository.findProfile.mockResolvedValue(null);

    await expect(service.getProfile()).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('groups links by profile without exposing storage-only fields', async () => {
    repository.findLinksByProfileIds.mockResolvedValue([linkRecord]);

    const links = await service.getLinksByProfileIds([
      'profile-1',
      'profile-2',
    ]);

    expect(links).toEqual(
      new Map([
        [
          'profile-1',
          [
            {
              id: 'link-1',
              kind: 'GITHUB',
              label: 'GitHub',
              url: 'https://github.com/jane',
            },
          ],
        ],
      ]),
    );
    expect(repository.findLinksByProfileIds).toHaveBeenCalledWith([
      'profile-1',
      'profile-2',
    ]);
  });
});

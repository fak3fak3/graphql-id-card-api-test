import { Injectable } from '@nestjs/common';
import type {
  Profile as ProfileRecord,
  ProfileLink as ProfileLinkRecord,
} from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';

/** Data access for the profile aggregate. The only place that talks to Prisma. */
@Injectable()
export class ProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** The card has a single owner, so there is no lookup key. */
  findProfile(): Promise<ProfileRecord | null> {
    return this.prisma.profile.findFirst();
  }

  /** One query for any number of profiles: the batch behind the DataLoader. */
  findLinksByProfileIds(
    profileIds: readonly string[],
  ): Promise<ProfileLinkRecord[]> {
    return this.prisma.profileLink.findMany({
      where: { profileId: { in: [...profileIds] } },
      orderBy: { position: 'asc' },
    });
  }
}

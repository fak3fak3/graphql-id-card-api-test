import { Injectable } from '@nestjs/common';
import type {
  Achievement as AchievementRecord,
  Experience as ExperienceRecord,
} from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ExperienceRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<ExperienceRecord[]> {
    return this.prisma.experience.findMany({
      orderBy: { startDate: 'desc' },
    });
  }

  /** One query for any number of profiles: the batch behind the DataLoader. */
  findByProfileIds(profileIds: readonly string[]): Promise<ExperienceRecord[]> {
    return this.prisma.experience.findMany({
      where: { profileId: { in: [...profileIds] } },
      orderBy: { startDate: 'desc' },
    });
  }

  /** One query for the achievements of any number of experiences. */
  findAchievementsByExperienceIds(
    experienceIds: readonly string[],
  ): Promise<AchievementRecord[]> {
    return this.prisma.achievement.findMany({
      where: { experienceId: { in: [...experienceIds] } },
      orderBy: { position: 'asc' },
    });
  }
}

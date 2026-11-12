import { Injectable } from '@nestjs/common';
import type { Skill as SkillRecord } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class SkillsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<SkillRecord[]> {
    return this.prisma.skill.findMany({
      orderBy: [{ profileId: 'asc' }, { position: 'asc' }],
    });
  }

  /** One query for any number of profiles: the batch behind the DataLoader. */
  findByProfileIds(profileIds: readonly string[]): Promise<SkillRecord[]> {
    return this.prisma.skill.findMany({
      where: { profileId: { in: [...profileIds] } },
      orderBy: { position: 'asc' },
    });
  }
}

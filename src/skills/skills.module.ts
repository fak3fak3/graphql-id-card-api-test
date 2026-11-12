import { Module } from '@nestjs/common';
import { ProfileSkillsResolver } from './profile-skills.resolver.js';
import { SkillsByProfileLoader } from './skills-by-profile.loader.js';
import { SkillsRepository } from './skills.repository.js';
import { SkillsResolver } from './skills.resolver.js';
import { SkillsService } from './skills.service.js';

@Module({
  providers: [
    SkillsResolver,
    ProfileSkillsResolver,
    SkillsByProfileLoader,
    SkillsService,
    SkillsRepository,
  ],
})
export class SkillsModule {}

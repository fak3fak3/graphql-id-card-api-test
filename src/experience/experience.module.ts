import { Module } from '@nestjs/common';
import { AchievementsByExperienceLoader } from './achievements-by-experience.loader.js';
import { ExperienceByProfileLoader } from './experience-by-profile.loader.js';
import { ExperienceRepository } from './experience.repository.js';
import { ExperienceResolver } from './experience.resolver.js';
import { ExperienceService } from './experience.service.js';
import { ProfileExperienceResolver } from './profile-experience.resolver.js';

@Module({
  providers: [
    ExperienceResolver,
    ProfileExperienceResolver,
    ExperienceByProfileLoader,
    AchievementsByExperienceLoader,
    ExperienceService,
    ExperienceRepository,
  ],
})
export class ExperienceModule {}

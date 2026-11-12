import { Module } from '@nestjs/common';
import { LinksByProfileLoader } from './links-by-profile.loader.js';
import { ProfileRepository } from './profile.repository.js';
import { ProfileResolver } from './profile.resolver.js';
import { ProfileService } from './profile.service.js';

@Module({
  providers: [
    ProfileResolver,
    LinksByProfileLoader,
    ProfileService,
    ProfileRepository,
  ],
})
export class ProfileModule {}

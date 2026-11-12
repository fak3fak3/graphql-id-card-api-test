import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './config/env.validation.js';
import { ExperienceModule } from './experience/experience.module.js';
import { GraphQLModule } from './graphql/graphql.module.js';
import { HealthModule } from './health/health.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { ProfileModule } from './profile/profile.module.js';
import { ProjectsModule } from './projects/projects.module.js';
import { SkillsModule } from './skills/skills.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate: validateEnv,
    }),
    PrismaModule,
    GraphQLModule,
    HealthModule,
    ProfileModule,
    SkillsModule,
    ExperienceModule,
    ProjectsModule,
  ],
})
export class AppModule {}

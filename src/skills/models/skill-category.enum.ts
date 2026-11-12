import { registerEnumType } from '@nestjs/graphql';

/** Part of the public API contract; see LinkKind for why it is not Prisma's. */
export enum SkillCategory {
  LANGUAGE = 'LANGUAGE',
  FRONTEND = 'FRONTEND',
  BACKEND = 'BACKEND',
  DATABASE = 'DATABASE',
  INFRASTRUCTURE = 'INFRASTRUCTURE',
  TOOLS = 'TOOLS',
}

registerEnumType(SkillCategory, {
  name: 'SkillCategory',
  description: 'Area of expertise a skill belongs to.',
});

import type { Skill as SkillRecord } from '../generated/prisma/client.js';
import { SkillCategory } from './models/skill-category.enum.js';
import type { Skill } from './models/skill.model.js';

export function toSkill(record: SkillRecord): Skill {
  return {
    id: record.id,
    name: record.name,
    category: SkillCategory[record.category],
  };
}

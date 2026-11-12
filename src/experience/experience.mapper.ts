import type {
  Achievement as AchievementRecord,
  Experience as ExperienceRecord,
} from '../generated/prisma/client.js';
import { describePeriod } from './experience-period.js';
import type { Achievement } from './models/achievement.model.js';
import type { Experience } from './models/experience.model.js';

export function toExperience(record: ExperienceRecord, now: Date): Experience {
  return {
    id: record.id,
    company: record.company,
    companyUrl: record.companyUrl,
    position: record.position,
    startDate: record.startDate,
    endDate: record.endDate,
    ...describePeriod(record.startDate, record.endDate, now),
  };
}

export function toAchievement(record: AchievementRecord): Achievement {
  return {
    id: record.id,
    text: record.text,
  };
}

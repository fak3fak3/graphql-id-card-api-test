import type {
  Achievement as AchievementRecord,
  Experience as ExperienceRecord,
} from '../generated/prisma/client.js';
import type { ExperienceRepository } from './experience.repository.js';
import { ExperienceService } from './experience.service.js';

const date = (iso: string) => new Date(`${iso}T00:00:00.000Z`);

const experienceRecord = (
  id: string,
  profileId: string,
  endDate: Date | null,
): ExperienceRecord => ({
  id,
  profileId,
  company: `Company ${id}`,
  companyUrl: null,
  position: 'Engineer',
  startDate: date('2020-01-01'),
  endDate,
});

const achievementRecord = (
  id: string,
  experienceId: string,
): AchievementRecord => ({
  id,
  experienceId,
  text: `Achievement ${id}`,
  position: 0,
});

describe('ExperienceService', () => {
  const repository = {
    findAll: vi.fn<ExperienceRepository['findAll']>(),
    findByProfileIds: vi.fn<ExperienceRepository['findByProfileIds']>(),
    findAchievementsByExperienceIds:
      vi.fn<ExperienceRepository['findAchievementsByExperienceIds']>(),
  };
  const service = new ExperienceService(
    repository as unknown as ExperienceRepository,
  );

  beforeEach(() => {
    vi.resetAllMocks();
    vi.useFakeTimers({ now: date('2026-11-12') });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('adds the computed period fields to a finished job', async () => {
    repository.findAll.mockResolvedValue([
      experienceRecord('1', 'p1', date('2020-03-01')),
    ]);

    await expect(service.getExperience()).resolves.toEqual([
      {
        id: '1',
        company: 'Company 1',
        companyUrl: null,
        position: 'Engineer',
        startDate: date('2020-01-01'),
        endDate: date('2020-03-01'),
        isCurrent: false,
        period: 'январь 2020 — март 2020',
        durationMonths: 3,
      },
    ]);
  });

  it('counts a current job up to the present moment', async () => {
    repository.findAll.mockResolvedValue([experienceRecord('1', 'p1', null)]);

    const [experience] = await service.getExperience();

    expect(experience).toMatchObject({
      isCurrent: true,
      period: 'январь 2020 — настоящее время',
      durationMonths: 83,
    });
  });

  it('groups experience by profile with a single repository call', async () => {
    repository.findByProfileIds.mockResolvedValue([
      experienceRecord('1', 'p1', null),
      experienceRecord('2', 'p2', null),
      experienceRecord('3', 'p1', null),
    ]);

    const result = await service.getExperienceByProfileIds(['p1', 'p2']);

    expect(result.get('p1')?.map((e) => e.id)).toEqual(['1', '3']);
    expect(result.get('p2')?.map((e) => e.id)).toEqual(['2']);
    expect(repository.findByProfileIds).toHaveBeenCalledTimes(1);
  });

  it('groups achievements by experience with a single repository call', async () => {
    repository.findAchievementsByExperienceIds.mockResolvedValue([
      achievementRecord('a', 'e1'),
      achievementRecord('b', 'e2'),
      achievementRecord('c', 'e1'),
    ]);

    const result = await service.getAchievementsByExperienceIds(['e1', 'e2']);

    expect(result.get('e1')).toEqual([
      { id: 'a', text: 'Achievement a' },
      { id: 'c', text: 'Achievement c' },
    ]);
    expect(result.get('e2')?.map((a) => a.id)).toEqual(['b']);
    expect(repository.findAchievementsByExperienceIds).toHaveBeenCalledTimes(1);
  });
});

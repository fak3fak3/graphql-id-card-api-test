import type { Skill as SkillRecord } from '../generated/prisma/client.js';
import type { SkillsRepository } from './skills.repository.js';
import { SkillsService } from './skills.service.js';

const record = (
  id: string,
  profileId: string,
  position: number,
): SkillRecord => ({
  id,
  profileId,
  name: `Skill ${id}`,
  category: 'BACKEND',
  position,
});

describe('SkillsService', () => {
  const repository = {
    findAll: vi.fn<SkillsRepository['findAll']>(),
    findByProfileIds: vi.fn<SkillsRepository['findByProfileIds']>(),
  };
  const service = new SkillsService(repository as unknown as SkillsRepository);

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('returns skills as API models, without storage-only fields', async () => {
    repository.findAll.mockResolvedValue([record('1', 'p1', 0)]);

    await expect(service.getSkills()).resolves.toEqual([
      { id: '1', name: 'Skill 1', category: 'BACKEND' },
    ]);
  });

  it('groups skills by profile with a single repository call', async () => {
    repository.findByProfileIds.mockResolvedValue([
      record('1', 'p1', 0),
      record('2', 'p2', 0),
      record('3', 'p1', 1),
    ]);

    const skills = await service.getSkillsByProfileIds(['p1', 'p2']);

    expect(skills.get('p1')?.map((skill) => skill.id)).toEqual(['1', '3']);
    expect(skills.get('p2')?.map((skill) => skill.id)).toEqual(['2']);
    expect(repository.findByProfileIds).toHaveBeenCalledTimes(1);
  });
});

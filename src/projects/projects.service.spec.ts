import type {
  Project as ProjectRecord,
  Skill as SkillRecord,
} from '../generated/prisma/client.js';
import type { ProjectsRepository } from './projects.repository.js';
import { ProjectsService } from './projects.service.js';

const projectRecord = (id: string, profileId = 'p1'): ProjectRecord => ({
  id,
  profileId,
  name: `Project ${id}`,
  description: 'Description',
  url: 'https://example.com',
  repositoryUrl: null,
  position: 0,
});

const skillRecord = (id: string): SkillRecord => ({
  id,
  profileId: 'p1',
  name: `Skill ${id}`,
  category: 'BACKEND',
  position: 0,
});

describe('ProjectsService', () => {
  const repository = {
    findAll: vi.fn<ProjectsRepository['findAll']>(),
    findByProfileIds: vi.fn<ProjectsRepository['findByProfileIds']>(),
    findSkillsByProjectIds:
      vi.fn<ProjectsRepository['findSkillsByProjectIds']>(),
    findProjectsBySkillIds:
      vi.fn<ProjectsRepository['findProjectsBySkillIds']>(),
  };
  const service = new ProjectsService(
    repository as unknown as ProjectsRepository,
  );

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('returns projects as API models, without storage-only fields', async () => {
    repository.findAll.mockResolvedValue([projectRecord('1')]);

    await expect(service.getProjects()).resolves.toEqual([
      {
        id: '1',
        name: 'Project 1',
        description: 'Description',
        url: 'https://example.com',
        repositoryUrl: null,
      },
    ]);
  });

  it('groups projects by profile', async () => {
    repository.findByProfileIds.mockResolvedValue([
      projectRecord('1', 'p1'),
      projectRecord('2', 'p2'),
      projectRecord('3', 'p1'),
    ]);

    const result = await service.getProjectsByProfileIds(['p1', 'p2']);

    expect(result.get('p1')?.map((p) => p.id)).toEqual(['1', '3']);
    expect(result.get('p2')?.map((p) => p.id)).toEqual(['2']);
  });

  it('groups skills by project; a skill may belong to several projects', async () => {
    repository.findSkillsByProjectIds.mockResolvedValue([
      { projectId: '1', skill: skillRecord('a') },
      { projectId: '2', skill: skillRecord('a') },
      { projectId: '1', skill: skillRecord('b') },
    ]);

    const result = await service.getSkillsByProjectIds(['1', '2']);

    expect(result.get('1')).toEqual([
      { id: 'a', name: 'Skill a', category: 'BACKEND' },
      { id: 'b', name: 'Skill b', category: 'BACKEND' },
    ]);
    expect(result.get('2')?.map((s) => s.id)).toEqual(['a']);
    expect(repository.findSkillsByProjectIds).toHaveBeenCalledTimes(1);
  });

  it('groups projects by skill', async () => {
    repository.findProjectsBySkillIds.mockResolvedValue([
      { skillId: 'a', project: projectRecord('1') },
      { skillId: 'a', project: projectRecord('2') },
      { skillId: 'b', project: projectRecord('1') },
    ]);

    const result = await service.getProjectsBySkillIds(['a', 'b']);

    expect(result.get('a')?.map((p) => p.id)).toEqual(['1', '2']);
    expect(result.get('b')?.map((p) => p.id)).toEqual(['1']);
    expect(repository.findProjectsBySkillIds).toHaveBeenCalledTimes(1);
  });
});

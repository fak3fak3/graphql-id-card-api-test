import type { Project as ProjectRecord } from '../generated/prisma/client.js';
import type { Project } from './models/project.model.js';

export function toProject(record: ProjectRecord): Project {
  return {
    id: record.id,
    name: record.name,
    description: record.description,
    url: record.url,
    repositoryUrl: record.repositoryUrl,
  };
}

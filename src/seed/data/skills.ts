import { SkillCategory } from '../../generated/prisma/enums.js';

export interface SkillSeed {
  id: string;
  name: string;
  category: SkillCategory;
}

const { LANGUAGE, FRONTEND, BACKEND, DATABASE, INFRASTRUCTURE, TOOLS } =
  SkillCategory;

/** Stored in this order: the array index becomes the display position. */
export const skills: SkillSeed[] = [
  { id: '01a1cf50-49fa-7182-ba60-1427025bed80', name: 'TypeScript', category: LANGUAGE },
  { id: '01a1cf50-49fb-746f-a752-5c0417b2886c', name: 'Go', category: LANGUAGE },
  { id: '01a1cf50-49fc-723f-a845-152dd8c74ad7', name: 'JavaScript', category: LANGUAGE },
  { id: '01a1cf50-49fd-73ca-860b-b7ec5bfffb27', name: 'Python', category: LANGUAGE },

  { id: '01a1cf50-49fe-7be0-9037-0b68cf499a31', name: 'React', category: FRONTEND },
  { id: '01a1cf50-49ff-7bdf-8130-b952be51bbfb', name: 'Next.js', category: FRONTEND },
  { id: '01a1cf50-4a00-726d-b1d2-9b4dcc79c1e2', name: 'Vue', category: FRONTEND },
  { id: '01a1cf50-4a01-7666-9990-aa97b8023346', name: 'Redux', category: FRONTEND },
  { id: '01a1cf50-4a02-7d59-909c-7736b0e530e8', name: 'React Query', category: FRONTEND },
  { id: '01a1cf50-4a03-7421-bce6-ec16f01d2b90', name: 'Effector', category: FRONTEND },

  { id: '01a1cf50-4a04-7bed-be25-52c38dbe5132', name: 'GraphQL', category: BACKEND },
  { id: '01a1cf50-4a05-70db-b5f2-5615a1bd7172', name: 'Микросервисы', category: BACKEND },

  { id: '01a1cf50-4a06-78dd-a85b-b764447d3d68', name: 'PostgreSQL', category: DATABASE },
  { id: '01a1cf50-4a07-7f46-a468-09810b5f48b8', name: 'MongoDB', category: DATABASE },

  { id: '01a1cf50-4a08-7314-9826-cdda7ede3d35', name: 'Docker', category: INFRASTRUCTURE },
  { id: '01a1cf50-4a09-7f5c-ac0b-2db1bdd405af', name: 'Linux', category: INFRASTRUCTURE },
  { id: '01a1cf50-4a0a-7bda-b334-92419c949660', name: 'Google Cloud', category: INFRASTRUCTURE },
  { id: '01a1cf50-4a0b-7be7-841c-8338733234b3', name: 'AWS', category: INFRASTRUCTURE },
  { id: '01a1cf50-4a0c-737a-88bf-0b44e2822c64', name: 'GitHub Actions', category: INFRASTRUCTURE },

  { id: '01a1cf50-4a0d-7814-9041-395e001ad77a', name: 'Git', category: TOOLS },
  { id: '01a1cf50-4a0e-75d5-95a0-1f61f9bbedee', name: 'Sentry', category: TOOLS },
];

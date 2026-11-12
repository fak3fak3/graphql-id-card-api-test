export interface ProjectSeed {
  id: string;
  name: string;
  description: string;
  /** Public address of the project, if it has one. */
  url: string | null;
  /** Source code, if it is public. */
  repositoryUrl: string | null;
  /** Names of skills from skills.ts; an unknown name fails the seed. */
  skills: string[];
}

/** Stored in this order: the array index becomes the display position. */
export const projects: ProjectSeed[] = [
  {
    id: '01a1cf75-d6e4-7371-b048-6ac3a86f0f59',
    name: 'Цифровая визитка',
    description:
      'Это приложение: GraphQL API на NestJS, Prisma и PostgreSQL, которое рассказывает обо мне как о специалисте.',
    url: null,
    repositoryUrl: 'https://github.com/fak3fak3/graphql-id-card-api-test',
    skills: ['TypeScript', 'GraphQL', 'PostgreSQL', 'Docker', 'Git'],
  },
  {
    id: '01a1cf75-d6e5-7c9c-97af-1ef641df7fde',
    name: 'PatientGenie',
    description:
      'Продукт для медицинских и страховых компаний: микросервисы на Go, интеграции с Google AI и телефонией Twilio, фронтенд на React.',
    url: 'https://patientgenie.ai',
    repositoryUrl: null,
    skills: [
      'Go',
      'TypeScript',
      'React',
      'Effector',
      'Микросервисы',
      'PostgreSQL',
      'Google Cloud',
    ],
  },
  {
    id: '01a1cf75-d6e6-73ba-8ad6-a39030e6412b',
    name: 'HealthNet',
    description:
      'Социальная платформа для врачей и медицинских работников. Спроектировал архитектуру и собрал команду с нуля.',
    url: 'https://healthnet.am',
    repositoryUrl: null,
    skills: [
      'Go',
      'TypeScript',
      'React',
      'Next.js',
      'React Query',
      'MongoDB',
      'GitHub Actions',
      'Sentry',
    ],
  },
  {
    id: '01a1cf75-d6e7-7276-a0be-de36d36b43c6',
    name: 'Цифровые продукты института «Стрелка»',
    description:
      'Два интернет-магазина, два онлайн-медиа, главный сайт института, образовательная платформа и инструменты визуализации данных для урбанистических исследований.',
    url: 'https://strelka.com',
    repositoryUrl: null,
    skills: [
      'TypeScript',
      'React',
      'Vue',
      'Next.js',
      'Redux',
      'React Query',
      'GraphQL',
    ],
  },
  {
    id: '01a1cf75-d6e8-70f9-84dc-c4df989ddaa1',
    name: 'iWallet',
    description:
      'Приложение и виджеты для криптоплатежей; перевод приложения с PHP на React.',
    url: 'https://iwallet.com',
    repositoryUrl: null,
    skills: ['TypeScript', 'JavaScript', 'React', 'Redux'],
  },
  {
    id: '01a1cf75-d6e9-7446-95e3-cb550091be77',
    name: 'Setka Editor',
    description: 'WYSIWYG-редактор для онлайн-медиа.',
    url: 'https://setka.io',
    repositoryUrl: null,
    skills: ['JavaScript', 'React', 'Redux'],
  },
];

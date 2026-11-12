export interface AchievementSeed {
  id: string;
  text: string;
}

export interface ExperienceSeed {
  id: string;
  company: string;
  companyUrl: string | null;
  /** Job title. */
  position: string;
  /** ISO date; the resume is precise to a month, so the day is always 01. */
  startDate: string;
  /** null means "to the present day". */
  endDate: string | null;
  /** Stored in this order: the array index becomes the display position. */
  achievements: AchievementSeed[];
}

export const experience: ExperienceSeed[] = [
  {
    id: '01a1cf57-a531-725b-83c0-2cae491ca252',
    company: 'patientgenie.ai',
    companyUrl: 'https://patientgenie.ai',
    position: 'Fullstack-разработчик',
    startDate: '2025-01-01',
    endDate: null,
    achievements: [
      {
        id: '01a1cf57-a532-7dfd-be37-1190613ba0d2',
        text: 'Разрабатывал бэкенд на Go в микросервисной архитектуре и фронтенд на React и Effector',
      },
      {
        id: '01a1cf57-a533-74d3-bcca-8e72bc246d67',
        text: 'Интегрировал сервисы Google AI (Gemini, голос) и телефонию Twilio',
      },
      {
        id: '01a1cf57-a534-724c-968b-b1a1c9be0e04',
        text: 'Администрировал базы данных PostgreSQL и поддерживал инфраструктуру в Google Cloud',
      },
      {
        id: '01a1cf57-a535-75d9-ae70-4846e14532fd',
        text: 'Улучшал клиентскую часть приложения',
      },
    ],
  },
  {
    id: '01a1cf57-a536-749b-86af-94da978dfe7e',
    company: 'Henar Foundation',
    companyUrl: 'https://healthnet.am',
    position: 'Tech lead, fullstack-разработчик',
    startDate: '2022-12-01',
    endDate: '2024-12-01',
    achievements: [
      {
        id: '01a1cf57-a537-7374-be1a-284030d5f426',
        text: 'Собрал команду с нуля: два бэкенд-разработчика, два фронтенд-разработчика и дизайнер',
      },
      {
        id: '01a1cf57-a538-76ba-a1af-e28d121e5ff7',
        text: 'Создал социальную платформу для врачей и медицинских работников',
      },
      {
        id: '01a1cf57-a539-776f-a0c6-734b8171a615',
        text: 'Спроектировал архитектуру приложения, схемы данных и API, написал техническую спецификацию, настроил CI/CD и линтеры, заложил систему компонентов',
      },
      {
        id: '01a1cf57-a53a-7342-a890-0f64dfb5ef87',
        text: 'Спроектировал и написал сервисы уведомлений, логирования, мониторинга и авторизации, а также фронтенд-приложение',
      },
      {
        id: '01a1cf57-a53b-7bcd-ae88-32ddd322bc02',
        text: 'Проводил код-ревью, ставил задачи и руководил командой',
      },
    ],
  },
  {
    id: '01a1cf57-a53c-7617-9ccb-7ec8e33fc756',
    company: 'Институт медиа, архитектуры и дизайна «Стрелка»',
    companyUrl: 'https://strelka.com',
    position: 'Старший frontend-разработчик',
    startDate: '2018-11-01',
    endDate: '2022-12-01',
    achievements: [
      {
        id: '01a1cf57-a53d-7f8d-ae48-788904f53b96',
        text: 'Собрал и возглавил команду из пяти фронтенд-разработчиков',
      },
      {
        id: '01a1cf57-a53e-7e5a-b65b-6b56019b1b19',
        text: 'Спроектировал и написал два интернет-магазина, два онлайн-медиа, главный сайт института (поиск, видео), образовательную платформу с курсами, инструменты визуализации данных для урбанистических исследований и административные интерфейсы к ним',
      },
      {
        id: '01a1cf57-a53f-793d-8407-e3c66659ef01',
        text: 'Проектировал архитектуру фронтенд-приложений, много писал и рефакторил код',
      },
      {
        id: '01a1cf57-a540-70bd-bb51-0ae39f52132d',
        text: 'Создал общий сервис авторизации и систему компонентов',
      },
      {
        id: '01a1cf57-a541-7e64-8676-cc623f687dd5',
        text: 'Тесно работал с дизайнерами, верстал pixel-perfect',
      },
    ],
  },
  {
    id: '01a1cf57-a542-7fa8-b7c1-c71346851f86',
    company: 'iWallet.com',
    companyUrl: 'https://iwallet.com',
    position: 'Lead frontend-разработчик',
    startDate: '2017-11-01',
    endDate: '2018-11-01',
    achievements: [
      {
        id: '01a1cf57-a543-718e-b9f6-305b2c47ced5',
        text: 'Пришёл senior-разработчиком и вырос до лида',
      },
      {
        id: '01a1cf57-a544-7cc7-981d-5a3081d4f85a',
        text: 'Разработал приложение и виджеты для криптоплатежей',
      },
      {
        id: '01a1cf57-a545-71c8-a411-cbd71c6e519d',
        text: 'Спроектировал и провёл перевод приложения с PHP на React',
      },
      {
        id: '01a1cf57-a546-7e07-80e3-412d5b347606',
        text: 'Проводил код-ревью, ставил задачи и руководил командой',
      },
    ],
  },
  {
    id: '01a1cf57-a547-7b4b-ae04-1ff1369e2ee8',
    company: 'Setka.io',
    companyUrl: 'https://setka.io',
    position: 'Frontend-разработчик',
    startDate: '2015-02-01',
    endDate: '2017-11-01',
    achievements: [
      {
        id: '01a1cf57-a548-78b6-85b9-11200180bb8d',
        text: 'Разрабатывал WYSIWYG-редактор для медиа',
      },
      {
        id: '01a1cf57-a549-7c47-b56a-31b278f9bf30',
        text: 'Создавал компоненты, работал вместе с другими разработчиками и дизайнерами',
      },
    ],
  },
];

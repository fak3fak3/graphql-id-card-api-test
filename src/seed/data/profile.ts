import { LinkKind } from '../../generated/prisma/enums.js';

export interface ProfileLinkSeed {
  id: string;
  kind: LinkKind;
  label: string;
  url: string;
}

export interface ProfileSeed {
  id: string;
  name: string;
  headline: string;
  description: string;
  /** Stored in this order: the array index becomes the display position. */
  links: ProfileLinkSeed[];
}

/**
 * Content of the business card. Identifiers are fixed so that the seed can be
 * re-run safely: a record is matched by id and updated in place.
 */
export const profile: ProfileSeed = {
  id: '01a1cf42-3a64-7543-937c-19809fbab27d',
  name: 'Артём Миролюбов',
  headline: 'Fullstack-разработчик',
  description:
    'Fullstack-разработчик с опытом более 11 лет. Начинал во фронтенде ' +
    '(React, TypeScript), последние годы пишу и бэкенд: микросервисы на Go, ' +
    'интеграции, базы данных, инфраструктура. Проектировал архитектуру ' +
    'приложений и дважды собирал команду разработки с нуля. Люблю ' +
    'интерфейсы, данные и ботов.',
  links: [
    {
      id: '01a1cf42-3a65-74bb-a497-695680656655',
      kind: LinkKind.GITHUB,
      label: 'GitHub',
      url: 'https://github.com/fak3fak3',
    },
  ],
};

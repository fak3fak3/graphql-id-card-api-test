import { registerEnumType } from '@nestjs/graphql';

/**
 * Part of the public API contract. Declared here rather than re-exported from
 * the Prisma client, so the GraphQL schema does not change by accident when
 * the database schema does.
 */
export enum LinkKind {
  GITHUB = 'GITHUB',
  LINKEDIN = 'LINKEDIN',
  TELEGRAM = 'TELEGRAM',
  EMAIL = 'EMAIL',
  WEBSITE = 'WEBSITE',
  OTHER = 'OTHER',
}

registerEnumType(LinkKind, {
  name: 'LinkKind',
  description: 'Kind of a professional resource a link points to.',
});

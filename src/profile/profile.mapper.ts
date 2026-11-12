import type {
  Profile as ProfileRecord,
  ProfileLink as ProfileLinkRecord,
} from '../generated/prisma/client.js';
import { LinkKind } from './models/link-kind.enum.js';
import type { ProfileLink } from './models/profile-link.model.js';
import type { Profile } from './models/profile.model.js';

/**
 * Database records -> API models. Fields are listed explicitly: a column added
 * to a table (or an internal one such as profileId) is not exposed until it is
 * mapped here on purpose.
 */
export function toProfile(record: ProfileRecord): Profile {
  return {
    id: record.id,
    name: record.name,
    headline: record.headline,
    description: record.description,
  };
}

export function toProfileLink(record: ProfileLinkRecord): ProfileLink {
  return {
    id: record.id,
    // Both enums share their string values; the lookup keeps that checked.
    kind: LinkKind[record.kind],
    label: record.label,
    url: record.url,
  };
}

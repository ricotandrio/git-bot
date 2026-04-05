import type { DbClient } from '../../db.client';
import type { GetUserMappingPayload, UserMappingRow } from '../userMappings.types';

export function getUserMapping(
  db: ReturnType<DbClient['getDbClient']>,
  payload: GetUserMappingPayload,
): UserMappingRow | null {
  const row = db
    .prepare(
      `
    SELECT github_username FROM user_mappings WHERE discord_id = ?
  `,
    )
    .get(payload.discordId) as UserMappingRow | undefined;

  if (!row) return null;

  return row;
}

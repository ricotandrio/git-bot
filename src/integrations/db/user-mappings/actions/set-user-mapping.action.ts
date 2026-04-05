import type { DbClient } from '../../db.client';
import type { SetUserMappingPayload } from '../user-mappings.types';

export function setUserMapping(
  db: ReturnType<DbClient['getDb']>,
  payload: SetUserMappingPayload,
): void {
  db.prepare(
    `
    INSERT INTO user_mappings (discord_id, github_username)
    VALUES (?, ?)
    ON CONFLICT(discord_id) DO UPDATE SET github_username = excluded.github_username
  `,
  ).run(payload.discordId, payload.githubUsername);
}

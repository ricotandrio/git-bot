import type { DbClient } from '../../db.client';
import type {
  GetGuildRepositoriesPayload,
  GuildRepositoryRow,
} from '../guild-repositories.types';

export function getGuildRepositories(
  db: ReturnType<DbClient['getDb']>,
  payload: GetGuildRepositoriesPayload,
): string[] {
  const rows = db
    .prepare(
      `
    SELECT repo_name FROM guild_repositories
    WHERE guild_id = ?
  `,
    )
    .all(payload.guildId) as GuildRepositoryRow[];

  return rows.map((row) => row.repo_name);
}

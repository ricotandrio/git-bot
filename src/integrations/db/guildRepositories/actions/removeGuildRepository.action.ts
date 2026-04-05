import type { DbClient } from '../../db.client';
import type { RemoveGuildRepositoryPayload } from '../guildRepositories.types';

export function removeGuildRepository(
  db: ReturnType<DbClient['getDbClient']>,
  payload: RemoveGuildRepositoryPayload,
): void {
  db.prepare(
    `
    DELETE FROM guild_repositories
    WHERE guild_id = ? AND repo_name = ?
  `,
  ).run(payload.guildId, payload.repoName);
}

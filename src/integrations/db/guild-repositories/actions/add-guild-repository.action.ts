import type { DbClient } from '../../db.client';
import type { AddGuildRepositoryPayload } from '../guild-repositories.types';

export function addGuildRepository(
  db: ReturnType<DbClient['getDb']>,
  payload: AddGuildRepositoryPayload,
): void {
  db.prepare(
    `
    INSERT OR IGNORE INTO guild_repositories (guild_id, repo_name)
    VALUES (?, ?)
  `,
  ).run(payload.guildId, payload.repoName);
}

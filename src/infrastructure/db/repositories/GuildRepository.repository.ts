import { db } from '../client';

export class GuildRepository {
  static add(guildId: string, repository: string) {
    db.prepare(
      `
      INSERT OR IGNORE INTO guild_repositories (guild_id, repo_name)
      VALUES (?, ?)
    `,
    ).run(guildId, repository);
  }

  static remove(guildId: string, repository: string) {
    db.prepare(
      `
      DELETE FROM guild_repositories
      WHERE guild_id = ? AND repo_name = ?
    `,
    ).run(guildId, repository);
  }

  static getAll(guildId: string): string[] {
    const rows = db
      .prepare(
        `
      SELECT repo_name FROM guild_repositories
      WHERE guild_id = ?
    `,
      )
      .all(guildId) as { repo_name: string }[];

    return rows.map((row) => row.repo_name);
  }
}

import { db } from '../client';

export class GuildRepository {
  static async add(guildId: string, repository: string) {
    db.prepare(
      `
      INSERT OR IGNORE INTO guild_repositories (guild_id, repo_name)
      VALUES (?, ?)
    `,
    ).run(guildId, repository);
  }

  static async remove(guildId: string, repository: string) {
    db.prepare(
      `
      DELETE FROM guild_repositories
      WHERE guild_id = ? AND repo_name = ?
    `,
    ).run(guildId, repository);
  }

  static async getAll(guildId: string): Promise<string[]> {
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

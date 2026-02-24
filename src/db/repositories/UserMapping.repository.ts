import { db } from '../client';

export class UserMappingRepository {
  static async add(discordUserId: string, githubUsername: string) {
    db.prepare(
      `
      INSERT OR REPLACE INTO user_mappings (discord_user_id, github_username)
      VALUES (?, ?)
    `,
    ).run(discordUserId, githubUsername);
  }

  static async remove(discordUserId: string) {
    db.prepare(
      `
      DELETE FROM user_mappings
      WHERE discord_user_id = ?
    `,
    ).run(discordUserId);
  }

  static async getGithubUsername(
    discordUserId: string,
  ): Promise<string | null> {
    const row = db
      .prepare(
        `
      SELECT github_username FROM user_mappings
      WHERE discord_user_id = ?
    `,
      )
      .get(discordUserId) as { github_username: string } | undefined;

    return row ? row.github_username : null;
  }
}

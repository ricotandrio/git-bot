import { db } from '../client';

export class DbUserMappingRepository {
  static add(discordUserId: string, githubUsername: string) {
    db.prepare(
      `
      INSERT OR REPLACE INTO user_mappings (discord_user_id, github_username)
      VALUES (?, ?)
    `,
    ).run(discordUserId, githubUsername);
  }

  static remove(discordUserId: string) {
    db.prepare(
      `
      DELETE FROM user_mappings
      WHERE discord_user_id = ?
    `,
    ).run(discordUserId);
  }

  static getGithubUsername(discordUserId: string): string | null {
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

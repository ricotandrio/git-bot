import { db } from './client';

export function addGuildRepository(guildId: string, repoName: string): void {
  db.prepare(
    `
    INSERT OR IGNORE INTO guild_repositories (guild_id, repo_name)
    VALUES (?, ?)
  `,
  ).run(guildId, repoName);
}

export function removeGuildRepository(guildId: string, repoName: string): void {
  db.prepare(
    `
    DELETE FROM guild_repositories
    WHERE guild_id = ? AND repo_name = ?
  `,
  ).run(guildId, repoName);
}

export function getGuildRepositories(guildId: string): string[] {
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

export function getUserMapping(
  discordId: string,
): { githubUsername: string } | null {
  const row = db
    .prepare(
      `
    SELECT github_username FROM user_mappings WHERE discord_id = ?
  `,
    )
    .get(discordId) as { github_username: string } | undefined;

  if (!row) return null;
  return { githubUsername: row.github_username };
}

export function setUserMapping(
  discordId: string,
  githubUsername: string,
): void {
  db.prepare(
    `
    INSERT INTO user_mappings (discord_id, github_username)
    VALUES (?, ?)
    ON CONFLICT(discord_id) DO UPDATE SET github_username = excluded.github_username
  `,
  ).run(discordId, githubUsername);
}

export function deleteUserMapping(discordId: string): void {
  db.prepare(`DELETE FROM user_mappings WHERE discord_id = ?`).run(discordId);
}

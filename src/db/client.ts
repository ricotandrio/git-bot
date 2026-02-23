import Database from 'better-sqlite3';
import { logger } from '@/lib/logger';

export const db: Database.Database = new Database('./data/gitbot.db');

export function initDb(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS guild_repositories (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      guild_id    TEXT NOT NULL,
      repo_name   TEXT NOT NULL,
      created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(guild_id, repo_name)
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS user_mappings (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      discord_id      TEXT NOT NULL UNIQUE,
      github_username TEXT NOT NULL,
      created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  logger.info('Database initialized');
}

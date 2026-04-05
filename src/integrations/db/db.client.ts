import Database from 'better-sqlite3';
import { logger } from '@/utils/logger';

export type DbStatement = {
  run: (...params: any[]) => unknown;
  all: (...params: any[]) => unknown;
  get: (...params: any[]) => unknown;
};

export type DbConnection = {
  exec: (sql: string) => void;
  prepare: (sql: string) => DbStatement;
};

export class DbClient {
  private db: Database.Database;
  
  constructor(dbPath: string) {
    this.db = new Database(dbPath);
  }

  getDb(): DbConnection {
    return this.db;
  }

  initDb(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS guild_repositories (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        guild_id    TEXT NOT NULL,
        repo_name   TEXT NOT NULL,
        created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(guild_id, repo_name)
      );
    `);

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS user_mappings (
        id              INTEGER PRIMARY KEY AUTOINCREMENT,
        discord_id      TEXT NOT NULL UNIQUE,
        github_username TEXT NOT NULL,
        created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    logger.info('Database initialized');
  }
}
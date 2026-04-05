import { Integration } from "../integration.interface";
import { DbClient } from "./db.client";
import { DbAction } from './db.types';
import { addGuildRepository, removeGuildRepository, getGuildRepositories } from "./guildRepositories";
import { getUserMapping, setUserMapping, deleteUserMapping } from "./userMappings";

export class DBIntegration implements Integration {
  name = 'db';

  private client!: DbClient;

  async connect(config: { dbPath: string }) {
    this.client = new DbClient(config.dbPath);
    this.client.initDb();
  }

  getClient(): DbClient {
    if (!this.client) {
      throw new Error('DB integration is not connected');
    }

    return this.client;
  }

  async execute(action: DbAction, payload: any) {
    switch (action) {
      case 'add_guild_repository':
        return addGuildRepository(this.getClient().getDbClient(), payload);
      case 'remove_guild_repository':
        return removeGuildRepository(this.getClient().getDbClient(), payload);
      case 'get_guild_repositories':
        return getGuildRepositories(this.getClient().getDbClient(), payload);
      case 'get_user_mapping':
        return getUserMapping(this.getClient().getDbClient(), payload);
      case 'set_user_mapping':
        return setUserMapping(this.getClient().getDbClient(), payload);
      case 'delete_user_mapping':
        return deleteUserMapping(this.getClient().getDbClient(), payload);
      default:
        throw new Error(`Action ${action} not supported`);
    }
  }
}

export const dbIntegration = new DBIntegration();
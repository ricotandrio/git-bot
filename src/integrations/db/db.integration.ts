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

  async execute(action: DbAction, payload: any) {
    switch (action) {
      case 'add_guild_repository':
        return addGuildRepository(this.client.getDbClient(), payload);
      case 'remove_guild_repository':
        return removeGuildRepository(this.client.getDbClient(), payload);
      case 'get_guild_repositories':
        return getGuildRepositories(this.client.getDbClient(), payload);
      case 'get_user_mapping':
        return getUserMapping(this.client.getDbClient(), payload);
      case 'set_user_mapping':
        return setUserMapping(this.client.getDbClient(), payload);
      case 'delete_user_mapping':
        return deleteUserMapping(this.client.getDbClient(), payload);
      default:
        throw new Error(`Action ${action} not supported`);
    }
  }
}

export const dbIntegration = new DBIntegration();
export type DbAction =
  | 'add_guild_repository'
  | 'remove_guild_repository'
  | 'get_guild_repositories'
  | 'get_user_mapping'
  | 'set_user_mapping'
  | 'delete_user_mapping';

export type DbActionPayload = {}
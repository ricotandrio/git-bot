export type GuildRepositoryRow = {
  repo_name: string;
};

export type AddGuildRepositoryPayload = {
  guildId: string;
  repoName: string;
};

export type RemoveGuildRepositoryPayload = {
  guildId: string;
  repoName: string;
};

export type GetGuildRepositoriesPayload = {
  guildId: string;
};

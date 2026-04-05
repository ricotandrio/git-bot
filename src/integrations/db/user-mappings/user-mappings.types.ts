export type UserMappingRow = {
	github_username: string;
};

export type GetUserMappingPayload = {
	discordId: string;
};

export type SetUserMappingPayload = {
	discordId: string;
	githubUsername: string;
};

export type DeleteUserMappingPayload = {
	discordId: string;
};

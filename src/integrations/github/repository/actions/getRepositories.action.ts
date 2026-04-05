import { GithubClient } from "../../github.client";
import { GetRepositoriesPayload } from "../repository.types";

export const getRepositories = async (
  client: GithubClient,
  payload: GetRepositoriesPayload
) => {
  const octokit = client.getClient();

  const response = await octokit.repos.listForUser({
    username: payload.username,
  });

  return response.data.map((repo) => ({
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description,
    htmlUrl: repo.html_url,
  }));
};
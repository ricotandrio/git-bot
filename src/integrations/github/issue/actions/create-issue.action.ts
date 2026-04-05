import { GithubClient } from "../../github.client";
import { CreateIssuePayload } from "../issue.types";

export const createIssue = async (
  client: GithubClient,
  payload: CreateIssuePayload
) => {
  const octokit = client.getClient();

  const response = await octokit.issues.create({
    owner: payload.owner,
    repo: payload.repo,
    title: payload.title,
    body: payload.body,
    labels: [payload.label],
  });

  return response.data;
};
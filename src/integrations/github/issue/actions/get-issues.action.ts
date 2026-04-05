import { GithubClient } from '../../github.client';
import { GetIssuesPayload } from '../issue.types';

export const getIssues = async (
  client: GithubClient,
  payload: GetIssuesPayload,
) => {
  const octokit = client.getClient();

  const response = await octokit.issues.listForRepo({
    owner: payload.owner,
    repo: payload.repo,
    state: payload.state,
  });

  return response.data.map((issue) => ({
    number: issue.number,
    title: issue.title,
    body: issue.body,
    htmlUrl: issue.html_url,
    assignees: issue.assignees?.map((assignee) => assignee.login),
  }));
};

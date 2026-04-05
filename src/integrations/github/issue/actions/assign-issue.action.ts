import { GithubClient } from '../../github.client';
import { AssignIssuePayload } from '../issue.types';

export const assignIssue = async (
  client: GithubClient,
  payload: AssignIssuePayload,
) => {
  const octokit = client.getClient();

  await octokit.issues.addAssignees({
    owner: payload.owner,
    repo: payload.repo,
    issue_number: payload.issue_number,
    assignees: payload.assignees,
  });
};

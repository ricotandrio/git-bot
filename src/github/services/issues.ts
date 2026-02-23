import { octokit } from '../client';
import { config } from '@/config';

// Create an issue
export async function createIssue(title: string, body: string, label: string, repoName?: string) {
  const response = await octokit.issues.create({
    owner: config.GITHUB.OWNER,
    repo: repoName || config.GITHUB.REPO,
    title,
    body,
    labels: [label],
  });

  return response.data; // { number, html_url, id, node_id }
}

// Assign an issue
export async function assignIssue(issueNumber: number, githubUsername: string, repoName?: string) {
  const response = await octokit.issues.addAssignees({
    owner: config.GITHUB.OWNER,
    repo: repoName || config.GITHUB.REPO,
    issue_number: issueNumber,
    assignees: [githubUsername],
  });

  return response.data;
}
import { octokit } from '../client';
import { config } from '@/config';

// Create an issue
export async function createIssue(
  title: string,
  body: string,
  label: string,
  repoName: string,
) {
  const response = await octokit.issues.create({
    owner: config.GITHUB.OWNER,
    repo: repoName,
    title,
    body,
    labels: [label],
  });

  return response.data;
}

// Assign an issue
export async function assignIssue(
  issueNumber: number,
  githubUsername: string,
  repoName: string,
) {
  const response = await octokit.issues.addAssignees({
    owner: config.GITHUB.OWNER,
    repo: repoName,
    issue_number: issueNumber,
    assignees: [githubUsername],
  });

  return response.data;
}

export interface Issue {
  number: number;
  title: string;
  htmlUrl: string;
  assignees: string[]; 
}

// List open issues for a repository
export async function listIssues(repoName: string): Promise<Issue[]> {
  const response = await octokit.issues.listForRepo({
    owner: config.GITHUB.OWNER,
    repo: repoName,
    state: 'open',
  });

  return response.data.map(issue => ({
    number: issue.number,
    title: issue.title,
    htmlUrl: issue.html_url,
    assignees: issue.assignees?.map(a => a.login) ?? [],
  }));
}
import { config } from '@/config';
import { dbIntegration } from '@/integrations/db';
import { getGuildRepositories } from '@/integrations/db/guildRepositories';
import { getUserMapping } from '@/integrations/db/userMappings';
import { githubIntegration } from '@/integrations/github';

export type Issue = {
  number: number;
  title: string;
  body?: string | null;
  htmlUrl: string;
  assignees: string[];
};

export type CreateIssueResult =
  | { success: true; issueUrl: string }
  | { success: false; reason: 'REPO_NOT_CONFIGURED' }
  | { success: false; reason: 'EXTERNAL_ERROR' };

export type AssignIssueResult =
  | { success: true }
  | { success: false; reason: 'USER_NOT_LINKED' }
  | { success: false; reason: 'REPO_NOT_CONFIGURED' }
  | { success: false; reason: 'EXTERNAL_ERROR' };

export type GetIssuesResult =
  | { success: true; issues: Issue[] }
  | { success: false; reason: 'REPO_NOT_CONFIGURED' }
  | { success: false; reason: 'EXTERNAL_ERROR' };

export async function createIssue(
  guildId: string,
  repoName: string,
  title: string,
  description: string,
  label: string,
): Promise<CreateIssueResult> {
  const db = dbIntegration.getClient().getDb();
  const repos = getGuildRepositories(db, { guildId });

  if (!repos.includes(repoName)) {
    return { success: false, reason: 'REPO_NOT_CONFIGURED' };
  }

  try {
    const issue = await githubIntegration.execute('create_issue', {
      owner: config.GITHUB.OWNER,
      repo: repoName,
      title: `[GITBOT] ${title}`,
      body: description,
      label,
    }) as { html_url: string };

    return {
      success: true,
      issueUrl: issue.html_url,
    };
  } catch {
    return { success: false, reason: 'EXTERNAL_ERROR' };
  }
}

export async function assignIssue(
  guildId: string,
  discordUserId: string,
  repoName: string,
  issueNumber: number,
): Promise<AssignIssueResult> {
  const db = dbIntegration.getClient().getDb();
  const githubUsername = getUserMapping(db, { discordId: discordUserId });

  if (!githubUsername) {
    return { success: false, reason: 'USER_NOT_LINKED' };
  }

  const repos = getGuildRepositories(db, { guildId });

  if (!repos.includes(repoName)) {
    return { success: false, reason: 'REPO_NOT_CONFIGURED' };
  }

  try {
    await githubIntegration.execute('assign_issue', {
      owner: config.GITHUB.OWNER,
      repo: repoName,
      issue_number: issueNumber,
      assignees: [githubUsername.github_username],
    });

    return { success: true };
  } catch {
    return { success: false, reason: 'EXTERNAL_ERROR' };
  }
}

export async function getIssues(
  guildId: string,
  repoName: string,
): Promise<GetIssuesResult> {
  const db = dbIntegration.getClient().getDb();
  const repos = getGuildRepositories(db, { guildId });

  if (!repos.includes(repoName)) {
    return { success: false, reason: 'REPO_NOT_CONFIGURED' };
  }

  try {
    const issues = await githubIntegration.execute('get_issues', {
      owner: config.GITHUB.OWNER,
      repo: repoName,
      state: 'open',
    }) as Array<{
      number: number;
      title: string;
      body?: string | null;
      htmlUrl: string;
      assignees?: string[];
    }>;

    return {
      success: true,
      issues: issues.map((issue) => ({
        number: issue.number,
        title: issue.title,
        body: issue.body ?? null,
        htmlUrl: issue.htmlUrl,
        assignees: issue.assignees ?? [],
      })),
    };
  } catch {
    return { success: false, reason: 'EXTERNAL_ERROR' };
  }
}
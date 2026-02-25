import { IssueService } from '@/infrastructure/github/services';
import { DbGuildRepository, DbUserMappingRepository } from '@/infrastructure/db';

// CREATE ISSUE
export type CreateIssueResult =
  | { success: true; issueUrl: string }
  | { success: false; reason: 'REPO_NOT_CONFIGURED' }
  | { success: false; reason: 'EXTERNAL_ERROR' };

export async function createIssue(
  guildId: string,
  repoName: string,
  title: string,
  description: string,
  label: string,
): Promise<CreateIssueResult> {
  const repos = DbGuildRepository.getAll(guildId);

  if (!repos.includes(repoName)) {
    return { success: false, reason: 'REPO_NOT_CONFIGURED' };
  }

  try {
    const issue = await IssueService.create(
      title,
      description,
      label,
      repoName,
    );

    return {
      success: true,
      issueUrl: issue.html_url,
    };
  } catch {
    return { success: false, reason: 'EXTERNAL_ERROR' };
  }
}

// ASSIGN ISSUE
export type AssignIssueResult =
  | { success: true }
  | { success: false; reason: 'USER_NOT_LINKED' }
  | { success: false; reason: 'REPO_NOT_CONFIGURED' }
  | { success: false; reason: 'EXTERNAL_ERROR' };

export async function assignIssue(
  guildId: string,
  discordUserId: string,
  repoName: string,
  issueNumber: number,
): Promise<AssignIssueResult> {
  const githubUsername = DbUserMappingRepository.getGithubUsername(discordUserId);

  if (!githubUsername) {
    return { success: false, reason: 'USER_NOT_LINKED' };
  }

  const repos = DbGuildRepository.getAll(guildId);

  if (!repos.includes(repoName)) {
    return { success: false, reason: 'REPO_NOT_CONFIGURED' };
  }

  try {
    await IssueService.assign(issueNumber, repoName, githubUsername);
    return { success: true };
  } catch {
    return { success: false, reason: 'EXTERNAL_ERROR' };
  }
}

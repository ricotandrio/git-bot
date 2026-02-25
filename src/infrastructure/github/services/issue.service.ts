import type { Issue } from '@/domain/entities';
import { octokit } from '../client';
import { config } from '@/infrastructure/config';
import { logger } from '@/lib';

export class IssueService {
  static async create(
    title: string,
    body: string,
    label: string,
    repoName: string,
  ) {
    try {
      const response = await octokit.issues.create({
        owner: config.GITHUB.OWNER,
        repo: repoName,
        title,
        body,
        labels: [label],
      });

      return response.data;
    } catch (error) {
      logger.error(`Error creating issue in ${repoName}:`);
      throw error;
    }
  }

  static async assign(
    issueNumber: number,
    githubUsername: string,
    repoName: string,
  ) {
    try {
      const response = await octokit.issues.addAssignees({
        owner: config.GITHUB.OWNER,
        repo: repoName,
        issue_number: issueNumber,
        assignees: [githubUsername],
      });

      return response.data;
    } catch (error) {
      logger.error(
        `Error assigning issue #${issueNumber} to ${githubUsername} in ${repoName}:`,
      );
      throw error;
    }
  }

  static async getIssues(repoName: string): Promise<Issue[]> {
    try {
      const response = await octokit.issues.listForRepo({
        owner: config.GITHUB.OWNER,
        repo: repoName,
        state: 'open',
      });

      return response.data.map((issue) => ({
        number: issue.number,
        title: issue.title,
        htmlUrl: issue.html_url,
        assignees: issue.assignees?.map((a) => a.login) ?? [],
      }));
    } catch (error) {
      logger.error(`Error fetching issues for ${repoName}`);
      return [];
    }
  }
}

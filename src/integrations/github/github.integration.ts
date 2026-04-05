import { Integration } from "../integration.interface";
import { assignIssue, createIssue, getIssues } from "./issue";
import { GithubClient } from "./github.client";
import { GithubAction } from "./github.types";
import { getRepositories } from "./repository";

export class GithubIntegration implements Integration {
  name = "github";

  private client!: GithubClient;

  async connect(config: { token: string }) {
    this.client = new GithubClient(config.token);
  }

  async execute(action: GithubAction, payload: any) {
    switch (action) {
      case "create_issue":
        return createIssue(this.client, payload);
      case "assign_issue":
        return assignIssue(this.client, payload);
      case "get_issues":
        return getIssues(this.client, payload);
      case "get_repositories":
        return getRepositories(this.client, payload);
      default:
        throw new Error(`Action ${action} not supported`);
    }
  }
}
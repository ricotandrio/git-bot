import { Octokit } from "@octokit/rest";

export class GithubClient {
  private client: Octokit;

  constructor(token: string) {
    this.client = new Octokit({ auth: token });
  }

  getClient() {
    return this.client;
  }
}
import {
  CreateIssuePayload,
  GetIssuesPayload,
  AssignIssuePayload,
} from './issue';
import { GetRepositoriesPayload } from './repository';

export type GithubAction =
  | 'create_issue'
  | 'assign_issue'
  | 'get_issues'
  | 'get_repositories';

export type GithubActionPayload = {
  create_issue: CreateIssuePayload;
  assign_issue: AssignIssuePayload;
  get_issues: GetIssuesPayload;
  get_repositories: GetRepositoriesPayload;
};

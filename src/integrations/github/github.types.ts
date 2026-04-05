import { CreateIssuePayload, GetIssuesPayload, AssignIssuePayload } from "./issue/issue.types";

export type GithubAction =
  | "create_issue"
  | "assign_issue"
  | "get_issues";

export type GithubActionPayload = {
  create_issue: CreateIssuePayload;
  assign_issue: AssignIssuePayload;
  get_issues: GetIssuesPayload;
}
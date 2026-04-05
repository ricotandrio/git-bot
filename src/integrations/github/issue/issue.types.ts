export interface AssignIssuePayload {
  owner: string;
  repo: string;
  issue_number: number;
  assignees: string[];
}

export interface CreateIssuePayload {
  owner: string;
  repo: string;
  title: string;
  body: string;
  label: string;
}

export interface GetIssuesPayload {
  owner: string;
  repo: string;
  state: 'open' | 'closed' | 'all';
}
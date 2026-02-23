import { Octokit } from '@octokit/rest';
import { graphql } from '@octokit/graphql';
import { config } from '@/config';

// REST client — for issues, PRs, repos
export const octokit = new Octokit({
  auth: config.GITHUB.TOKEN,
});

// GraphQL client — for Projects V2
export const graphqlClient = graphql.defaults({
  headers: {
    authorization: `token ${config.GITHUB.TOKEN}`,
  },
});

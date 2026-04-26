import { requireEnv } from './env';

export const githubConfig = {
  TOKEN: requireEnv('GITHUB_PAT'),
  OWNER: requireEnv('GITHUB_OWNER'),
  REPO: requireEnv('GITHUB_REPO'),
};

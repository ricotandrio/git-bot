import { dbIntegration } from '@/integrations/db';
import {
  deleteUserMapping,
  getUserMapping,
  setUserMapping,
} from '@/integrations/db/user-mappings';

export type LinkGithubAccountResult =
  | { success: true; githubUsername: string }
  | { success: false; reason: 'ALREADY_LINKED'; existingUsername: string }
  | { success: false; reason: 'INVALID_USERNAME' }
  | { success: false; reason: 'PERSISTENCE_ERROR' };

export type UnlinkGithubAccountResult =
  | { success: true }
  | { success: false; reason: 'NOT_LINKED' }
  | { success: false; reason: 'PERSISTENCE_ERROR' };

export function linkGithubAccount(
  discordUserId: string,
  githubUsername: string,
): LinkGithubAccountResult {
  const trimmed = githubUsername.trim();
  const db = dbIntegration.getClient().getDb();

  const existing = getUserMapping(db, { discordId: discordUserId });
  if (existing) {
    return {
      success: false,
      reason: 'ALREADY_LINKED',
      existingUsername: existing.github_username,
    };
  }

  const isValid = /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/.test(
    trimmed,
  );

  if (!isValid) {
    return {
      success: false,
      reason: 'INVALID_USERNAME',
    };
  }

  try {
    setUserMapping(db, { discordId: discordUserId, githubUsername: trimmed });

    return {
      success: true,
      githubUsername: trimmed,
    };
  } catch {
    return {
      success: false,
      reason: 'PERSISTENCE_ERROR',
    };
  }
}

export function unlinkGithubAccount(
  discordUserId: string,
): UnlinkGithubAccountResult {
  const db = dbIntegration.getClient().getDb();
  const existing = getUserMapping(db, { discordId: discordUserId });

  if (!existing) {
    return {
      success: false,
      reason: 'NOT_LINKED',
    };
  }

  try {
    deleteUserMapping(db, { discordId: discordUserId });

    return {
      success: true,
    };
  } catch {
    return {
      success: false,
      reason: 'PERSISTENCE_ERROR',
    };
  }
}
import { DbUserMappingRepository } from "@/infrastructure/db";

// LINK GITHUB ACCOUNT
export type LinkGithubAccountResult =
  | { success: true; githubUsername: string }
  | { success: false; reason: 'ALREADY_LINKED'; existingUsername: string }
  | { success: false; reason: 'INVALID_USERNAME' }
  | { success: false; reason: 'PERSISTENCE_ERROR' };

export function linkGithubAccount(
  discordUserId: string,
  githubUsername: string,
): LinkGithubAccountResult {
  const trimmed = githubUsername.trim();

  const existing = DbUserMappingRepository.getGithubUsername(discordUserId);
  if (existing) {
    return {
      success: false,
      reason: 'ALREADY_LINKED',
      existingUsername: existing,
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
    DbUserMappingRepository.add(discordUserId, trimmed);

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

// UNLINK GITHUB ACCOUNT
export type UnlinkGithubAccountResult =
  | { success: true }
  | { success: false; reason: 'NOT_LINKED' }
  | { success: false; reason: 'PERSISTENCE_ERROR' };

export function unlinkGithubAccount(
  discordUserId: string,
): UnlinkGithubAccountResult {
  const existing = DbUserMappingRepository.getGithubUsername(discordUserId);
  if (!existing) {
    return {
      success: false,
      reason: 'NOT_LINKED',
    };
  }

  try {
    DbUserMappingRepository.remove(discordUserId);

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

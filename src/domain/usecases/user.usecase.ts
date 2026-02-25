import { UserMappingRepository } from '@/domain/repositories';

// LINK GITHUB ACCOUNT
export type LinkGithubAccountResult =
  | { success: true; githubUsername: string }
  | { success: false; reason: 'ALREADY_LINKED'; existingUsername: string }
  | { success: false; reason: 'INVALID_USERNAME' }
  | { success: false; reason: 'PERSISTENCE_ERROR' };

export async function linkGithubAccount(
  discordUserId: string,
  githubUsername: string,
): Promise<LinkGithubAccountResult> {
  const trimmed = githubUsername.trim();

  const existing = UserMappingRepository.getGithubUsername(discordUserId);
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
    UserMappingRepository.add(discordUserId, trimmed);

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

export async function unlinkGithubAccount(
  discordUserId: string,
): Promise<UnlinkGithubAccountResult> {
  const existing = UserMappingRepository.getGithubUsername(discordUserId);
  if (!existing) {
    return {
      success: false,
      reason: 'NOT_LINKED',
    };
  }

  try {
    UserMappingRepository.remove(discordUserId);

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

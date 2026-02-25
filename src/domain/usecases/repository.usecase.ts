import { DbGuildRepository } from "@/infrastructure/db";

// ADD REPOSITORY
export type AddRepositoryResult =
  | { success: true; repoName: string }
  | { success: false; reason: 'INVALID_FORMAT' }
  | { success: false; reason: 'DUPLICATE' }
  | { success: false; reason: 'PERSISTENCE_ERROR' };

export function addRepositoryToDatabase(
  guildId: string,
  repoName: string,
): AddRepositoryResult {
  const trimmed = repoName.trim();

  // validate format
  if (trimmed.includes(' ') || trimmed.includes('github.com')) {
    return { success: false, reason: 'INVALID_FORMAT' };
  }

  const existing = DbGuildRepository.getAll(guildId);

  if (existing.includes(trimmed)) {
    return { success: false, reason: 'DUPLICATE' };
  }

  try {
    DbGuildRepository.add(guildId, trimmed);
    return { success: true, repoName: trimmed };
  } catch {
    return { success: false, reason: 'PERSISTENCE_ERROR' };
  }
}

// REMOVE REPOSITORY
export type RemoveRepositoryResult =
  | { success: true }
  | { success: false; reason: 'NOT_FOUND' }
  | { success: false; reason: 'PERSISTENCE_ERROR' };

export function removeRepositoryFromDatabase(
  guildId: string,
  repoName: string,
): RemoveRepositoryResult {
  const existing = DbGuildRepository.getAll(guildId);

  if (!existing.includes(repoName)) {
    return { success: false, reason: 'NOT_FOUND' };
  }

  try {
    DbGuildRepository.remove(guildId, repoName);
    return { success: true };
  } catch {
    return { success: false, reason: 'PERSISTENCE_ERROR' };
  }
}

// LIST REPOSITORIES
export type ListRepositoriesResult =
  | { success: true; repositories: string[] }
  | { success: false; reason: 'PERSISTENCE_ERROR' };

export function listRepositoriesFromDatabase(
  guildId: string,
): ListRepositoriesResult {
  try {
    const repos = DbGuildRepository.getAll(guildId);
    return { success: true, repositories: repos };
  } catch {
    return { success: false, reason: 'PERSISTENCE_ERROR' };
  }
}
import { GuildRepository } from '@/infrastructure/db';

// ADD REPOSITORY
export type AddRepositoryResult =
  | { success: true; repoName: string }
  | { success: false; reason: 'INVALID_FORMAT' }
  | { success: false; reason: 'DUPLICATE' }
  | { success: false; reason: 'PERSISTENCE_ERROR' };

export async function addRepositoryToDatabase(
  guildId: string,
  repoName: string,
): Promise<AddRepositoryResult> {
  const trimmed = repoName.trim();

  // validate format
  if (trimmed.includes(' ') || trimmed.includes('github.com')) {
    return { success: false, reason: 'INVALID_FORMAT' };
  }

  const existing = GuildRepository.getAll(guildId);

  if (existing.includes(trimmed)) {
    return { success: false, reason: 'DUPLICATE' };
  }

  try {
    GuildRepository.add(guildId, trimmed);
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

export async function removeRepositoryFromDatabase(
  guildId: string,
  repoName: string,
): Promise<RemoveRepositoryResult> {
  const existing = GuildRepository.getAll(guildId);

  if (!existing.includes(repoName)) {
    return { success: false, reason: 'NOT_FOUND' };
  }

  try {
    GuildRepository.remove(guildId, repoName);
    return { success: true };
  } catch {
    return { success: false, reason: 'PERSISTENCE_ERROR' };
  }
}

// LIST REPOSITORIES
export type ListRepositoriesResult =
  | { success: true; repositories: string[] }
  | { success: false; reason: 'PERSISTENCE_ERROR' };

export async function listRepositoriesFromDatabase(
  guildId: string,
): Promise<ListRepositoriesResult> {
  try {
    const repos = GuildRepository.getAll(guildId);
    return { success: true, repositories: repos };
  } catch {
    return { success: false, reason: 'PERSISTENCE_ERROR' };
  }
}
import { dbIntegration } from '@/integrations/db';
import {
  addGuildRepository,
  getGuildRepositories,
  removeGuildRepository,
} from '@/integrations/db/guild-repositories';

export type AddRepositoryResult =
  | { success: true; repoName: string }
  | { success: false; reason: 'INVALID_FORMAT' }
  | { success: false; reason: 'DUPLICATE' }
  | { success: false; reason: 'PERSISTENCE_ERROR' };

export type RemoveRepositoryResult =
  | { success: true }
  | { success: false; reason: 'NOT_FOUND' }
  | { success: false; reason: 'PERSISTENCE_ERROR' };

export type ListRepositoriesResult =
  | { success: true; repositories: string[] }
  | { success: false; reason: 'PERSISTENCE_ERROR' };

export function addRepositoryToDatabase(
  guildId: string,
  repoName: string,
): AddRepositoryResult {
  const trimmed = repoName.trim();

  if (trimmed.includes(' ') || trimmed.includes('github.com')) {
    return { success: false, reason: 'INVALID_FORMAT' };
  }

  const db = dbIntegration.getClient().getDb();
  const existing = getGuildRepositories(db, { guildId });

  if (existing.includes(trimmed)) {
    return { success: false, reason: 'DUPLICATE' };
  }

  try {
    addGuildRepository(db, { guildId, repoName: trimmed });
    return { success: true, repoName: trimmed };
  } catch {
    return { success: false, reason: 'PERSISTENCE_ERROR' };
  }
}

export function removeRepositoryFromDatabase(
  guildId: string,
  repoName: string,
): RemoveRepositoryResult {
  const db = dbIntegration.getClient().getDb();
  const existing = getGuildRepositories(db, { guildId });

  if (!existing.includes(repoName)) {
    return { success: false, reason: 'NOT_FOUND' };
  }

  try {
    removeGuildRepository(db, { guildId, repoName });
    return { success: true };
  } catch {
    return { success: false, reason: 'PERSISTENCE_ERROR' };
  }
}

export function listRepositoriesFromDatabase(
  guildId: string,
): ListRepositoriesResult {
  try {
    const db = dbIntegration.getClient().getDb();
    const repositories = getGuildRepositories(db, { guildId });
    return { success: true, repositories };
  } catch {
    return { success: false, reason: 'PERSISTENCE_ERROR' };
  }
}

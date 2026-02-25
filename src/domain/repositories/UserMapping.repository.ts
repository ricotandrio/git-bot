import { DbUserMappingRepository } from '@/infrastructure/db/repositories/DbUserMapping.repository';

export class UserMappingRepository {
  static add(discordUserId: string, githubUsername: string) {
    DbUserMappingRepository.add(discordUserId, githubUsername);
  }

  static remove(discordUserId: string) {
    DbUserMappingRepository.remove(discordUserId);
  }

  static getGithubUsername(discordUserId: string): string | null {
    return DbUserMappingRepository.getGithubUsername(discordUserId);
  }
}

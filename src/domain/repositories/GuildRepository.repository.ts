import { DbGuildRepository } from '@/infrastructure/db/repositories/DbGuildRepository.repository';

export class GuildRepository {
  static add(guildId: string, repository: string) {
    DbGuildRepository.add(guildId, repository);
  }

  static remove(guildId: string, repository: string) {
    DbGuildRepository.remove(guildId, repository);
  }

  static getAll(guildId: string): string[] {
    return DbGuildRepository.getAll(guildId);
  }
}

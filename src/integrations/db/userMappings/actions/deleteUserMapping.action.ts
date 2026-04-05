import type { DbClient } from '../../db.client';
import type { DeleteUserMappingPayload } from '../userMappings.types';

export function deleteUserMapping(
  db: ReturnType<DbClient['getDbClient']>,
  payload: DeleteUserMappingPayload,
): void {
  db.prepare(`DELETE FROM user_mappings WHERE discord_id = ?`).run(
    payload.discordId,
  );
}

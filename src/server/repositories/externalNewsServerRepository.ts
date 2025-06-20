import { Pool, RowDataPacket } from 'mysql2/promise';
import { getDbPool } from '../config/database';

export class ExternalServerRepository {
    private pool: Pool = getDbPool();

    async getApiKeyByName(name: string): Promise<string | null> {
        const [rows] = await this.pool.execute<RowDataPacket[]>(
            'SELECT api_key FROM news_servers WHERE name = ? AND status = "Active"',
            [name]
        );
        return rows.length ? rows[0].api_key : null;
    }
}

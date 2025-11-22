import { Logger } from '@/hooks/Logger';
import { DB, open as SqliteOpen } from '@op-engineering/op-sqlite';
import { ISession, MASTER_DB_NAME, SESSION_DB_NAME_PREFIX, QueryResult, IDatabaseService } from '../DatabaseInterfaces';
import { Session } from './Session.native';
import { ISessionInfo } from 'shared';

export class DatabaseService implements IDatabaseService {
  private tag = "DatabaseService.tsx";
  private static instance: DatabaseService | undefined;
  private db: DB; // Replace 'any' with your actual database type

  private constructor() {
    this.db = SqliteOpen({ name: MASTER_DB_NAME });
  }

  static getInstance(): IDatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
      DatabaseService.instance.executeQuery(
        `CREATE TABLE IF NOT EXISTS sessions (name VARCHAR(255) PRIMARY KEY, length INT, startTime INT, endTime INT)`
      )
    }
    return DatabaseService.instance;
  }

  async getAllSessions(): Promise<ISessionInfo[]> {
    return (await this.executeQuery<ISessionInfo>('SELECT * FROM sessions')).rows;
  }

  async getSessionByName(name: string): Promise<ISession | null> {
    const rows = await this.executeQuery<ISessionInfo>(
      `SELECT * FROM sessions WHERE name = ?`,
      [name]
    );
    if(!rows.rows.length) {
      return null;
    }
    return Session.fromInfo(rows.rows[0], this.db);
  }

  async generateSession(): Promise<ISession> {
    const session: ISessionInfo = {
      name: `${SESSION_DB_NAME_PREFIX}${Date.now()}`,
      length: 0, // Initialize length to 0 or any default value
      startTime: Date.now(),
      endTime: 0
    };
    Logger.log(this.tag, `generate ${JSON.stringify(session)}`);
    await this.executeQuery(
      'INSERT INTO sessions (name, length, startTime, endtime) VALUES (?, ?, ?, ?)',
      [session.name, session.length, session.startTime, session.endTime]
    );
    return Session.fromInfo(session, this.db);
  }

  private async executeQuery<T>(query: string, params: any[] = []): Promise<QueryResult<T>> {
    try {
      return await this.db.execute(query, params) as any;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  close(): void {
    this.db.close();
  }
}

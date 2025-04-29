import { DB, open as SqliteOpen } from '@op-engineering/op-sqlite';
import { ISessionInfo, ISession, MASTER_DB_NAME, SESSION_DB_NAME_PREFIX, QueryResult } from './DatabaseInterfaces';
import { Session } from './Session';

export interface IDatabaseService {
  getAllSessions(): Promise<ISessionInfo[]>;
  getSessionByName(name: string): Promise<ISession | null>;
  generateSession(): Promise<ISession>;
  deleteSession(name: string): Promise<void>;
  close(): void;
}

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
    return Session.fromInfo(rows.rows[0]);
  }

  async generateSession(): Promise<ISession> {
    const session: ISessionInfo = {
      name: `${SESSION_DB_NAME_PREFIX}${Date.now()}`,
      length: 0, // Initialize length to 0 or any default value
      startTime: Date.now(),
      endTime: Date.now() // Default to 1 hour later
    };
    await this.executeQuery(
      'INSERT INTO sessions (name, length, startTime, endtime) VALUES (?, ?, ?, ?)',
      [session.name, session.length, session.startTime, session.endTime]
    );
    return Session.fromInfo(session);
  }
  
  async deleteSession(name: string): Promise<void> {
    const found = await this.getSessionByName(name);
    if(found) {
      (found as Session).delete();
    }
    await this.executeQuery(
      'DELETE FROM sessions WHERE name = ?',
      [name]
    );
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

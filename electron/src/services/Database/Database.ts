import { IpcActions_Database, ISessionInfo } from "shared";
import { ISupportRendererService } from "../../renderer/renderer.types.js";
import * as Sqlite from "node:sqlite";
import * as Path from "path";
import * as fs from "node:fs/promises";
import AppConfig from '../../config.json' with { type: 'json' };
const __dirname = import.meta.dirname;

export class DatabaseService implements ISupportRendererService {
  private static MAIN_DB_NAME = AppConfig.mainDatabaseName;
  mainDb!: Sqlite.DatabaseSync;

  constructor(private win: Electron.BrowserWindow) { }

  async initialize(): Promise<void> {
    await this.ensureDatabaseFileExists(DatabaseService.MAIN_DB_NAME);
    this.mainDb = new Sqlite.DatabaseSync(
      this.getFilePathForDatabase(DatabaseService.MAIN_DB_NAME)
    );
  }

  attachHandlers(ipcMain: Electron.IpcMain): void {
    ipcMain.handle(IpcActions_Database.GetAllSessions, (event) => {
      return this.getAllSessions();
    });
    ipcMain.handle(IpcActions_Database.GenerateSession, (event) => {
      return this.generateSession();
    });
    ipcMain.handle(IpcActions_Database.Close, (event) => {
      this.mainDb.close();
    });
  }
  private async generateSession(): Promise<ISessionInfo> {
    const session: ISessionInfo = {
      name: `session_${Date.now()}`,
      length: 0,
      startTime: Date.now(),
      endTime: 0
    };
    const stmt = this.mainDb.prepare(
      'INSERT INTO sessions (name, length, startTime, endTime) VALUES (?, ?, ?, ?)'
    );
    stmt.run(session.name, session.length, session.startTime, session.endTime);
    return session;
  }

  private async getAllSessions(): Promise<ISessionInfo[]> {
    const rows: ISessionInfo[] = [];
    const stmt = this.mainDb.prepare('SELECT * FROM sessions');
    const result = stmt.all();
    for (const row of result) {
      if (!row || !row.name) continue;
      rows.push({
        name: String(row.name),
        length: Number(row.length),
        startTime: Number(row.startTime),
        endTime: Number(row.endTime)
      });
    }
    return rows;
  }
  private async ensureDatabaseFileExists(dbName: string): Promise<void> {
    const dbPath = this.getFilePathForDatabase(dbName);
    const fileStats = await fs.stat(dbPath).catch(() => null);
    if (!fileStats || !fileStats.isFile()) {
      await fs.mkdir(Path.dirname(dbPath), { recursive: true });
      await fs.writeFile(dbPath, "");
    }
  }
  private getFilePathForDatabase(dbName: string): string {
    return Path.join(__dirname, '..', '..', 'databases', dbName);
  }
}
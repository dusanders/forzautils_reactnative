import { IpcActions_Cache } from "shared";
import { ISupportRendererService } from "../../renderer/renderer.types.js";
import { Logger } from "../Logger/Logger.js";
import * as Path from "path";
import * as FS from "fs";

interface CacheData {
  [key: string]: any;
}

const TAG = "CacheService";
export class CacheService implements ISupportRendererService {

  private static cacheFilePath = Path.join(process.cwd(), 'cache.json');

  constructor(private window: Electron.BrowserWindow) {
    Logger.log(TAG, `initialized with cache file at: ${CacheService.cacheFilePath}`);
  }

  attachHandlers(ipcMain: Electron.IpcMain): void {
    ipcMain.handle(IpcActions_Cache.SetItem, (event, key: string, value: any) => this.setItem(key, value));
    ipcMain.handle(IpcActions_Cache.GetItem, (event, key: string) => this.getItem(key));
    ipcMain.handle(IpcActions_Cache.RemoveItem, (event, key: string) => this.removeItem(key));
  }

  async setItem<T>(key: string, value: T): Promise<void> {
    Logger.log(TAG, `Setting item in cache: ${key}`);
    const data = await this.readCacheFile();
    data[key] = value;
    await this.writeCacheFile(data);
  }

  async getItem<T>(key: string): Promise<T | null> {
    Logger.log(TAG, `Getting item from cache: ${key}`);
    const data = await this.readCacheFile();
    if (key in data) {
      return data[key] as T;
    }
    return null;
  }

  async removeItem(key: string): Promise<void> {
    Logger.log(TAG, `Removing item from cache: ${key}`);
    const data = await this.readCacheFile();
    delete data[key];
    await this.writeCacheFile(data);
  }

  private async ensureCacheFileExists(): Promise<void> {
    if (!FS.existsSync(CacheService.cacheFilePath)) {
      FS.writeFileSync(CacheService.cacheFilePath, JSON.stringify({}));
    }
  }

  private async readCacheFile(): Promise<CacheData> {
    await this.ensureCacheFileExists();
    const data = FS.readFileSync(CacheService.cacheFilePath, 'utf-8');
    return JSON.parse(data) as CacheData;
  }

  private async writeCacheFile(data: CacheData): Promise<void> {
    FS.writeFileSync(CacheService.cacheFilePath, JSON.stringify(data, null, 2), 'utf-8');
  }
}
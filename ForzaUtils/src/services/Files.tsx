import { Dirs, FileSystem } from 'react-native-file-access';

const FORZA_CACHE_DIR = `${Dirs.DocumentDir}/forza-cache`;

export interface IFileService {
  getFile(name: string): Promise<IFile>;
}

export interface IFile {
  append(data: string | Uint8Array): Promise<void>;
  read(): Promise<string>;
  exists(): Promise<boolean>;
  delete(): Promise<void>;
}

export class FileService implements IFileService {
  private static instance: FileService | undefined;
  static async getInstance(): Promise<IFileService> {
    if (!FileService.instance) {
      FileService.instance = new FileService();
    }
    await FileService.instance.initialize();
    return FileService.instance;
  }
  private async initialize() {
    // Initialize any necessary resources here
    if (!(await FileSystem.exists(FORZA_CACHE_DIR))) {
      await FileSystem.mkdir(FORZA_CACHE_DIR);
    } else {
      console.debug(`Cache directory already exists: ${FORZA_CACHE_DIR}`);
      console.debug(`forza-cache: ${JSON.stringify(await FileSystem.ls(FORZA_CACHE_DIR))}`);
    }
  }
  async getFile(name: string): Promise<IFile> {
    const filePath = `${FORZA_CACHE_DIR}/${name}`;
    const file = new ForzaFile(filePath);
    return file;
  }
}

export class ForzaFile implements IFile {
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  async append(data: string): Promise<void> {
    await FileSystem.appendFile(this.filePath, data);
  }

  async read(): Promise<string> {
    return await FileSystem.readFile(this.filePath);
  }

  async exists(): Promise<boolean> {
    return await FileSystem.exists(this.filePath);
  }

  async delete(): Promise<void> {
    await FileSystem.unlink(this.filePath);
  }
}
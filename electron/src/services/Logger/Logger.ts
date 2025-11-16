export class Logger {
  static log(tag: string, message: string): void {
    console.log(`[${tag}] ${message}`);
  }

  static warn(tag: string, message: string): void {
    console.warn(`[${tag}] ${message}`);
  }

  static error(tag: string, message: string): void {
    console.error(`[${tag}] ${message}`);
  }
}
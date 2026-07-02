
export class Logger {
  static log(tag: string, message: string) {
    console.log(`[${tag}] ${message}`);
  }

  static warn(tag: string, message: string) {
    console.warn(`[${tag}] ${message}`);
  }

  static error(tag: string, message: string) {
    console.error(`[${tag}] ${message}`);
  }
}
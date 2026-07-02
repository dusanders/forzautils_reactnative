export class Semaphore {
  private permits: number;
  private initialPermits: number;
  private waiting: (() => void)[];

  constructor(permits: number) {
    this.permits = permits;
    this.initialPermits = permits;
    this.waiting = [];
  }

  canAcquire(): boolean {
    return this.permits > 0;
  }

  async acquire(): Promise<void> {
    if (this.permits > 0) {
      this.permits--;
      return;
    }
    return new Promise<void>((resolve) => {
      this.waiting.push(() => {
        this.permits--;
        resolve();
      });
    });
  }

  release(): void {
    if (this.permits < this.initialPermits) {
      this.permits++;
    }
    if (this.waiting.length > 0) {
      const waiter = this.waiting.shift()!;
      waiter();
    }
  }
}
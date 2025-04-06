
import { jest } from '@jest/globals';

export const mockSocket = {
  bind: jest.fn(),
  close: jest.fn(),
  addListener: jest.fn(function (this: typeof mockSocket, event: string, callback: any) {
    return this; // Return the mockSocket instance for chaining
  }),
  removeListener: jest.fn(function ( this: typeof mockSocket, event: string) {
    return this; // Return the mockSocket instance for chaining
  }),
  address: jest.fn(() => ({port: 12345})),
  once: jest.fn(function (this: typeof mockSocket, event, callback: any) {
    // Simulate the 'once' method returning 'this' for chaining
    if (event === 'message') {
      callback('mocked message', { address: '127.0.0.1', port: 12345 });
    }
    return this; // Return the mockSocket instance
  }),
}
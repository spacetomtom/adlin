import { vi } from 'vitest';

class BroadcastChannelMock {
  constructor(name: string) {}
  postMessage(message: any) {}
  close() {}
  addEventListener = vi.fn();
  removeEventListener = vi.fn();
  onmessage = null;
  onmessageerror = null;
}

global.BroadcastChannel = BroadcastChannelMock as any;
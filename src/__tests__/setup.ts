import { vi } from 'vitest';

class BroadcastChannelMock {
  constructor() {}
  postMessage() {}
  close() {}
  addEventListener = vi.fn();
  removeEventListener = vi.fn();
  onmessage = null;
  onmessageerror = null;
}

global.BroadcastChannel = BroadcastChannelMock as any;
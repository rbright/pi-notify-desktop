import type { ExtensionAPI } from '@mariozechner/pi-coding-agent';
import { describe, expect, it, vi } from 'vitest';

import { registerDesktopNotifyExtension } from '../index';

type EventHandler = (event: unknown, ctx: unknown) => Promise<void>;

function setupExtension(notifyImpl: () => void) {
  const handlers = new Map<string, EventHandler>();

  const on = vi.fn((eventName: string, callback: EventHandler) => {
    handlers.set(eventName, callback);
  });

  const registerCommand = vi.fn();
  registerDesktopNotifyExtension({ on, registerCommand } as unknown as ExtensionAPI, notifyImpl);

  return {
    handlers,
    registerCommand,
  };
}

describe('registerDesktopNotifyExtension', () => {
  it('notifies when assistant message completes with stop reason', async () => {
    const notify = vi.fn();
    const { handlers } = setupExtension(notify);

    await handlers.get('agent_start')?.({ type: 'agent_start' }, {});
    await handlers.get('message_end')?.(
      {
        message: {
          role: 'assistant',
          stopReason: 'stop',
        },
        type: 'message_end',
      },
      {},
    );
    await handlers.get('agent_end')?.({ type: 'agent_end', messages: [] }, {});

    expect(notify).toHaveBeenCalledTimes(1);
  });

  it('does not notify for toolUse assistant messages and falls back to agent_end', async () => {
    const notify = vi.fn();
    const { handlers } = setupExtension(notify);

    await handlers.get('agent_start')?.({ type: 'agent_start' }, {});
    await handlers.get('message_end')?.(
      {
        message: {
          role: 'assistant',
          stopReason: 'toolUse',
        },
        type: 'message_end',
      },
      {},
    );
    expect(notify).toHaveBeenCalledTimes(0);

    await handlers.get('agent_end')?.({ type: 'agent_end', messages: [] }, {});
    expect(notify).toHaveBeenCalledTimes(1);
  });

  it('does not register slash commands', () => {
    const notify = vi.fn();
    const { registerCommand } = setupExtension(notify);

    expect(registerCommand).not.toHaveBeenCalled();
  });
});

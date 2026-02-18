import type { ExtensionAPI } from '@mariozechner/pi-coding-agent';

import { notifyTurnComplete } from './notify';

type NotifyFn = () => void;

function shouldNotifyFromAssistantMessage(message: { stopReason?: string }): boolean {
  return message.stopReason !== 'toolUse' && message.stopReason !== 'error' && message.stopReason !== 'aborted';
}

export function registerDesktopNotifyExtension(
  pi: ExtensionAPI,
  notify: NotifyFn = () => {
    notifyTurnComplete();
  },
): void {
  let notifiedInCurrentAgent = false;

  const triggerNotify = (): void => {
    if (notifiedInCurrentAgent) {
      return;
    }

    notify();
    notifiedInCurrentAgent = true;
  };

  pi.on('agent_start', async () => {
    notifiedInCurrentAgent = false;
  });

  pi.on('message_end', async (event) => {
    if (event.message.role !== 'assistant') {
      return;
    }

    if (!shouldNotifyFromAssistantMessage(event.message)) {
      return;
    }

    triggerNotify();
  });

  // Fallback in case message-based detection misses a completion.
  pi.on('agent_end', async () => {
    triggerNotify();
  });
}

export default function (pi: ExtensionAPI): void {
  registerDesktopNotifyExtension(pi);
}

# pi-notify-desktop

[![CI](https://github.com/rbright/pi-notify-desktop/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/rbright/pi-notify-desktop/actions/workflows/ci.yml)

`pi-notify-desktop` sends terminal OSC notifications when the [Pi agent](https://github.com/badlogic/pi-mono) finishes a turn and is waiting for your next input.

## Install into Pi (GitHub)

Global install:

```bash
pi install git:github.com/rbright/pi-notify-desktop
```

Project-local install (writes to `.pi/settings.json` in the current repo):

```bash
pi install -l git:github.com/rbright/pi-notify-desktop
```

If Pi is already running, reload extensions:

```text
/reload
```

Quick check: run a short prompt (for example, `reply with ok`) and wait for completion.

## Compatibility

| Terminal / Mux                                | Auto Protocol           | Status |
| --------------------------------------------- | ----------------------- | ------ |
| WezTerm                                       | OSC 9                   | ✅     |
| Ghostty                                       | OSC 777                 | ✅     |
| iTerm2                                        | OSC 9                   | ✅     |
| tmux (inside supported terminal)              | passthrough + OSC 9/777 | ✅\*   |
| zellij (parent terminal = WezTerm)            | OSC 9                   | ✅     |
| zellij (parent terminal = Ghostty)            | OSC 777                 | ✅     |
| zellij (parent terminal hidden by layout/env) | OSC 9 fallback          | ✅     |

\* tmux requires passthrough:

```tmux
set -g allow-passthrough on
```

## Behavior

No configuration is required.

- Triggers on final assistant `message_end` (non-tool stop reasons)
- Falls back to `agent_end` if message-based completion is missed
- Writes OSC to `/dev/tty` first, then to stdout when needed
- Selects protocol automatically:
  - iTerm2 / WezTerm → OSC 9
  - Ghostty → OSC 777
  - zellij with hidden parent-terminal context → OSC 9 fallback
  - everything else → OSC 777

## Troubleshooting

1. Confirm install: `pi list`
2. If Pi was open during install/update, run `/reload`
3. Run a simple prompt and wait for completion
4. In tmux, confirm `set -g allow-passthrough on`
5. In non-TTY mode (for example `pi -p "hello"`), notifications are intentionally skipped

## Development

```bash
just deps
just lint
just typecheck
just test
just check
just precommit-install
just precommit-run
```

Run the extension directly during local development:

```bash
bun install
pi --no-extensions -e ./src/index.ts
```

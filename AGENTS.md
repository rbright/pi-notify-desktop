# AGENTS.md

## Scope
This file applies to the entire `pi-notify-desktop` repository.

## Mission
Keep the extension minimal, modular, and safe while providing reliable OSC desktop notifications for Pi agent completion.

## Architecture Rules

### Module boundaries
- `src/index.ts`: Pi event wiring only.
- `src/config.ts`: environment parsing and defaults only.
- `src/sanitize.ts`: text sanitization and truncation only.
- `src/protocol.ts`: protocol selection + OSC sequence formatting only.
- `src/notify.ts`: side-effect orchestration and stdout writes only.

### Design constraints
- Keep files focused on one responsibility.
- Keep side effects isolated to `src/notify.ts`.
- Keep `src/index.ts` logic-free except event registration and guard checks.
- Never emit raw OSC to non-TTY outputs.
- Sanitize notification text before protocol formatting.

## Testing & Quality
After changes, run:

1. `just lint`
2. `just typecheck`
3. `just test`

Manual smoke checks:
- iTerm2 (OSC 9)
- Ghostty/WezTerm (OSC 777)
- tmux passthrough mode
- print-mode/non-TTY behavior

## Tooling
- Use Bun for dependencies and scripts.
- Use ESLint + Prettier for code quality.
- Use Vitest for tests.
- Use Prek (`prek`) for pre-commit checks.

## Safety
- Do not introduce secrets.
- Avoid shelling out for notifications in this extension.
- Keep protocol output deterministic and sanitized.

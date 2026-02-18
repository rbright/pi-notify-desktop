const CONTROL_CHAR_REGEX = /[\p{Cc}\p{Cf}]/gu;

function truncate(input: string, maxLength: number): string {
  if (input.length <= maxLength) {
    return input;
  }

  if (maxLength <= 1) {
    return '…';
  }

  return `${input.slice(0, maxLength - 1)}…`;
}

export function sanitizeNotificationText(input: string, fallback: string, maxLength: number): string {
  const sanitized = input.replace(CONTROL_CHAR_REGEX, ' ').replaceAll(';', ' ').replace(/\s+/g, ' ').trim();

  if (sanitized.length === 0) {
    return truncate(fallback, maxLength);
  }

  return truncate(sanitized, maxLength);
}

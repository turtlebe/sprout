export function toMinutes(seconds: number): number {
  if (seconds === 0) {
    return 0;
  }

  if (!seconds) {
    return undefined;
  }

  return seconds / 60;
}

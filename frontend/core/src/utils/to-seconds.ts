export function toSeconds(minutes: number): number {
  if (minutes === 0) {
    return 0;
  }

  if (!minutes) {
    return undefined;
  }

  return minutes * 60;
}

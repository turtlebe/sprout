/**
 * Extracts the propagation level number from the string.
 * For example if the string is "PropRack12", this function
 * will return number: 12. If for some reason the string
 * does haven't a number at the end it will return 0.
 */
export function getNumberFromEndOfString(str: string) {
  const match = /[0-9]*$/.exec(str);
  return Array.isArray(match) && match.length > 0 ? Number(match[0]) : 0;
}

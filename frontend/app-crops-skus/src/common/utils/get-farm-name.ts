/**
 * Extracts farm name from given farm path.
 * @param farmPath Path to a farm.
 * @returns Farm name.
 */
export function getFarmName(farmPath: string) {
  if (farmPath) {
    const parts = farmPath.split('/');
    return parts[parts.length - 1];
  }
}

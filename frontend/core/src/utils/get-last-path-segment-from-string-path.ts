/**
 * Returns the last segment of the FarmDef Path from a string representing FarmDef path.
 *
 * Example:
 *   - sites/SSF2 -> SSF2
 *   - sites/areas/BMP -> BMP
 *
 * @param path The farm def path
 * @return The last segment of the FarmDef Path
 */
export function getLastPathSegmentFromStringPath(path: string) {
  if (!path) {
    return '';
  }
  const lastIndex = path.lastIndexOf('/');
  return path.slice(lastIndex + 1);
}

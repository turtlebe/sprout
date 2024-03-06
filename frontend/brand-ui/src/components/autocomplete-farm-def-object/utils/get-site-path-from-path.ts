/**
 * Returns the Site Path from a FarmDef path.
 *
 * Example: sites/SSF2/areas/BMP/lines/NorthBMP returns sites/SSF2
 *
 * It returns itself if the path is not a valid FarmDef Path.
 *
 * @param path FarmDef Path
 * @return FarmDef Path
 */
export function getSitePathFromPath(path: string): string {
  return path.split('/').slice(0, 2).join('/');
}

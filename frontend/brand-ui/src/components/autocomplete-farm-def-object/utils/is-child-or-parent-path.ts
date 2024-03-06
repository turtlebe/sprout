/**
 * Checks that given farm def path is child or parent of some item in the allowedPaths.
 *
 * @param allowedPaths Allowed array of farm def paths, ex: [ 'sites/SSF2/area/VerticalGrow', 'sites/LAR1' ]
 * @param path The path to be tested.
 * @returns boolean value indicating if path is allowed.
 */
export function isChildOrParentPath(allowedPaths: string[], path: string): boolean {
  return allowedPaths
    ? allowedPaths.some(allowedPath => path.startsWith(allowedPath) || allowedPath.startsWith(path))
    : false;
}

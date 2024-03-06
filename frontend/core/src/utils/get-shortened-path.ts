/**
 * Return a shortened version of a FarmDef path from a string representing a farm def path.
 * @param path The farm def path.
 * @param includeTrailingSlash (optional default true) When true the trailing slash is included.
 * @returns Shortened version of the FarmDef Path
 */
export function getShortenedPath(path: string, includeTrailingSlash = false) {
  if (!path) {
    return '';
  }

  const pathParts = path.split('/').filter(item => item);
  if (pathParts.length % 2 !== 0) {
    throw new Error(`Full path length must be zero or even, path=${path}, length=${pathParts.length}`);
  }

  let shortenedPath = '';
  pathParts.forEach((value, index) => {
    if (index % 2 !== 0) {
      shortenedPath += value + (!includeTrailingSlash && index === pathParts.length - 1 ? '' : '/');
    }
  });

  return shortenedPath;
}

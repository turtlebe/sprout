/**
 * Take given urlPath, ex: /production/sites/SSF2/farms/Tigris and return
 * the farmPath if it is found after the leading path (ex: /production)
 * @param urlPath
 * @returns FarmPath if found.
 */
export function getFarmPathFromUrl(urlPath: string) {
  const parts = urlPath.split('/');
  const hasFarmPathInUrlPath = parts.length >= 5 && parts[2] === 'sites' && parts[4] === 'farms';
  return hasFarmPathInUrlPath ? parts.slice(2, 6).join('/') : undefined;
}

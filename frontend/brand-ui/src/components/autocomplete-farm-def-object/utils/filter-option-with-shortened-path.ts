import { isChildDeviceLocation } from '@plentyag/core/src/farm-def/type-guards';

import { AllowedObjects } from '../hooks';

import { getFarmDefPath, getGrandParentFarmDefPath, getParentFarmDefPath, isFarmDefSitePath } from '.';

/**
 * Helper to filter autocomplete option that matches the current autocomplete input value.
 *
 * For context, a shortenedPath should either end with "/" or has a search term:
 *   - SSF2/ is a complete shortenedPath
 *   - SSF2/BMP/ is a complete shortenedPath
 *   - SSF2/B has a search term for B
 *   - SSF2/BMP has a search term for BMP
 *
 * It returns true when the shortenedPath is the parent of a FarmDef path:
 *   - SSF2/ sites/SSF2/areas/BMP returns true
 *   - SSF2/BMP/ sites/SSF2/areas/BMP/lines/NorthBMP returns true
 *
 * It returns true when the shortenedPath has a search term that prefixes the FarmDef path:
 *   - SSF2/B sites/SSF2/areas/BMP returns true
 *   - SSF2/BMP sites/SSF2/areas/BMP returns true (notice how we don't have a trailing slash here so it still has a search term)
 *   - SSF2/BMP/NorthBMP sites/SSF2/areas/BMP/NorthBMP returns true
 *
 * Otherwise returns false:
 *   - SSF2 sites/SSF2/areas/BMP returns false
 *   - SSF2/ sites/SSF2/areas/BMP/lines/NorthBMP returns false
 *   - SSF2/BMP sites/SSF2/areas/BMP/lines/NorthBMP returns false
 *   - SSF2/BMP/ sites/SSF2/areas/BMP returns false
 *
 * @see associated unit tests for more examples/illustrations
 *
 * @param shortenedPath Shortened path corresponding to the Autocomplete input value
 * @param option FarmDefObject of an Option in the Autocomplete.
 * @return Whether the shortenedPath is a parent or a search of farmDefPath.
 */
export function filterOptionWithShortenedPath(shortenedPath: string, option: AllowedObjects): boolean {
  const caseInsensitiveShortenedPath = shortenedPath.toLowerCase();
  const caseInsensitiveFarmDefPath = option.path.toLowerCase();

  const separatorLastIndex = caseInsensitiveShortenedPath.lastIndexOf('/');
  const shortenedPathLastSegment = caseInsensitiveShortenedPath.slice(separatorLastIndex);
  const shortenedPathWithoutSearchTerm = caseInsensitiveShortenedPath.slice(0, separatorLastIndex);
  const caseInsensitiveFarmDefPathFromShortenedPathWithoutSearchTerm =
    getFarmDefPath(shortenedPathWithoutSearchTerm).toLocaleLowerCase();
  const caseInsensitiveFarmDefPathFromShortenedPath = getFarmDefPath(caseInsensitiveShortenedPath).toLocaleLowerCase();

  // shortenedPath has a search term on sites
  if (separatorLastIndex === -1) {
    return (
      isFarmDefSitePath(caseInsensitiveFarmDefPath) &&
      caseInsensitiveFarmDefPath.startsWith(caseInsensitiveFarmDefPathFromShortenedPath)
    );
  }

  // special case for ChildDeviceLocation where we'll need to compare with the GrandParent's path instead of the Parent's path.
  if (isChildDeviceLocation(option)) {
    // shortenedPath does not have a search term
    if (shortenedPathLastSegment === '/') {
      return caseInsensitiveFarmDefPathFromShortenedPath === getGrandParentFarmDefPath(caseInsensitiveFarmDefPath);
    }

    const [lastSegmentInShortenedPath] = shortenedPathLastSegment.split('/').slice(-1);
    const [lastSegmentInFarmDefPath] = caseInsensitiveFarmDefPath.split('/').slice(-1);

    // for ChildDeviceLocation, with a term, we only compare the term with the last part of the path as well as checking if the grand parent of the device location
    // match the path without the term.
    return (
      getFarmDefPath(caseInsensitiveFarmDefPathFromShortenedPathWithoutSearchTerm) ===
        getGrandParentFarmDefPath(option).toLocaleLowerCase() &&
      lastSegmentInFarmDefPath.startsWith(lastSegmentInShortenedPath)
    );
  }

  // shortenedPath does not have a search term
  if (shortenedPathLastSegment === '/') {
    return caseInsensitiveFarmDefPathFromShortenedPath === getParentFarmDefPath(caseInsensitiveFarmDefPath);
  }

  // shortenedPath does have a search term and we are below a site
  return (
    caseInsensitiveFarmDefPathFromShortenedPathWithoutSearchTerm === getParentFarmDefPath(caseInsensitiveFarmDefPath) &&
    caseInsensitiveFarmDefPath.startsWith(caseInsensitiveFarmDefPathFromShortenedPath)
  );
}

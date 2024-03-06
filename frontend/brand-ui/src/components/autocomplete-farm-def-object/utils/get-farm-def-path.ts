const farmDefObjecTypes = ['sites', 'areas', 'lines', 'machines', 'machineZones'];

/**
 * Return a valid FarmDef Path for a given Shortened Path.
 *
 * @param shortenedPath Shortened FarmDefPath (corresponds to the Autocomplete input value)
 * @return FarmDef path
 */
export function getFarmDefPath(shortenedPath: string): string {
  if (shortenedPath.startsWith('sites/')) {
    return shortenedPath;
  }

  const segments = shortenedPath.split('/');
  const fullPath = [];

  for (let i = 0; i < farmDefObjecTypes.length; i++) {
    if (segments[i]) {
      fullPath.push(farmDefObjecTypes[i]);
      fullPath.push(segments[i]);
    }
  }

  return fullPath.join('/');
}

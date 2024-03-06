export function isFarmDefSitePath(path: string): boolean {
  if (!path) {
    return false;
  }

  const segments = path.split('/');

  return segments.length === 2 && segments[0] === 'sites';
}

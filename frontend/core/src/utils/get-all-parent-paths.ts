export function getAllParentPaths(path: string): string[] {
  if (!path) {
    return [];
  }

  const segment = path.split('/');

  if (segment.length % 2 !== 0) {
    return [];
  }

  return segment
    .filter((_, i) => i % 2 !== 0)
    .map(name => path.slice(0, path.search(name) + name.length))
    .slice(0, -1);
}

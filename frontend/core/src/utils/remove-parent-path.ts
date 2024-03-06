export function removeParentPath(path: string, parentPath: string): string {
  if (!path || !parentPath) {
    return path;
  }

  if (path === parentPath) {
    return '';
  }

  return path.replace(parentPath + '/', '');
}

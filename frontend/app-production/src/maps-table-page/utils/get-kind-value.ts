export function getKindValue(farmDefPath: string, kind: string) {
  if (!farmDefPath || !kind) {
    return;
  }
  const parts = farmDefPath.split('/');
  const index = parts.indexOf(kind);
  if (index !== -1 && index + 1 < parts.length) {
    return parts[index + 1];
  }
}

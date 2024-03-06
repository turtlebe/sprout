export const sortByWithType = (isType: (x: AllowedObjects) => boolean) => (a: AllowedObjects, b: AllowedObjects) => {
  if (isType(a) && isType(b)) {
    return a.path.localeCompare(b.path);
  }
  if (isType(a)) {
    return -1;
  }
  if (isType(b)) {
    return 1;
  }
  return a.path.localeCompare(b.path);
};

import { AllowedObjects } from '../hooks';

interface IsPathEqualsOptions {
  caseSensitive: boolean;
}

export function isPathEquals(
  farmDefObjectOrPath: AllowedObjects | string,
  options: IsPathEqualsOptions = { caseSensitive: true }
) {
  if (typeof farmDefObjectOrPath === 'string') {
    return function (object: AllowedObjects) {
      if (options.caseSensitive) {
        return object.path === farmDefObjectOrPath;
      }
      return object.path.toLowerCase() === farmDefObjectOrPath.toLowerCase();
    };
  }
  return function (object: AllowedObjects) {
    return object.path === farmDefObjectOrPath.path;
  };
}

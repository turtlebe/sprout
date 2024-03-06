import { AllowedObjects } from '../hooks/use-autocomplete-farm-def-object-store';

export function getParentFarmDefPath(farmDefObjectOrPath: AllowedObjects | string): string {
  if (!farmDefObjectOrPath) {
    return undefined;
  }

  if (typeof farmDefObjectOrPath == 'string') {
    return farmDefObjectOrPath.split('/').slice(0, -2).join('/');
  }

  return farmDefObjectOrPath.path.split('/').slice(0, -2).join('/');
}

export function getGrandParentFarmDefPath(farmDefObjectOrPath: AllowedObjects | string): string {
  if (!farmDefObjectOrPath) {
    return undefined;
  }

  if (typeof farmDefObjectOrPath == 'string') {
    return farmDefObjectOrPath.split('/').slice(0, -4).join('/');
  }

  return farmDefObjectOrPath.path.split('/').slice(0, -4).join('/');
}

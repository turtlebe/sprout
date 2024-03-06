import { getKindFromPath } from '@plentyag/core/src/farm-def/utils';

export function getFarmNameFromFarmPath(farmPath: string): string {
  return getKindFromPath(farmPath, 'farms');
}

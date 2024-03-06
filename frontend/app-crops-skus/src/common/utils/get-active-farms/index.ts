import { HasFarm } from '../../types';
import { getFarmName } from '../get-farm-name';

export function getActiveFarms(hasFarm: HasFarm) {
  return Object.keys(hasFarm || {})
    .map(farmPath => {
      if (!hasFarm[farmPath]) {
        return null;
      }
      return getFarmName(farmPath);
    })
    .filter(item => item);
}

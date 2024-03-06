import { FarmDefSku } from '@plentyag/core/src/farm-def/types';

import { HasFarm } from './has-farm';

export interface SkuWithFarmInfo extends FarmDefSku {
  hasFarm: HasFarm;
  packageImagery: string; // path to image stored in sprout
}

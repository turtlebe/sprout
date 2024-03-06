import { FarmDefCrop } from '@plentyag/core/src/farm-def/types';

import { HasFarm } from './has-farm';

export interface CropWithFarmInfo extends FarmDefCrop {
  hasFarm: HasFarm;
  skus: string[];
}

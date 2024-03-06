import { GrowConfigurationType } from '@plentyag/app-crops-skus/src/common/types';
import { ChildCrop } from '@plentyag/core/src/farm-def/types';
import { uniq } from 'lodash';

import { EditCropFormikValues } from '../../types';
import { isBlended } from '../is-blended';

/*
 * Calculates a new value for "ChildCrops" after crop edit.
 */
export function getUpdatedChildCrops(
  currentChildCrops: ChildCrop[],
  editCropValues: EditCropFormikValues
): ChildCrop[] {
  const hasFarms = editCropValues.farms.length > 0;

  // only blended crops are allowed to have childCrops.
  if (!hasFarms || !isBlended(editCropValues.growConfiguration)) {
    return [];
  }

  // we don't support editing childCrops for blended at seeding machine - so for now
  // just return existing childCrop array.
  if (editCropValues.growConfiguration === GrowConfigurationType.isBlendedAtSeedingMachine) {
    return currentChildCrops;
  }

  // handle case for blended at blending machine (where editing is supported)
  // update allowedCropsNames to also include defaultCropName.
  return editCropValues.childCrops.map(crop => ({
    ...crop,
    minRatio: 0.0,
    maxRatio: 1.0,
    allowedCropNames: uniq((crop?.allowedCropNames || []).concat(crop.defaultCropName)),
  }));
}

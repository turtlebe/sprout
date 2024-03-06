import { ChildCrop } from '@plentyag/core/src/farm-def/types';

import { CropWithFarmInfo, GrowConfigurationType } from '../../../types';

// Various types used when editing/creating a crop.

/**
 * Type returned from the serializer when editing/creating a crop.
 */
export interface SerializedCropWithFarmInfo
  extends Omit<CropWithFarmInfo, 'description' | 'seedPartNumbers' | 'path' | 'displayName' | 'skus'> {}

/**
 * Values used in form-gen when editing/creating a crop, this value gets passed to the serializer (for example).
 */
export interface EditCropFormikValues {
  name: string;
  commonName: string;
  media: string;
  cropTypeName: string;
  trialDescription: string;
  cultivar: string;
  scientificName: string;
  farms: string[];
  growConfiguration: GrowConfigurationType;
  childCrops: ChildCrop[];
}

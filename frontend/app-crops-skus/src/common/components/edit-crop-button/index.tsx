import { EditButton } from '@plentyag/brand-ui/src/components';
import { ChildCrop } from '@plentyag/core/src/farm-def/types';
import { cloneDeep, times } from 'lodash';
import React from 'react';

import { useEditCropFormGenConfig } from '../../../common/hooks';
import { CropWithFarmInfo } from '../../../common/types';
import { getEditConfirmationMessage } from '../../utils';

import { createEmptyCrop } from './utils';

export const CROP_CONFIRMATION_MESSAGE = getEditConfirmationMessage('Crop');
export const EMPTY_CHILD_CROP: ChildCrop = {
  defaultCropName: '',
  allowedCropNames: [],
  minRatio: 0.0,
  maxRatio: 1.0,
  targetRatio: undefined,
};

interface EditCropButton {
  crop?: CropWithFarmInfo; // crop to edit.
  crops?: CropWithFarmInfo[];
  isUpdating: boolean;
  onEditSuccess: (isUpdating: boolean, cropName: string) => void;
}

export const EditCropButton: React.FC<EditCropButton> = ({ crop, crops, isUpdating, onEditSuccess }) => {
  const cropToEdit = crop || createEmptyCrop(crops);
  const minNumberChildCrops = 2;
  const updateCropFormGenConfig = useEditCropFormGenConfig({ cropToEdit, crops, isUpdating, minNumberChildCrops });

  const childCrops: ChildCrop[] = cropToEdit?.childCrops ? cloneDeep(cropToEdit.childCrops) : [];

  // fill missing values, up to the minimum with "EMPTY_CHILD_CROP"
  if (childCrops.length < minNumberChildCrops && minNumberChildCrops > 0) {
    times(minNumberChildCrops - childCrops.length, () => childCrops.push(EMPTY_CHILD_CROP));
  }

  // add "childCrops" initialValue here so repeat array gets created with proper values.
  const initialValues = React.useMemo(
    () => ({
      childCrops,
    }),
    [crop, crops]
  );

  return (
    <EditButton
      formGenConfig={updateCropFormGenConfig}
      layout="groupRow"
      initialValues={initialValues}
      maxWidth="xl"
      isUpdating={isUpdating}
      confirmationMessage={isUpdating ? CROP_CONFIRMATION_MESSAGE : undefined}
      disabled={(isUpdating && !crop) || !crops}
      onSuccess={onEditSuccess}
    />
  );
};

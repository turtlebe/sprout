import { EditButton } from '@plentyag/brand-ui/src/components';
import React from 'react';

import { SkuWithFarmInfo } from '../../../common/types';
import { useEditSkuFormGenConfig } from '../../hooks';
import { getEditConfirmationMessage } from '../../utils';

import { createEmptySku } from './utils';

export const SKU_CONFIRMATION_MESSAGE = getEditConfirmationMessage('SKU');

interface EditSkuButton {
  sku?: SkuWithFarmInfo; // sku to edit
  skus?: SkuWithFarmInfo[];
  isUpdating: boolean;
  onEditSuccess: (isUpdating: boolean, cropName: string) => void;
}

export const EditSkuButton: React.FC<EditSkuButton> = ({ sku, skus, isUpdating, onEditSuccess }) => {
  const skuToEdit = sku || createEmptySku(skus);
  const updateCropFormGenConfig = useEditSkuFormGenConfig(skuToEdit, skus, isUpdating);

  return (
    <EditButton
      formGenConfig={updateCropFormGenConfig}
      isUpdating={isUpdating}
      confirmationMessage={isUpdating ? SKU_CONFIRMATION_MESSAGE : undefined}
      disabled={(isUpdating && !sku) || !skus}
      onSuccess={onEditSuccess}
    />
  );
};

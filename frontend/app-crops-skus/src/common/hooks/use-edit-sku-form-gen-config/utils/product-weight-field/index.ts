import { SkuWithFarmInfo } from '@plentyag/app-crops-skus/src/common/types';
import { canShowProductWeight, hasSkuTypeClass } from '@plentyag/app-crops-skus/src/common/utils';
import { FarmDefSkuType, SkuTypeClasses } from '@plentyag/core/src/farm-def/types';
import * as yup from 'yup';

import { getSkuProductWeight } from '..';
import { EditSkuFormikValues } from '../../types';

export const SKU_WEIGHT_LABEL = 'Child SKU Product Weight (oz)';

interface ProductWeightFieldOptions {
  skuToEdit: SkuWithFarmInfo;
  editedValues: EditSkuFormikValues;
  isUpdating: boolean;
  skuTypes: FarmDefSkuType[];
  skus: SkuWithFarmInfo[];
}

/**
 * This util generates the "Product Weight" form-gen field used in creating/editing a sku.
 */
export function productWeightField({
  skuToEdit,
  editedValues,
  isUpdating,
  skuTypes,
  skus,
}: ProductWeightFieldOptions): FormGen.Field[] {
  if (!canShowProductWeight(editedValues.skuTypeName, skuTypes)) {
    return [];
  }

  // for cases - the field is read-only and shows the product weight of the childSku.
  if (hasSkuTypeClass(editedValues.skuTypeName, skuTypes, [SkuTypeClasses.Case])) {
    const childSkuProductWeightOz = getSkuProductWeight(editedValues.childSkuName, skus);
    if (!childSkuProductWeightOz) {
      return [];
    }
    return [
      {
        type: 'Typography',
        name: 'productWeightOzReadOnly',
        label: `${SKU_WEIGHT_LABEL}: ${childSkuProductWeightOz}`,
      },
    ];
  }

  // for other sku types, we allowed creating a product weight.
  return [
    {
      type: 'TextField',
      name: 'productWeightOz',
      label: 'Product Weight (oz)',
      default: skuToEdit.productWeightOz,
      validate: yup.number().moreThan(0).required().nullable(),
      textFieldProps: { type: 'number', disabled: isUpdating },
    },
  ];
}

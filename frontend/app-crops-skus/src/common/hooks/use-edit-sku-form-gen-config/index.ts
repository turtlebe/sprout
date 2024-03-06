import { useGetBrands } from '@plentyag/app-crops-skus/src/common/hooks';
import { SkuWithFarmInfo } from '@plentyag/app-crops-skus/src/common/types';
import {
  canShowBrand,
  canShowCaseQuantityPerPallet,
  canShowProductWeight,
  hasSkuTypeClass,
} from '@plentyag/app-crops-skus/src/common/utils';
import { TooltipColumnDescription } from '@plentyag/brand-ui/src/components';
import { when } from '@plentyag/brand-ui/src/components/form-gen';
import { PermissionLevels, Resources } from '@plentyag/core/src/core-store/types';
import { FarmDefCrop, SkuTypeClasses } from '@plentyag/core/src/farm-def/types';
import { cloneDeep, isEqual } from 'lodash';
import * as yup from 'yup';

import { skusTableCols } from '../../../skus-page/utils';
import { useSearchSkuTypes } from '../use-search-sku-types';

import { EditSkuFormikValues } from './types';
import { getSkuProductWeight, productWeightField } from './utils';

export type UseEditSkuFormGenConfigReturn = FormGen.Config;

const matchPackagingLotCropCode = new RegExp(/^[A-Z][A-Z\d]{2}$/);
export const allowedPackagingLotCrops = (crops: FarmDefCrop[]) =>
  crops.filter(crop => matchPackagingLotCropCode.test(crop.name));

export function useEditSkuFormGenConfig(
  sku: SkuWithFarmInfo,
  skus: SkuWithFarmInfo[],
  isUpdating: boolean
): UseEditSkuFormGenConfigReturn {
  const { isLoading: isLoadingSkuTypes, skuTypes } = useSearchSkuTypes();
  const { data: brands } = useGetBrands();

  if (!sku) {
    return;
  }

  const fields: FormGen.FieldAny[] = [];

  fields.push(
    {
      type: 'Select',
      name: 'skuTypeName',
      label: 'Package Type',
      default: sku.skuTypeName,
      options: skuTypes?.map(skuType => ({ value: skuType.name, label: skuType.description })),
      validate: yup.string().required(),
      tooltip: TooltipColumnDescription,
      selectProps: { disabled: isUpdating },
    },
    {
      type: 'TextField',
      name: 'productName',
      label: 'Product Name',
      default: isUpdating ? sku.productName : undefined,
      validate: yup.string().required(),
      tooltip: TooltipColumnDescription,
    },
    {
      type: 'AutocompleteFarmDefCrop',
      name: 'allowedCropNames',
      label: 'Allowed Associated Crops',
      default: sku.allowedCropNames,
      autocompleteProps: { multiple: true },
      validate: yup.string().required(),
      tooltip: TooltipColumnDescription,
    },
    {
      if: when(['skuTypeName'], skuTypeName => hasSkuTypeClass(skuTypeName, skuTypes, [SkuTypeClasses.Case])),
      fields: [
        {
          type: 'Autocomplete',
          name: 'childSkuName',
          label: 'Child SKU Name',
          default: sku.childSkuName === 'None' ? '' : sku.childSkuName,
          options: skus?.map(_sku => _sku.name),
          validate: yup.string().nullable().required(),
          tooltip: TooltipColumnDescription,
          autocompleteProps: { disabled: isUpdating },
        },
      ],
    },
    {
      computed: (values: EditSkuFormikValues) =>
        productWeightField({ skuToEdit: sku, isUpdating, skus, skuTypes, editedValues: values }),
    },
    {
      type: 'TextField',
      name: 'labelPrimaryColor',
      label: 'Label Primary Color',
      default: sku.labelPrimaryColor || '', // backend api requires value, so at least must be empty string.
      validate: yup.string().nullable().optional(),
      tooltip: TooltipColumnDescription,
    },
    {
      type: 'TextField',
      name: 'labelSecondaryColor',
      label: 'Label Secondary Color',
      default: sku.labelSecondaryColor || '', // backend api requires value, so at least must be empty string.
      validate: yup.string().nullable().optional(),
      tooltip: TooltipColumnDescription,
    },
    {
      type: 'TextField',
      name: 'internalExpirationDays',
      label: 'Internal Storage Life',
      default: sku.internalExpirationDays,
      validate: yup.number().integer().moreThan(0).lessThan(11).required(),
      textFieldProps: { type: 'number' },
      tooltip: TooltipColumnDescription,
    },
    {
      type: 'TextField',
      name: 'externalExpirationDays',
      label: 'External Shelf-life',
      default: sku.externalExpirationDays,
      validate: yup.number().integer().moreThan(0).lessThan(16).required(),
      textFieldProps: { type: 'number' },
      tooltip: TooltipColumnDescription,
    },
    {
      computed: (values: EditSkuFormikValues) => [
        {
          type: 'Typography',
          name: 'bestByDate',
          label: 'Best by date: ' + (values.internalExpirationDays + values.externalExpirationDays)?.toString(),
          tooltip: TooltipColumnDescription,
        },
      ],
    },
    {
      type: 'TextField',
      name: 'netsuiteItem',
      label: 'NetSuite Item',
      default: sku.netsuiteItem,
      validate: yup.string().required(),
      textFieldProps: { disabled: isUpdating },
      tooltip: TooltipColumnDescription,
    },
    {
      type: 'TextField',
      name: 'gtin',
      label: 'GTIN',
      default: sku.gtin,
      validate: yup.string().required(),
      textFieldProps: { disabled: isUpdating },
      tooltip: TooltipColumnDescription,
    },
    {
      if: when(['skuTypeName'], skuTypeName => canShowCaseQuantityPerPallet(skuTypeName, skuTypes)),
      fields: [
        {
          type: 'TextField',
          name: 'caseQuantityPerPallet',
          label: 'Case Quantity per Pallet',
          default: sku.caseQuantityPerPallet,
          validate: yup.number().moreThan(0).nullable().optional(),
          textFieldProps: { type: 'number' },
        },
      ],
    },
    {
      if: when(['skuTypeName'], skuTypeName => canShowBrand(skuTypeName, skuTypes)),
      fields: [
        {
          type: 'Select',
          name: 'brandTypeName',
          label: 'Brand',
          default: sku.brandTypeName,
          options: brands?.map(brand => brand.name),
          validate: yup.string().required(),
          selectProps: { disabled: isUpdating },
        },
      ],
    },

    {
      type: 'SelectFarmDefObject',
      label: 'Farms',
      name: 'farms',
      kind: 'farm',
      default: sku.hasFarm && Object.keys(sku.hasFarm).filter(farm => sku.hasFarm[farm]),
      validate: yup.string().optional(),
      selectProps: { multiple: true },
    },
    {
      computed: (values: EditSkuFormikValues) => [
        {
          type: 'AutocompleteFarmDefCrop',
          name: 'packagingLotCropCode',
          label: 'Packaging Lot Crop Code',
          // when creating a SKU, the default is driven by the first value (if present) in allowedCropNames.
          // see: https://plentyag.atlassian.net/browse/SD-18475
          default:
            sku.packagingLotCropCode || (values?.allowedCropNames?.length > 0 ? values.allowedCropNames[0] : undefined),
          labelSelector: 'name',
          valueSelector: 'name',
          allowList: allowedPackagingLotCrops,
          autocompleteProps: { freeSolo: true, disabled: isUpdating },
          validate: yup
            .string()
            .required()
            .matches(matchPackagingLotCropCode, 'Invalid value, valid examples: B11, BAC, AB1, A1B'),
          tooltip: TooltipColumnDescription,
        },
      ],
    }
  );

  return {
    isLoading: isLoadingSkuTypes,
    title: isUpdating ? 'Edit SKU' : 'Create New SKU',
    permissions: {
      create: { resource: Resources.HYP_CROPS, level: PermissionLevels.FULL },
      update: { resource: Resources.HYP_CROPS, level: PermissionLevels.FULL },
    },
    serialize: (values: EditSkuFormikValues) => {
      const hasFarm = cloneDeep(sku.hasFarm);
      Object.keys(hasFarm).forEach(farmPath => {
        hasFarm[farmPath] = values.farms.includes(farmPath);
      });
      const hasFarmsChanged = isUpdating ? !isEqual(sku.hasFarm, hasFarm) : true;

      const returnValues = {
        ...values,
        childSkuName: values.childSkuName || undefined,
        description: values.description || undefined,
        hasFarm: hasFarmsChanged ? hasFarm : undefined,
        properties: sku.properties || {},
        defaultCropName: sku.defaultCropName,
      };

      if (!canShowProductWeight(values.skuTypeName, skuTypes)) {
        delete returnValues.productWeightOz;
      } else if (hasSkuTypeClass(values.skuTypeName, skuTypes, [SkuTypeClasses.Case])) {
        // for case type, we get the productWeight from the selected childSkuName.
        returnValues.productWeightOz = getSkuProductWeight(values.childSkuName, skus);
      }

      if (!canShowBrand(values.skuTypeName, skuTypes)) {
        delete returnValues.brandTypeName;
      }

      if (!canShowCaseQuantityPerPallet(values.skuTypeName, skuTypes)) {
        delete returnValues.caseQuantityPerPallet;
      }

      delete returnValues.farms;
      return returnValues;
    },
    createEndpoint: '/api/crops-skus/sku',
    updateEndpoint: `/api/crops-skus/sku/${sku.name}`,
    context: { tableCols: skusTableCols },
    fields,
  };
}

import { TooltipColumnDescription } from '@plentyag/brand-ui/src/components';
import { when } from '@plentyag/brand-ui/src/components/form-gen';
import { PermissionLevels, Resources } from '@plentyag/core/src/core-store/types';
import { cloneDeep, isEqual } from 'lodash';
import * as yup from 'yup';

import { cropsTableCols } from '../../../crops-page/utils';
import { CropWithFarmInfo, GrowConfigurationType } from '../../types';
import { getGrowConfiguration } from '../../utils';
import { useSearchCropTypes } from '../use-search-crop-types';

import { EditCropFormikValues, SerializedCropWithFarmInfo } from './types';
import { getAllowedCropNames, getUpdatedChildCrops, isSeedable } from './utils';

import '@plentyag/core/src/yup/extension';

export type UseEditCropFormGenConfigReturn = FormGen.Config;

interface UseEditCropFormGenConfig {
  cropToEdit: CropWithFarmInfo;
  crops: CropWithFarmInfo[];
  isUpdating: boolean;
  minNumberChildCrops: number;
}

export function useEditCropFormGenConfig({
  cropToEdit,
  crops,
  isUpdating,
  minNumberChildCrops,
}: UseEditCropFormGenConfig): UseEditCropFormGenConfigReturn {
  const { isLoading: isLoadingCropTypes, cropTypes } = useSearchCropTypes();

  if (!cropToEdit) {
    return;
  }

  return {
    isLoading: isLoadingCropTypes,
    title: isUpdating ? 'Edit Crop' : 'Create New Crop',
    permissions: {
      create: { resource: Resources.HYP_CROPS, level: PermissionLevels.EDIT },
      update: { resource: Resources.HYP_CROPS, level: PermissionLevels.EDIT },
    },
    serialize: (values: EditCropFormikValues): SerializedCropWithFarmInfo => {
      const hasFarm = cloneDeep(cropToEdit.hasFarm);
      Object.keys(hasFarm).forEach(farmPath => {
        hasFarm[farmPath] = values.farms.includes(farmPath);
      });

      const hasFarmsChanged = isUpdating ? !isEqual(cropToEdit.hasFarm, hasFarm) : true;

      // update only those fields we are proviiding here so we can perserve any exisitng values
      // stored in properties.
      const properties = cloneDeep(cropToEdit.properties);
      properties.scientificName = values.scientificName;
      properties.trialDescription = values.trialDescription || undefined;

      const hasFarms = values.farms.length > 0;

      return {
        name: values.name,
        commonName: values.commonName,
        displayAbbreviation: values.name,
        isSeedable: hasFarms && isSeedable(values.growConfiguration),
        childCrops: getUpdatedChildCrops(cropToEdit.childCrops, values),
        cropTypeName: values.cropTypeName,
        media: values.media,
        cultivar: values.cultivar,
        properties,
        hasFarm: hasFarmsChanged ? hasFarm : undefined,
      };
    },
    createEndpoint: '/api/crops-skus/crop',
    updateEndpoint: `/api/crops-skus/crop/${cropToEdit.name}`,
    context: { tableCols: cropsTableCols },
    fields: [
      {
        type: 'TextField',
        name: 'name',
        label: 'Name',
        default: isUpdating ? cropToEdit.name : undefined,
        textFieldProps: { disabled: isUpdating },
        validate: yup
          .string()
          .required()
          .matches(/^[A-Z0-9]+(:[A-Z0-9_]+)?$/, { message: 'Invalid name. Valid examples: AB1, AB1:C2, AB1:C2_3' }),
        tooltip: TooltipColumnDescription,
      },
      {
        type: 'TextField',
        name: 'commonName',
        label: 'Common Name',
        default: isUpdating ? cropToEdit.commonName : undefined,
        textFieldProps: { disabled: isUpdating },
        validate: yup.string().required(),
        tooltip: TooltipColumnDescription,
      },
      {
        type: 'Select',
        name: 'cropTypeName',
        label: 'Crop Type Name',
        default: cropToEdit.cropTypeName,
        options: cropTypes?.map(cropType => cropType.name),
        validate: yup.string().required(),
        tooltip: TooltipColumnDescription,
      },
      {
        type: 'TextField',
        name: 'cultivar',
        label: 'Cultivar',
        default: cropToEdit.cultivar,
        tooltip: TooltipColumnDescription,
      },
      {
        type: 'Select',
        name: 'media',
        label: 'Media',
        default: cropToEdit.media,
        options: [
          { label: 'none', value: '' },
          { label: 'FPX', value: 'FPX' },
          { label: 'coir', value: 'coir' },
        ],
        tooltip: TooltipColumnDescription,
      },
      {
        type: 'TextField',
        name: 'trialDescription',
        label: 'Trial Description',
        default: cropToEdit.properties.trialDescription?.trim(),
        validate: yup
          .string()
          .nullable()
          .optional()
          .test('len', 'Must be less than or equal to 75 characters', val => (val ? val.length <= 75 : true)),
        tooltip: TooltipColumnDescription,
      },
      {
        type: 'TextField',
        name: 'scientificName',
        label: 'Scientific Name',
        default: cropToEdit.properties.scientificName,
        validate: yup.string().optional(),
        tooltip: TooltipColumnDescription,
      },
      {
        type: 'SelectFarmDefObject',
        label: 'Farms',
        name: 'farms',
        kind: 'farm',
        default: cropToEdit.hasFarm && Object.keys(cropToEdit.hasFarm).filter(farm => cropToEdit.hasFarm[farm]),
        validate: yup.string().optional(),
        selectProps: { multiple: true },
      },
      {
        if: when(['farms'], farms => getAllowedCropNames(farms, crops).length > 0),
        fields: [
          {
            type: 'RadioGroup',
            name: 'growConfiguration',
            label: 'Grow Configuration',
            sortOptionsByLabel: false,
            default: getGrowConfiguration(cropToEdit),
            options: Object.keys(GrowConfigurationType).map(key => ({
              value: GrowConfigurationType[key],
              label: GrowConfigurationType[key],
            })),
            validate: yup.string().required(),
            radioProps: { size: 'small' },
          },
        ],
      },
      {
        computed: (values: EditCropFormikValues) => {
          const allowedCropNames = getAllowedCropNames(values.farms, crops);
          const targetRatioSum = values?.childCrops
            ? values.childCrops.reduce((acc, crop) => acc + crop.targetRatio, 0)
            : 0;
          if (!allowedCropNames || values?.growConfiguration !== GrowConfigurationType.isBlendedAtBlendingMachine) {
            return [];
          }
          return [
            {
              type: 'group',
              name: 'childCrops',
              label: 'Component Crops',
              min: minNumberChildCrops,
              max: 10,
              fields: groupIndex => [
                {
                  type: 'AutocompleteFarmDefCrop',
                  name: 'defaultCropName',
                  label: 'Component Crop',
                  allowList: allowedCropNames,
                  validate: yup.string().required(),
                  autocompleteProps: { multiple: false },
                  inputContainerStyle: { width: '400px' },
                },
                {
                  type: 'AutocompleteFarmDefCrop',
                  name: 'allowedCropNames',
                  label: 'Associated Crops',
                  allowList: allowedCropNames.filter(
                    allowedCropName => values?.childCrops[groupIndex]?.defaultCropName !== allowedCropName
                  ),
                  autocompleteProps: { multiple: true },
                  inputContainerStyle: { width: '400px' },
                },
                {
                  type: 'TextField',
                  name: 'targetRatio',
                  label: 'Target Ratio',
                  validate: yup
                    .number()
                    .required()
                    .min(0.0)
                    .max(1.0)
                    .nullable()
                    .cropTargetRatio(values.childCrops ? values.childCrops.map(crop => crop.targetRatio) : []),
                  textFieldProps: { type: 'number' },
                  inputContainerStyle: { width: '100px' },
                },
              ],
            },
            {
              type: 'Typography',
              name: 'targetRatioSum',
              label: `Current target ratio sum: ${targetRatioSum.toFixed(2)}. Sum must be 1. Remaining value: ${(
                1 - targetRatioSum
              ).toFixed(2)}.`,
            },
          ];
        },
      },
    ],
  };
}

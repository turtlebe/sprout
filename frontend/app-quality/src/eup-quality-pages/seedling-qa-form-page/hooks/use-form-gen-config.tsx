import { PermissionLevels, Resources } from '@plentyag/core/src/core-store/types';
import * as yup from 'yup';

import '@plentyag/core/src/yup/extension';

import { downloadImagesFromS3, uploadImagesToS3 } from '../../../common/utils/s3-image-upload-download';
import {
  EUPHRATES_PLUGS,
  EUPHRATES_PLUGS_N_PERCENTAGES,
  PLANT_HEALTH,
  PLUG_INTEGRITY,
  PROCESSING,
  SEEDLING_COUNT,
} from '../constants';

const EUPHRATES = 'LAX1_LAX1';
const API_PREFIX = '/api/plentyservice/product-quality-service';
const TRAY_ID_ERROR = 'The Tray ID does not exist. Examples: 800-00013031:TRY:000-011-716';

const seedlingCount = yup
  .mixed()
  .required()
  .validateTextFieldGridValuesUsingFunction({
    errorMessage: 'Please enter a positive number for seedling count.',
    gridValueTestFunction: value => {
      const numValue = parseInt(value);
      return Number.isInteger(numValue) && numValue >= 0;
    },
  });

const gapsInPlugs = yup.mixed().required('Gaps in Plugs is required');

export const useFormGenConfig: FormGen.useFormGenConfigHook<{}, SeedlingQA.Model> = () => {
  return {
    title: 'Seedling QA',
    getEndpoint: `${API_PREFIX}/get-seedling-qa-by-id/:seedlingQaId`,
    updateEndpoint: `${API_PREFIX}/put-seedling-qa`,
    createEndpoint: `${API_PREFIX}/post-seedling-qa`,
    permissions: {
      create: { resource: Resources.HYP_QUALITY, level: PermissionLevels.EDIT },
      update: { resource: Resources.HYP_QUALITY, level: PermissionLevels.FULL },
    },
    fields: [
      {
        type: 'TrayIdDecoder',
        name: 'trayId',
        label: 'Tray ID',
        mapProductTo: 'cultivar',
        validate: yup
          .string()
          .required()
          .matches(/^(800-[0-9]{8}:[A-Z0-9]{3}:[A-Z0-9]{3}-[A-Z0-9]{3}-[A-Z0-9]{3})$/, { message: TRAY_ID_ERROR }),
        errorMessage: TRAY_ID_ERROR,
      },
      {
        type: 'AutocompleteFarmDefCrop',
        label: 'Product',
        name: 'cultivar',
        validate: yup.string().required(),
        isPackableAnywhere: false,
        isPackableInFarm: false,
        autocompleteProps: { disableClearable: true, disabled: true },
      },
      {
        type: 'Select',
        name: 'site',
        label: 'Farm',
        default: EUPHRATES,
        options: [
          {
            label: 'LAX1',
            value: EUPHRATES,
          },
        ],
        validate: yup.string().required(),
        selectProps: { disabled: true },
      },
      {
        type: 'TextField',
        name: 'notes',
        label: 'Notes',
        textFieldProps: {
          multiline: true,
        },
      },
      {
        type: 'DragAndDrop',
        name: 'images',
        onRender: downloadImagesFromS3,
        afterSubmit: uploadImagesToS3,
        dropzoneUploaderProps: { maxFiles: 10 },
      },
      {
        type: 'TextFieldGrid',
        name: 'seedlingCount',
        label: 'Seedling Count',
        columns: EUPHRATES_PLUGS,
        rows: SEEDLING_COUNT,
        textFieldProps: { type: 'number', placeholder: '0' },
        tabbing: 'vertical',
        validate: seedlingCount,
        inputContainerStyle: { width: '350px' },
      },
      {
        type: 'RadioGrid',
        name: 'packagingCondensationLevels',
        label: 'Gaps in Plugs',
        columns: EUPHRATES_PLUGS,
        validate: gapsInPlugs,
        rows: [
          { label: 'None', value: '' },
          { label: 'Low', value: 'low' },
          { label: 'Medium', value: 'medium' },
          { label: 'High', value: 'high' },
        ],
        inputContainerStyle: { width: '350px' },
      },
      {
        type: 'CheckboxGrid',
        name: 'plugIntegrity',
        label: 'Plug Integrity',
        enableCheckAll: false,
        columns: EUPHRATES_PLUGS_N_PERCENTAGES,
        rows: PLUG_INTEGRITY,
        inputContainerStyle: { width: '650px' },
      },
      {
        type: 'CheckboxGrid',
        name: 'processingDefects',
        label: 'Processing Defects',
        enableCheckAll: false,
        columns: EUPHRATES_PLUGS_N_PERCENTAGES,
        rows: PROCESSING,
        inputContainerStyle: { width: '650px' },
      },
      {
        type: 'CheckboxGrid',
        name: 'plantHealth',
        label: 'Plant Health',
        enableCheckAll: false,
        columns: EUPHRATES_PLUGS_N_PERCENTAGES,
        rows: PLANT_HEALTH,
        inputContainerStyle: { width: '650px' },
      },
    ],
  };
};

export default useFormGenConfig;

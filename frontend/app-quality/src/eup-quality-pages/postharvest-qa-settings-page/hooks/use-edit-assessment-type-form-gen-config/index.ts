import {
  CREATE_ASSESSMENT_TYPE_URL,
  UPDATE_ASSESSMENT_TYPE_URL,
} from '@plentyag/app-quality/src/eup-quality-pages/postharvest-qa-page/constants';
import { ValueType } from '@plentyag/app-quality/src/eup-quality-pages/postharvest-qa-page/types';
import { PermissionLevels, Resources } from '@plentyag/core/src/core-store/types';
import * as yup from 'yup';

export interface UseEditAssessmentTypeFormGenConfig {
  assessmentTypeId?: string;
  uiOrder?: number;
  username: string;
}

export const useEditAssessmentTypeFormGenConfig = ({
  assessmentTypeId,
  uiOrder = 1,
  username,
}: UseEditAssessmentTypeFormGenConfig): FormGen.Config => {
  const isUpdating = Boolean(assessmentTypeId);
  const title = `${isUpdating ? 'Edit' : 'New'} Assessment Type`;

  return {
    title,
    createEndpoint: CREATE_ASSESSMENT_TYPE_URL,
    updateEndpoint: isUpdating ? `${UPDATE_ASSESSMENT_TYPE_URL}/${assessmentTypeId}` : null,
    serialize: values => ({
      ...values,
      [isUpdating ? 'updatedBy' : 'createdBy']: username,
      validation: JSON.parse(values.validation),
      instructions: JSON.parse(values.instructions),
      uiOrder,
    }),
    deserialize: values => ({
      ...values,
      validation: values.validation ? JSON.stringify(values.validation, null, 2) : '{}',
      instructions: values.instructions ? JSON.stringify(values.instructions, null, 2) : '{}',
      uiOrder,
    }),
    fields: [
      {
        type: 'TextField',
        name: 'name',
        label: 'Name (machine name)',
        validate: yup.string().required(),
      },
      {
        type: 'TextField',
        name: 'label',
        label: 'Label (human display name)',
        validate: yup.string().required(),
      },
      {
        type: 'Select',
        name: 'valueType',
        label: 'Value Type',
        options: Object.values(ValueType),
        validate: yup.string().required(),
      },
      {
        type: 'TextField',
        name: 'validation',
        label: 'Validation',
        textFieldProps: {
          multiline: true,
          rows: 8,
        },
        validate: yup.object().required(),
      },
      {
        type: 'TextField',
        name: 'instructions',
        label: 'Instructions',
        textFieldProps: {
          multiline: true,
          rows: 8,
        },
        validate: yup.object().optional(),
      },
      {
        type: 'TextField',
        name: 'uiOrder',
        label: 'Order',
        textFieldProps: {
          disabled: true,
        },
        validate: yup.string().required(),
      },
    ],
    permissions: {
      create: { resource: Resources.HYP_QUALITY, level: PermissionLevels.EDIT },
      update: { resource: Resources.HYP_QUALITY, level: PermissionLevels.EDIT },
    },
  };
};

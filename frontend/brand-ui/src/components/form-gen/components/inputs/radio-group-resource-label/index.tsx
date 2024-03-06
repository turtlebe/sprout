import { LabelItem } from '@plentyag/core/src/types';
import React from 'react';

import { memoWithFormikProps } from '../memo-with-formik-props';
import { RadioGroupRemote } from '../radio-group-remote';

const LABEL_ENDPOINT = '/api/production/resources/labels';
export const CONTAINER_LABEL = 'Container Labels';
export const MATERIAL_LABEL = 'Material Labels';

type LabelResponse = LabelItem[];

type TransformLabelResponse = FormGen.FieldRadioGroupRemote<LabelResponse>['transformResponse'];

const transformLabelData =
  (existingLabels: string[] = []): TransformLabelResponse =>
  response => {
    const options = response.reduce<FormGen.RadioOption[]>((accum, curr) => {
      if (existingLabels.includes(curr.name)) {
        // don't add item if already exists.
        return accum;
      }

      const newItem: FormGen.RadioOption = {
        category: curr.labelType === 'CONTAINER' ? CONTAINER_LABEL : MATERIAL_LABEL,
        value: curr.name,
        label: curr.name,
        helperText: curr.description,
      };

      accum.push(newItem);

      return accum;
    }, new Array<FormGen.RadioOption>());

    return options;
  };

// fetches T3 resource labels for containers/materials and
// displays items in a radio selection list.
export const RadioGroupResourceLabel = memoWithFormikProps<FormGen.FieldRadioGroupResourceLabel>(
  ({ formGenField, formikProps, ...props }) => {
    const { existingLabels, containerType, materialType, ...otherFormGenFieldProps } = formGenField;

    const queryParams = new URLSearchParams();
    containerType && queryParams.append('containerType', containerType);
    materialType && queryParams.append('materialType', materialType);

    const formGenFieldRadioGroupRemote: FormGen.FieldRadioGroupRemote<LabelResponse> = {
      ...otherFormGenFieldProps,
      type: 'RadioGroupRemote',
      url: `${LABEL_ENDPOINT}?${queryParams.toString()}`,
      transformResponse: transformLabelData(existingLabels),
    };

    return <RadioGroupRemote formGenField={formGenFieldRadioGroupRemote} formikProps={formikProps} {...props} />;
  }
);

import { FormControl, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { useSwrAxios } from '@plentyag/core/src/hooks';
import { parseErrorMessage } from '@plentyag/core/src/utils';
import React from 'react';

import { useFormikProps } from '../hooks/use-formik-props';
import { memoWithFormikProps } from '../memo-with-formik-props';
import { TextField } from '../text-field';

const dataTestIds = {
  control: name => `${name}-control`,
  helperText: name => `${name}-helper`,
};

export { dataTestIds as dataTestIdsTextFieldRemoteHelperText };

/**
 * This custom field is a wrapper of the FormGen.FieldTextField with an addition of dynamic
 * data fetching based on the given value.
 *
 * Example of FormGen config:
 * {
 *   type: 'TextFieldRemoteHelperText',
 *   url: value => `/api/plentyservice/traceability3/get-packaging-lot?packaging_lot_name=${value}`,
 *   renderHelperText: response => (
 *     <div>
 *       <b>Product:</b> {response.product}
 *     </div>
 *   ),
 *   validate: yup.string().optional().min(14).max(14),
 *   label: 'Packging Lot',
 *   name: 'packagingLot',
 * }
 *
 * Props
 *   type
 *      - Type of this field which is 'TextFieldRemoteHelperText'
 *   url
 *      - A template function will return a composed url. The "validated" value will be passed through
 *      - Return a falsy value and the request will not be called
 *      - Also to note that the request will not be called unless the value is validated!
 *   renderHelperText
 *      - A function that will pass through the data that comes back and render underneath text field
 *   ... rest are the same props as FormGen.FieldTextField
 */
export const TextFieldRemoteHelperText = memoWithFormikProps<FormGen.FieldTextFieldRemoteHelperText<unknown>>(
  ({ formGenField, formikProps, ...props }) => {
    const { url, renderHelperText, ...otherFormGenFieldProps } = formGenField;

    const textFormGenField: FormGen.FieldTextField = {
      ...otherFormGenFieldProps,
      type: 'TextField',
      ...props,
    };

    const { value, name, error } = useFormikProps(formikProps, textFormGenField);

    const resolvedUrl = !error && value ? url(value.toString()) : null;
    const { data, error: responseError } = useSwrAxios({ url: resolvedUrl });

    if (responseError) {
      formikProps.setFieldError(name, parseErrorMessage(responseError));
    }

    return (
      <FormControl data-testid={dataTestIds.control(name)}>
        <TextField formGenField={textFormGenField} formikProps={formikProps} />
        <Typography data-testid={dataTestIds.helperText(name)}>{data && renderHelperText(data)}</Typography>
      </FormControl>
    );
  }
);

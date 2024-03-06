import {
  CheckboxProps,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Checkbox as MuiCheckbox,
} from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { useFormikProps } from '../hooks/use-formik-props';
import { useIsRequired } from '../hooks/use-is-required';
import { memoWithFormikProps } from '../memo-with-formik-props';

export const Checkbox = memoWithFormikProps<FormGen.FieldCheckbox>(({ formGenField, formikProps, ...props }) => {
  const { decorateLabel } = useIsRequired(formGenField);
  const { value, error, name, label } = useFormikProps(formikProps, formGenField);

  const handleChange: CheckboxProps['onChange'] = async event => {
    // eslint-disable-next-line @typescript-eslint/await-thenable
    await formikProps.setFieldValue(name, event.target.checked);
    formikProps.validateField(name);
  };
  const handleBlur: CheckboxProps['onBlur'] = () => formikProps.validateField(name);

  return (
    <FormControl error={Boolean(error)} {...props} data-testid={name}>
      <FormGroup>
        <FormControlLabel
          control={
            <MuiCheckbox
              {...formGenField.checkboxProps}
              checked={value ?? false}
              onChange={handleChange}
              onBlur={handleBlur}
              name={name}
              id={name}
            />
          }
          label={decorateLabel(label)}
        />
      </FormGroup>
      {error && <FormHelperText error={Boolean(error)}>{error}</FormHelperText>}
    </FormControl>
  );
});

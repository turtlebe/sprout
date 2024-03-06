import { SelectDropdownDown } from '@plentyag/brand-ui/src/components/select-dropdown-down';
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  SelectProps,
} from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { getOptions } from '../autocomplete/utils';
import { useFormikProps } from '../hooks/use-formik-props';
import { useIsRequired } from '../hooks/use-is-required';
import { memoWithFormikProps } from '../memo-with-formik-props';

export const Select = memoWithFormikProps<FormGen.FieldSelect>(({ formGenField, formikProps, ...props }) => {
  const { decorateLabel } = useIsRequired(formGenField);
  const { value = '', error, name, label } = useFormikProps(formikProps, formGenField);
  const selectProps = formGenField.selectProps as SelectProps;
  const options: FormGen.ValueLabel[] = getOptions(formGenField.options);

  const handleChange: SelectProps['onChange'] = async event => {
    // eslint-disable-next-line @typescript-eslint/await-thenable
    await formikProps.setFieldValue(name, event.target.value);
    formikProps.validateField(name);
  };
  const handleBlur: SelectProps['onBlur'] = () => formikProps.validateField(name);

  return (
    <FormControl error={Boolean(error)} className={props.className} data-testid={name}>
      <InputLabel id={`${name}-label`}>{decorateLabel(label)}</InputLabel>
      <SelectDropdownDown
        {...selectProps}
        fullWidth
        value={value ?? ''}
        id={name}
        name={name}
        onChange={handleChange}
        onBlur={handleBlur}
        {...props}
      >
        {options.length === 0 && value !== '' ? (
          <MenuItem value={value ?? ''}>{value}</MenuItem>
        ) : (
          options.map((option, index) => (
            <MenuItem key={index} value={option.value}>
              {option.label}
            </MenuItem>
          ))
        )}
      </SelectDropdownDown>
      <FormHelperText id={`${name}-helper-text`}>{error}</FormHelperText>
    </FormControl>
  );
});

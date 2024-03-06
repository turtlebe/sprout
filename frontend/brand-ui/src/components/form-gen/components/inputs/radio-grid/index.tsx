import { StickyFirstColumnGrid } from '@plentyag/brand-ui/src/components/sticky-first-column-grid';
import {
  FormControl,
  FormHelperText,
  FormLabel,
  Radio as MuiRadio,
  RadioProps,
} from '@plentyag/brand-ui/src/material-ui/core';
import { cloneDeep, escapeRegExp, isEqual } from 'lodash';
import React from 'react';

import { useFormikProps } from '../hooks/use-formik-props';
import { useIsRequired } from '../hooks/use-is-required';
import { memoWithFormikProps } from '../memo-with-formik-props';

export const CHECK_ALL = 'All';

export const RadioGrid = memoWithFormikProps<FormGen.FieldRadioGrid>(({ formGenField, formikProps, ...props }) => {
  const { decorateLabel } = useIsRequired(formGenField);
  const { value, error, name, label } = useFormikProps(formikProps, formGenField);
  const columns = [...formGenField.columns, CHECK_ALL];

  const handleChange: RadioProps['onChange'] = event => {
    const groups = new RegExp(`${escapeRegExp(name)}\\[(?<index>.+)\\]`).exec(event.currentTarget.name).groups;
    const index = parseInt(groups.index, 10);
    const formikValue = cloneDeep(formikProps.values[name]) ?? [];
    formikValue[index] = event.currentTarget.value;

    formikProps.setFieldValue(name, formikValue);
  };
  const handleCheckAllChange: RadioProps['onChange'] = event => {
    formikProps.setFieldValue(
      name,
      Array.from({ length: formGenField.columns.length }, () => event.currentTarget.value)
    );
  };

  function isRowChecked(row: FormGen.ValueLabel) {
    if (!formikProps.values[name]) {
      return false;
    }
    return isEqual(
      formikProps.values[name],
      Array.from({ length: formGenField.columns.length }, () => row.value)
    );
  }

  return (
    <FormControl {...props} error={Boolean(error)} data-testid={name}>
      <FormLabel>{decorateLabel(label)}</FormLabel>
      <StickyFirstColumnGrid<string, FormGen.ValueLabel>
        columns={columns}
        rows={formGenField.rows}
        renderHeader={({ column }) => column}
        renderRowHeader={({ row }) => row.label}
        renderCell={({ row, colIndex }) =>
          colIndex === columns.length - 1 ? (
            <MuiRadio
              color="primary"
              name={`${name}.${CHECK_ALL}`}
              onChange={handleCheckAllChange}
              value={row.value}
              checked={isRowChecked(row)}
            />
          ) : (
            <MuiRadio
              name={`${name}[${colIndex}]`}
              onChange={handleChange}
              value={row.value}
              checked={value ? value[colIndex] === row.value : false}
            />
          )
        }
      />
      {error && (
        <FormHelperText id={`${name}-helper-text`} error={Boolean(error)}>
          {error}
        </FormHelperText>
      )}
    </FormControl>
  );
});

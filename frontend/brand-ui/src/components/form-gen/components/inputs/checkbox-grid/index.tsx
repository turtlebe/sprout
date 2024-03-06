import { StickyFirstColumnGrid } from '@plentyag/brand-ui/src/components/sticky-first-column-grid';
import {
  CheckboxProps,
  FormControl,
  FormHelperText,
  FormLabel,
  Checkbox as MuiCheckbox,
} from '@plentyag/brand-ui/src/material-ui/core';
import { cloneDeep, difference, get, set } from 'lodash';
import React from 'react';

import { useFormikProps } from '../hooks/use-formik-props';
import { useIsRequired } from '../hooks/use-is-required';
import { memoWithFormikProps } from '../memo-with-formik-props';

export const CHECK_ALL = 'All';

export const CheckboxGrid = memoWithFormikProps<FormGen.FieldCheckboxGrid>(
  ({ formGenField, formikProps, ...props }) => {
    const { decorateLabel } = useIsRequired(formGenField);
    const { value, error, name, label } = useFormikProps(formikProps, formGenField);
    const { enableCheckAll = true } = formGenField;
    const defaultValue = React.useMemo(
      () =>
        formGenField.rows.reduce((acc, row) => {
          acc[row.value] = formGenField.columns.map(() => false);
          return acc;
        }, {}),
      [formGenField]
    );

    const columns = enableCheckAll ? [...formGenField.columns, CHECK_ALL] : [...formGenField.columns];

    const handleChange: CheckboxProps['onChange'] = async event => {
      const path = event.currentTarget.name.replace(`${name}.`, '');
      const formikValue = cloneDeep(formikProps.values[name]) ?? defaultValue;
      // if a row is set to null, initiate everything to [false, ..., false] before changing an index in the array.
      const groupKey = path.split('[')[0];
      if (!formikValue[groupKey]) {
        set(
          formikValue,
          groupKey,
          formGenField.columns.map(() => false)
        );
      }
      set(formikValue, path, event.currentTarget.checked);
      // eslint-disable-next-line @typescript-eslint/await-thenable
      await formikProps.setFieldValue(name, formikValue);
      formikProps.validateField(name);
    };
    const handleCheckAllChange =
      (row: FormGen.ValueLabel): CheckboxProps['onChange'] =>
      async event => {
        const formikValue = cloneDeep(formikProps.values[name]) ?? defaultValue;
        set(
          formikValue,
          row.value,
          formGenField.columns.map(() => event.target.checked)
        );
        // eslint-disable-next-line @typescript-eslint/await-thenable
        await formikProps.setFieldValue(name, formikValue);
        formikProps.validateField(name);
      };

    // Reset to default value when value is undefined
    React.useEffect(() => {
      if (value === undefined) {
        formikProps.setFieldValue(name, defaultValue);
      }
    }, [value]);

    // Reset to default value when the rows changes.
    React.useEffect(() => {
      if (
        value &&
        difference(
          Object.keys(value),
          formGenField.rows.map(row => row.value)
        ).length > 0
      ) {
        formikProps.setFieldValue(name, defaultValue);
      }
    }, [formGenField.rows]);

    function isRowChecked(row: FormGen.ValueLabel) {
      if (!formikProps.values[name] || !formikProps.values[name][row.value]) {
        return false;
      }
      return formikProps.values[name][row.value].every(cell => cell === true);
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
            enableCheckAll && colIndex === columns.length - 1 ? (
              <MuiCheckbox
                color="primary"
                name={`${name}.${row.value}.${CHECK_ALL}`}
                onChange={handleCheckAllChange(row)}
                checked={isRowChecked(row)}
              />
            ) : (
              <MuiCheckbox
                name={`${name}.${row.value}[${colIndex}]`}
                onChange={handleChange}
                checked={get(value, `${row.value}[${colIndex}]`) ?? false}
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
  }
);

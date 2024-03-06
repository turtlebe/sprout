import { StickyFirstColumnGrid } from '@plentyag/brand-ui/src/components/sticky-first-column-grid';
import {
  FormControl,
  FormHelperText,
  FormLabel,
  TextField as MuiTextField,
  TextFieldProps,
} from '@plentyag/brand-ui/src/material-ui/core';
import clsx from 'clsx';
import { cloneDeep, get, set } from 'lodash';
import React from 'react';

import { useFormikProps } from '../hooks/use-formik-props';
import { useIsRequired } from '../hooks/use-is-required';
import { memoWithFormikProps } from '../memo-with-formik-props';
import { parse } from '../text-field';

import { useTextFieldGridInit } from './hooks/use-text-field-grid-init';
import { useStyles } from './styles';
import { getNextTextFieldName, getPreviousTextFieldName } from './utils';

/**
 * TextFieldGrid renders a HTMLTable of TextField.
 *
 * The Formik value associated to this component will be similar to a FormGen.FieldCheckboxGrid component.
 *
 * @example
 *
 * Given the following FormGen.FieldTextFieldGrid definition:
 *
 * ```
 * const textFieldGrid: FormGen.FieldTextFieldGrid = {
 *   type: 'TextFieldGrid',
 *   name: 'example',
 *   columns: ['1', '2,],
 *   rows: [
 *     { label: 'Key 1', value: 'key1' },
 *     { label: 'Key 1', value: 'key1' }
 *   ]
 * }
 * ```
 *
 * When each input has been filled with "example", the Formik value associated to the component will equal:
 * ```
 * {
 *   key1: ["example", "example"],
 *   key2: ["example", "example"],
 * }
 * ```
 */
export const TextFieldGrid = memoWithFormikProps<FormGen.FieldTextFieldGrid>(
  ({ formGenField, formikProps, ...props }) => {
    const { decorateLabel } = useIsRequired(formGenField);
    const { error, name, label } = useFormikProps(formikProps, formGenField);
    const classes = useStyles({});
    const { handleBlur, internalValues, internalParsedValues, setInternalValues, setInternalParsedValues } =
      useTextFieldGridInit(formikProps, formGenField);

    // OnChange, modify the internalValue and internalParsedValues
    const handleChange: TextFieldProps['onChange'] = event => {
      const path = event.currentTarget.name.replace(`${name}.`, '');
      set(internalValues, path, event.currentTarget.value);
      set(internalParsedValues, path, parse(event.currentTarget.type, event.currentTarget.value));
      setInternalValues(cloneDeep(internalValues));
      setInternalParsedValues(cloneDeep(internalParsedValues));
    };

    // Updates Formik Values when internalParsedValues changes.
    React.useEffect(() => {
      formikProps.setFieldValue(name, internalParsedValues);
    }, [internalParsedValues]);

    const handleKeyDownForTabbingVertically = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Tab') {
        const nextTextFieldName = e.shiftKey
          ? getPreviousTextFieldName(formGenField, e.currentTarget.name)
          : getNextTextFieldName(formGenField, e.currentTarget.name);
        if (nextTextFieldName) {
          e.preventDefault();
          document.querySelector<HTMLInputElement>(`input[name="${nextTextFieldName}"]`).focus();
        }
      }
    };

    // fix for https://plentyag.atlassian.net/browse/SD-16363, can be overriden by inputProps.
    const defaultStep = formGenField.textFieldProps?.type === 'number' ? 'any' : undefined;

    return (
      <FormControl {...props} error={Boolean(error)} data-testid={name}>
        <FormLabel>{decorateLabel(label)}</FormLabel>
        <StickyFirstColumnGrid<string, FormGen.ValueLabel>
          columns={formGenField.columns}
          rows={formGenField.rows}
          renderHeader={({ column }) => column}
          renderRowHeader={({ row }) => row.label}
          renderCell={({ row, colIndex }) => (
            <MuiTextField
              {...(formGenField.textFieldProps as TextFieldProps)}
              className={clsx(classes.textField, formGenField.textFieldProps?.className)}
              inputProps={{
                step: defaultStep,
                ...formGenField.textFieldProps?.inputProps,
                onKeyDown: handleKeyDownForTabbingVertically,
              }}
              name={`${name}.${row.value}[${colIndex}]`}
              value={get(internalValues, `${row.value}[${colIndex}]`, '') ?? ''}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          )}
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

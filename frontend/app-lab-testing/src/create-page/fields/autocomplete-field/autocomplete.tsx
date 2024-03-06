import { default as MuiAutocomplete, AutocompleteProps as MuiAutocompleteProps } from '@material-ui/lab/Autocomplete';
import { Chip, CircularProgress, TextField, Tooltip } from '@plentyag/brand-ui/src/material-ui/core';
import { FieldInputProps, FormikHelpers, FormikState } from 'formik';
import React from 'react';

import { getError } from '../../utils/formik-helpers';

import { AutocompleteField } from '.';

export const dataTestIds = {
  textInput: 'text-input',
};

interface Autocomplete {
  setFieldError: FormikHelpers<LT.CreateItem>['setFieldError'];
  setFieldValue: FormikHelpers<LT.CreateItem>['setFieldValue'];
  errors: FormikState<LT.CreateItem>['errors'];
  field: FieldInputProps<string>;
  autoCompleteProps: AutocompleteField;
  disabled: boolean;
}

export type AutocompleteProps = MuiAutocompleteProps<any, false, false, false>;

export const Autocomplete: React.FC<Autocomplete> = ({
  autoCompleteProps,
  setFieldError,
  setFieldValue,
  errors,
  field,
}) => {
  const prevError = React.useRef<string>();
  React.useEffect(() => {
    // force update for provided errors, since errors only updated if value changes and we might
    // want to force showing error even when value doesn't change.
    if (prevError.current !== autoCompleteProps.error) {
      prevError.current = autoCompleteProps.error;
      setFieldError(autoCompleteProps.fieldName, autoCompleteProps.error);
    }
  }, [prevError.current, autoCompleteProps.error]);

  const error = autoCompleteProps.error || getError(errors, autoCompleteProps.fieldName);

  const onInputChange: AutocompleteProps['onInputChange'] = (event, value) => {
    // for free solo mode, update when user types.
    // onChange (below) is only called when selection is made from dropdown, so
    // this event is needed for free solor to capture free form input.
    if (autoCompleteProps.freeSolo) {
      setFieldValue(field.name, value);
    }
  };

  const onChange: AutocompleteProps['onChange'] = (event, value) => {
    // for non free solo mode, only update when value is changed.
    // onChange is only called when selection is made from dropdown.
    if (!autoCompleteProps.freeSolo) {
      setFieldValue(field.name, value || '');
    }
  };

  const renderInput: AutocompleteProps['renderInput'] = ({ InputProps, ...params }) => {
    return (
      <TextField
        data-testid={dataTestIds.textInput}
        {...params}
        error={!!error}
        fullWidth
        helperText={error}
        InputProps={{
          ...InputProps,
          autoComplete: 'off', // disable autocomplete and autofill,
          endAdornment: (
            <>
              {autoCompleteProps.isLoading && <CircularProgress color="inherit" size="1rem" />}
              {InputProps.endAdornment}
            </>
          ),
        }}
      />
    );
  };

  // for free solo - mode need to use custom filer, because onInputChange function here
  // is setting field value and causing FilterOptionsState.inputValue to be empty. for
  // non-solo mode, filterOptions is undefined, which then uses autoComplete's default func.
  const filterOptions = autoCompleteProps.freeSolo
    ? (options: string[]) => {
        const opts = options.filter(option => option.toLowerCase().startsWith(field.value));
        // solo mode won't no options text - so as workaround include in options (but disabled)
        if (opts.length === 0 && autoCompleteProps.noOptionsText) {
          opts.push(autoCompleteProps.noOptionsText);
        }
        return opts;
      }
    : undefined;

  const getOptionDisabled = autoCompleteProps.freeSolo
    ? (option: string) => {
        // note: disabling options as a work-around since autocomplete won't show noOptionsText for freeSolo mode.
        return option === autoCompleteProps.noOptionsText;
      }
    : undefined;

  return (
    <MuiAutocomplete
      forcePopupIcon={true}
      disabled={autoCompleteProps.disabled}
      getOptionDisabled={getOptionDisabled}
      getOptionSelected={autoCompleteProps.getOptionSelected}
      noOptionsText={autoCompleteProps.noOptionsText}
      className={autoCompleteProps.className}
      options={autoCompleteProps.options}
      multiple={autoCompleteProps.multiple}
      freeSolo={autoCompleteProps.freeSolo}
      filterSelectedOptions
      onInputChange={onInputChange}
      filterOptions={filterOptions}
      onChange={onChange}
      onBlur={field.onBlur}
      value={field.value}
      getOptionLabel={autoCompleteProps.getOptionLabel}
      renderTags={(value: any[], getTagProps) =>
        value.map((option: any, index: number) => {
          const label = autoCompleteProps.getOptionLabel ? autoCompleteProps.getOptionLabel(option) : option;
          return (
            <Tooltip title={label} arrow>
              <Chip size="small" label={label} {...getTagProps({ index })} />
            </Tooltip>
          );
        })
      }
      renderInput={renderInput}
    />
  );
};

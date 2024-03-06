import { Search } from '@material-ui/icons';
import { AutocompleteRenderInputParams } from '@material-ui/lab/Autocomplete';
import { CircularProgress, InputAdornment, TextField, TextFieldProps } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { useStyles } from './styles';

export const dataTestIds = {
  textField: 'autocomplete-device-text-field',
};

export { dataTestIds as dataTestIdsAutocompleteTextField };

export interface AutocompleteTextField {
  id: string;
  isLoading: boolean;
  textFieldProps?: Partial<TextFieldProps>;
  error?: string;
}

export const AutocompleteTextField: React.FC<AutocompleteTextField & AutocompleteRenderInputParams> = ({
  textFieldProps,
  InputProps,
  isLoading,
  error,
  ...params
}) => {
  const classes = useStyles({});

  return (
    <TextField
      data-testid={dataTestIds.textField}
      className={classes.textField}
      error={Boolean(error)}
      helperText={error}
      variant="outlined"
      autoFocus
      type="text"
      placeholder="Enter a Device ID/Serial/Device Location Ref or Path"
      {...params}
      {...textFieldProps}
      InputProps={{
        ...InputProps,
        autoComplete: 'off', // disable autocomplete and autofill,
        startAdornment: (
          <InputAdornment position="start">
            <Search />
          </InputAdornment>
        ),
        endAdornment: (
          <>
            <InputAdornment position="end">
              {isLoading && <CircularProgress color="inherit" size="1rem" />}
            </InputAdornment>
            {InputProps.endAdornment}
          </>
        ),
      }}
    />
  );
};

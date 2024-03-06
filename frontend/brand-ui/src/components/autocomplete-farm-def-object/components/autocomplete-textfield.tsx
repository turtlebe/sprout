import { AutocompleteRenderInputParams } from '@material-ui/lab/Autocomplete';
import { CircularProgress, TextField, Tooltip } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { useAutocompleteFarmDefObjectStore } from '../hooks';
import { getShortenedPathFromObject } from '../utils';

interface AutocompleteTextField extends AutocompleteRenderInputParams {
  error: string;
  id: string;
  isLoading: boolean;
  label: string;
}

export const dataTestIdsAutocompleteTextField = {
  textField: 'autocomplete-farm-def-object-textfield',
  tooltip: 'autocomplete-farm-def-object-tooltip',
};

export const AutocompleteTextField: React.FC<AutocompleteTextField> = ({
  error,
  InputProps,
  id,
  isLoading,
  label,
  ...params
}) => {
  const [state, actions] = useAutocompleteFarmDefObjectStore(id);

  const handleKeyDown: TextFieldProps['onKeyDown'] = event => {
    if (event.key === 'Escape') {
      actions.setIsOpen(false);
    }
  };

  return (
    <Tooltip
      data-testid={dataTestIdsAutocompleteTextField.tooltip}
      title={
        !state.isOpen && state.selectedFarmDefObject ? getShortenedPathFromObject(state.selectedFarmDefObject) : ''
      }
      arrow
    >
      <TextField
        data-testid={dataTestIdsAutocompleteTextField.textField}
        fullWidth
        error={Boolean(error)}
        helperText={error}
        {...params}
        name={id}
        id={id}
        onKeyDown={handleKeyDown}
        label={label}
        InputProps={{
          ...InputProps,
          autoComplete: 'off', // disable autocomplete and autofill,
          endAdornment: (
            <>
              {isLoading && <CircularProgress color="inherit" size="1rem" />}
              {InputProps.endAdornment}
            </>
          ),
        }}
      />
    </Tooltip>
  );
};

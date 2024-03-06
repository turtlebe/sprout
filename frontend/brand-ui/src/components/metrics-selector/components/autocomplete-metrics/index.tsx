import Autocomplete, { AutocompleteProps as MuiAutocompleteProps } from '@material-ui/lab/Autocomplete';
import { CircularProgress, TextField } from '@plentyag/brand-ui/src/material-ui/core';
import { Metric } from '@plentyag/core/src/types/environment';
import React from 'react';

export type AutocompleteProps = MuiAutocompleteProps<Metric, true, true, false>;

export interface AutocompleteMetrics {
  id?: string;
  label?: string;
  error?: string;
  isLoading: boolean;
  value: Metric[];
  onOpen: () => void;
  onRemove: (metrics: Metric[]) => void;
  onClear: () => void;
}

/**
 * Autocomplete for visualizing selected Metrics.
 *
 * Note: this component is used mainly to dislay a <TextField /> containg <Chip /> for each selected Metric.
 * This component does not allow choosing a Metric, this is done elsewhere. sSee the parent component <MetricsSelector />.
 */
export const AutocompleteMetrics: React.FC<AutocompleteMetrics> = ({
  id,
  label,
  error,
  isLoading,
  value,
  onRemove,
  onClear,
  onOpen,
}) => {
  const handleChange: AutocompleteProps['onChange'] = (event, entity, reason) => {
    if (reason === 'remove-option') {
      onRemove(entity);
    }

    if (reason === 'clear') {
      onClear();
    }
  };

  return (
    <Autocomplete<Metric, true, true, false>
      multiple
      renderInput={({ InputProps, ...params }) => (
        <TextField
          fullWidth
          error={Boolean(error)}
          helperText={error}
          {...params}
          name={id}
          id={id}
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
      )}
      onChange={handleChange}
      open={false}
      options={value}
      onOpen={onOpen}
      getOptionLabel={metric => `${metric?.path?.split('/').slice(-1)} - ${metric.observationName}`}
      data-testid={id}
      id={id}
      value={value}
    />
  );
};

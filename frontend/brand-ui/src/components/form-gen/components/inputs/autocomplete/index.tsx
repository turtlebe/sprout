import MuiAutocomplete, {
  createFilterOptions,
  AutocompleteProps as MuiAutocompleteProps,
} from '@material-ui/lab/Autocomplete';
import { CircularProgress, TextField } from '@plentyag/brand-ui/src/material-ui/core';
import { isEqual } from 'lodash';
import React from 'react';

import { useFormikProps } from '../hooks/use-formik-props';
import { useIsRequired } from '../hooks/use-is-required';
import { memoWithFormikProps } from '../memo-with-formik-props';

import { getOptions, getSelectedOption, handleKeyDown } from './utils';

interface FreeSoloInputValue extends FormGen.ValueLabel {
  // for free solo mode, this parameter is used to identify a
  // custom value the user has selected from the filtered options.
  isFreeSoloInput?: boolean;
}

type AutocompleteProps = MuiAutocompleteProps<FreeSoloInputValue, false, boolean, boolean>;

const filter = createFilterOptions<FreeSoloInputValue>();

export const Autocomplete = memoWithFormikProps<FormGen.FieldAutocomplete>(
  ({ formGenField, formikProps, ...props }) => {
    const { decorateLabel } = useIsRequired(formGenField);
    const { value = null, error, name, label } = useFormikProps(formikProps, formGenField);
    const options: FormGen.ValueLabel[] = getOptions(formGenField.options);

    function getValue(value: string) {
      return (
        getSelectedOption(options, value) ||
        (formGenField.autocompleteProps?.freeSolo && value && { value, label: value })
      );
    }

    const [selectedOption, setSelectedOption] = React.useState<FormGen.ValueLabel>(getValue(value));

    React.useEffect(() => {
      // updates selectedOption when formGenField.options changed or the formik value changed.
      const option = getValue(value);
      setSelectedOption(option);

      // if the component is currently loading new options, we don't want to reset the formikProps until
      // it has finished loading.
      if (formGenField.autocompleteProps?.loading) {
        return;
      }
      // when the options changes, but the current selected option no longer match the available options,
      // we need to reset the formik value to null for validations purposes.
      if (!option && value) {
        formikProps.setFieldValue(name, null);
      }
    }, [formGenField.options, value]);

    const handleChange: AutocompleteProps['onChange'] = async (event, newSelectedOption) => {
      let option: FormGen.ValueLabel;
      if (typeof newSelectedOption === 'string') {
        option = { value: newSelectedOption, label: newSelectedOption };
      } else if (newSelectedOption?.isFreeSoloInput) {
        option = {
          value: newSelectedOption.value,
          label: newSelectedOption.value,
        };
      } else {
        option = newSelectedOption;
      }
      setSelectedOption(option);
      // eslint-disable-next-line @typescript-eslint/await-thenable
      await formikProps.setFieldValue(name, option?.value);
      formikProps.validateField(name);
    };
    const handleBlur: AutocompleteProps['onBlur'] = () => formikProps.validateField(name);

    const renderInput: AutocompleteProps['renderInput'] = ({ InputProps, ...params }) => (
      <TextField
        fullWidth
        {...params}
        name={name}
        label={decorateLabel(label)}
        error={Boolean(error)}
        helperText={error}
        InputProps={{
          ...InputProps,
          endAdornment: (
            <>
              {formGenField.autocompleteProps?.loading && <CircularProgress color="inherit" size="1rem" />}
              {InputProps.endAdornment}
            </>
          ),
        }}
      />
    );

    // following material-ui guidance, this function adds filter option showing custom user
    // input in "free solo" mode, see: https://mui.com/components/autocomplete/#creatable
    const handleFilterOptions: AutocompleteProps['filterOptions'] = (options, params) => {
      const filtered = filter(options, params);

      const { inputValue } = params;
      // Suggest the creation of a new value
      const isExisting = options.some(option => inputValue === option.value);
      if (inputValue !== '' && !isExisting) {
        filtered.push({
          isFreeSoloInput: true,
          value: inputValue.trim(),
          label: `Add: "${inputValue.trim()}"`,
        });
      }

      return filtered;
    };

    return (
      <MuiAutocomplete<FormGen.ValueLabel, boolean, boolean, boolean>
        {...formGenField.autocompleteProps}
        multiple={false}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        filterOptions={formGenField.autocompleteProps?.freeSolo ? handleFilterOptions : undefined}
        data-testid={name}
        id={name}
        value={selectedOption ?? null}
        options={options}
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        onBlur={handleBlur}
        renderInput={renderInput}
        getOptionLabel={option => option.label}
        getOptionSelected={(option, value) => isEqual(option, value)}
        {...props}
      />
    );
  }
);

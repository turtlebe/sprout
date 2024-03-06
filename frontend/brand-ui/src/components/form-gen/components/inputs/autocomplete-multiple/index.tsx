import MuiAutocomplete, {
  createFilterOptions,
  AutocompleteProps as MuiAutocompleteProps,
} from '@material-ui/lab/Autocomplete';
import { Chip, TextField } from '@plentyag/brand-ui/src/material-ui/core';
import { isEqual } from 'lodash';
import React from 'react';
import { usePrevious } from 'react-use';

import { getOptions, getSelectedOption, handleKeyDown } from '../autocomplete/utils';
import { useFormikProps } from '../hooks/use-formik-props';
import { useIsRequired } from '../hooks/use-is-required';
import { memoWithFormikProps } from '../memo-with-formik-props';

interface FreeSoloInputValue extends FormGen.ValueLabel {
  // for free solo mode, this parameter is used to identify a
  // custom value the user has selected from the filtered options.
  isFreeSoloInput?: boolean;
}

type AutocompleteProps = MuiAutocompleteProps<FreeSoloInputValue, true, boolean, boolean>;

const filter = createFilterOptions<FreeSoloInputValue>();

export const AutocompleteMultiple = memoWithFormikProps<FormGen.FieldAutocompleteMultiple>(
  ({ formGenField, formikProps, ...props }) => {
    const { value: values = [], error, name, label } = useFormikProps(formikProps, formGenField);
    const { decorateLabel } = useIsRequired(formGenField);
    const options: FormGen.ValueLabel[] = getOptions(formGenField.options);

    function getValueLabels(values: string[]) {
      return values
        .map(
          value =>
            getSelectedOption(options, value) ||
            (formGenField.autocompleteProps?.freeSolo && value && { value, label: value })
        )
        .filter(Boolean);
    }

    const [selectedOptions, setSelectedOptions] = React.useState<FormGen.ValueLabel[]>(getValueLabels(values));
    const prevOptions = usePrevious(options);
    const prevValues = usePrevious(values);

    React.useEffect(() => {
      // updates local selectedOptions when formGenField.options changed or the formik value changed.
      if ((prevOptions && prevOptions.length !== options.length) || (prevValues && !isEqual(prevValues, values))) {
        setSelectedOptions(getValueLabels(values));
      }
    }, [formGenField.options, values]);

    const handleChange: AutocompleteProps['onChange'] = async (event, newSelectedOptions) => {
      const options: FormGen.ValueLabel[] = newSelectedOptions.map(option => {
        if (typeof option === 'string') {
          return { value: option, label: option };
        } else if (option?.isFreeSoloInput) {
          return {
            value: option.value,
            label: option.value,
          };
        }
        return option;
      });
      setSelectedOptions(options);
      // eslint-disable-next-line @typescript-eslint/await-thenable
      await formikProps.setFieldValue(
        name,
        options.map(selectedOption => selectedOption.value)
      );
      formikProps.validateField(name);
    };
    const handleBlur: AutocompleteProps['onBlur'] = () => formikProps.validateField(name);

    const renderTags: AutocompleteProps['renderTags'] = (values, getTagProps) => {
      return values.map((option, index) => <Chip label={option.label} {...getTagProps({ index })} />);
    };
    const renderInput: AutocompleteProps['renderInput'] = params => (
      <TextField
        fullWidth
        {...params}
        name={name}
        label={decorateLabel(label)}
        error={Boolean(error)}
        helperText={error}
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
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        filterOptions={formGenField.autocompleteProps?.freeSolo ? handleFilterOptions : undefined}
        multiple
        data-testid={name}
        id={name}
        value={selectedOptions}
        options={options}
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        onBlur={handleBlur}
        renderTags={renderTags}
        renderInput={renderInput}
        getOptionLabel={option => option.label}
        getOptionSelected={(option, value) => isEqual(option, value)}
        {...props}
      />
    );
  }
);

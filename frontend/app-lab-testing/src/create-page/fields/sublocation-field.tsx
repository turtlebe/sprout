import { FieldValidator } from 'formik';
import React from 'react';

import { useSublocations } from '../../common/hooks/use-sub-location';

import { AutocompleteField } from './autocomplete-field';

interface Props {
  className: string;
  location: LT.Location;
  fieldName: string;
  validate?: FieldValidator;
  disabled: boolean;
}

export const SubloctionField: React.FC<Props> = props => {
  const result = useSublocations(props.location.path);

  const text = 'Enter text to create a new sublocation.';
  let noOptionsText = `No options. ${text}`;
  if (result.hasError) {
    noOptionsText = 'Error fetching sublocations, try selecting location again.';
  } else if (result.locations && result.locations.length === 0) {
    noOptionsText = `No existing sublocations for this location. ${text}`;
  } else if (!result.locations) {
    noOptionsText = `No sublocations. Please select a Location or ${text}`;
  }

  return (
    <AutocompleteField
      disabled={props.disabled}
      isLoading={result.isLoading}
      validate={props.validate}
      multiple={false}
      freeSolo={true}
      className={props.className}
      label="Sublocation"
      fieldName={props.fieldName}
      options={result.locations || []}
      noOptionsText={noOptionsText}
    />
  );
};

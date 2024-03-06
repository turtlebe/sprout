import { AutocompleteProps } from '@material-ui/lab/Autocomplete';
import { isValueLabel } from '@plentyag/brand-ui/src/components/form-gen/utils';
import { isKeyPressed } from '@plentyag/core/src/utils';
import { isEqual } from 'lodash';

/**
 * Stop enter submitting the form.
 * @param keyEvent Event triggered when the user presses a key.
 *
 * We free "Enter" key event for Autocomplete
 */
export const handleKeyDown: AutocompleteProps<unknown, undefined, undefined, undefined>['onKeyDown'] = event => {
  const { isEnterPressed } = isKeyPressed(event);
  if (isEnterPressed) {
    event.preventDefault();
  }
};

export const getOptions = (options: (string | FormGen.ValueLabel)[]): FormGen.ValueLabel[] => {
  if (!options) {
    return [];
  }

  return options.map(option => {
    if (isValueLabel(option)) {
      return option;
    }

    return {
      label: option,
      value: option,
    };
  });
};

export const getSelectedOption = (options: FormGen.ValueLabel[], value: string): FormGen.ValueLabel =>
  options.find(option => isEqual(value, option.value));

export const getSelectedOptions = (options: FormGen.ValueLabel[], values: string[]): FormGen.ValueLabel[] =>
  options.filter(option => values.includes(option.value));

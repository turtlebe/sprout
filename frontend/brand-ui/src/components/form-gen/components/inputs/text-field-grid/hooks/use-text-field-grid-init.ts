import { cloneDeep, get, isEqual, set } from 'lodash';
import React from 'react';

import { useFormikProps } from '../../hooks/use-formik-props';

/**
 * InternalValues is the state of the inputs in the TextFieldGrid. Each row has a different key and the column is represented
 * by its index.
 * The TextFields in the grid read and mutate their value from this object.
 */
interface InternalValues {
  [key: string]: string[];
}

/**
 * InternalParsedValues is a copy of InternalValues, except that the values can be typed.
 *
 * The TextFields in the grid mutate this state but never read from it.
 * During TextFieldGrid['onChange'] the function `parse` is used to type the value correctly.
 *
 * When InternalParsedValues changes, a copy is saved in the Formik Values to represent the state of the TextFieldGrid.
 */
interface InternalParsedValues {
  [key: string]: string[] | number[] | boolean[];
}

export enum BlurEffects {
  leadingZeroTrailingOneDecimal = 'leadingZeroTrailingOneDecimal',
}

export function formatWithLeadingZeroTrailingOneDecimal(number: number | string): string {
  if (typeof number !== 'number') {
    return number;
  }

  {
    return number < 10
      ? Number.isInteger(number)
        ? `0${number}.0`
        : `0${number}`
      : Number.isInteger(number)
      ? `${number}.0`
      : `${number}`;
  }
}

/**
 * This component uses two variables to manage its state. InternalValues is used to display the TextFields' values to the user and
 * InternalParsedValues is used to hold a typed (string vs number) variation of InternalValues and represent the state of the component behind
 * scene, which can later be used as the formik values for this component.
 *
 * Why do we need both? Because we have use-cases to show certain numbers to the user in a specific format (using blurring effect). For example in FGQA, we want to show 1 as 01.0.
 * This can only be achieved by only using strings. At the same time we don't want to send '01.0' to the backend, we would like to send 1.
 *
 * This is why we have InternalValues with strings only to render the TextFields' values and InternalParsedValues to hold the typed values that we would like to send to the backend.
 *
 * Initializes and returns `internalValues` `internalParsedValues` states and declare a set of blur callbacks.
 *
 * @see InternalValues
 * @see InternalParsedValues
 *
 * @param formikProps
 * @param formGenField
 */
export const useTextFieldGridInit = (formikProps, formGenField: FormGen.FieldTextFieldGrid) => {
  const { name } = formGenField;
  const { value } = useFormikProps(formikProps, formGenField);

  /**
   * Default initial value for internalParsedValues.
   *
   * Corresponds to an array of undefined based on formGenfield.colums and formGenfield.rows.
   */
  const initialInternalParsedValues = React.useMemo(
    () =>
      formGenField.rows.reduce((acc, row) => {
        acc[row.value] = formGenField.columns.map(() => undefined);
        return acc;
      }, {}),
    [formGenField]
  );

  /**
   * Initial value for internalValues. This takes in account a specified blur effect.
   */
  const initialValuesWithBlurEffect = React.useMemo(
    () =>
      formGenField.rows.reduce((acc, row) => {
        acc[row.value] = formGenField.columns.map((_, index) => {
          if (formGenField.blurEffect === BlurEffects.leadingZeroTrailingOneDecimal) {
            return formatWithLeadingZeroTrailingOneDecimal(get(value, `${row.value}[${index}]`));
          }
          return get(value, `${row.value}[${index}]`);
        });
        return acc;
      }, {}),
    [formGenField, value]
  );

  /**
   * internalValues @see InternalValues
   */
  const [internalValues, setInternalValues] = React.useState<InternalValues>(initialValuesWithBlurEffect);

  /**
   * internalParsedValues @see InternalParsedValues
   */
  const [internalParsedValues, setInternalParsedValues] = React.useState<InternalParsedValues>(
    value ?? initialInternalParsedValues
  );

  React.useEffect(() => {
    if (!isEqual(value, internalParsedValues)) {
      setInternalValues(initialValuesWithBlurEffect);
      setInternalParsedValues(value ?? initialInternalParsedValues);
    }
  }, [value]);

  // When the formGenField.columns changes, we need to adjust internalValues and internalParsedValues to have as many items as we have in
  // formGenField.columns.
  //
  // If the number of columns is smaller than the current value for a given row, the new values will be truncated.
  // If the number of columns is bigger than the current value for a given row, the new values will be be the length of the columns filled with undefined.
  //
  // /!\/!\
  // If this behavior clashes with other use-case, consider gating this with an attribute on FormGen.FieldTextFieldGrid definition.
  React.useEffect(() => {
    if (!isEqual(value, internalParsedValues)) {
      // When the formik values are different that the internal state, something else than the user is changing the state of the TextFieldGrid.
      // This can happen when:
      //   - the TextFieldGrid is initializing and hasn't updated the formik values yet.
      //   - the formik values changed from the outside - for example in edit mode, the values load then the TextFieldGrid updates its state.
      //
      // Exit this effect as this is not a formGenField.columns change triggered by the user.
      return;
    }

    function adjustValues(arrayWithValues) {
      return formGenField.rows.reduce((acc, row) => {
        if (!arrayWithValues[row.value]) {
          acc[row.value] = Array.from(Array(formGenField.columns.length));
          return acc;
        }
        if (formGenField.columns.length <= arrayWithValues[row.value].length) {
          acc[row.value] = arrayWithValues[row.value].slice(0, formGenField.columns.length);
        } else {
          acc[row.value] = arrayWithValues[row.value].concat(
            Array.from(Array(formGenField.columns.length - arrayWithValues[row.value].length))
          );
        }
        return acc;
      }, {});
    }
    const adjustedInternalValues = adjustValues(internalValues);
    const adjustedInternalParsedValues = adjustValues(internalParsedValues);

    setInternalValues(adjustedInternalValues);
    setInternalParsedValues(adjustedInternalParsedValues);
  }, [formGenField.columns]);

  /**
   * On blur, modify `internalValues` to prefix the input value with a leading "0" and,
   * add a ".0" when the value is a single digit integer.
   *
   * @param event blur event
   */
  const blurEffectLeadingZeroTrailingOneDecimal: TextFieldProps['onBlur'] = event => {
    if (event.currentTarget.type === 'number') {
      const parsedValue = parseFloat(event.currentTarget.value);
      if (isNaN(parsedValue)) {
        return;
      }

      const path = event.currentTarget.name.replace(`${name}.`, '');
      const newValue = formatWithLeadingZeroTrailingOneDecimal(parsedValue);

      set(internalValues, path, newValue);
      setInternalValues(cloneDeep(internalValues));
    }
  };

  /**
   * Blur handler
   */
  const handleBlur: TextFieldProps['onBlur'] = React.useCallback(event => {
    switch (formGenField.blurEffect) {
      case BlurEffects.leadingZeroTrailingOneDecimal:
        blurEffectLeadingZeroTrailingOneDecimal(event);
        break;
    }
  }, []);

  return {
    handleBlur,
    internalValues,
    internalParsedValues,
    setInternalValues,
    setInternalParsedValues,
  };
};

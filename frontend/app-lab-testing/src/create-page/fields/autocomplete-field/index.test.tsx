import { render } from '@testing-library/react';
import { FieldValidator, Form, Formik } from 'formik';
import React from 'react';

import { AutocompleteField } from '.';

import { dataTestIds } from './autocomplete';

const formErrorTestId = 'test-form-errors';
function createAutocompleteField({
  error,
  validate,
  disabled,
}: { error?: string; validate?: FieldValidator; disabled?: boolean } = {}) {
  const initialValues = {
    productCodes: {},
  };
  return (
    <Formik initialValues={initialValues} onSubmit={() => {}}>
      {({ errors }) => {
        return (
          <>
            <Form>
              <AutocompleteField
                disabled={disabled}
                options={[]}
                getOptionLabel={() => ''}
                className="test"
                fieldName="productCodes"
                label="test"
                error={error}
                validate={validate}
              />
            </Form>
            <div data-testid={formErrorTestId}>{errors['productCodes']}</div>
          </>
        );
      }}
    </Formik>
  );
}

function queryAutoCompleteError(queryByTestId) {
  return queryByTestId(dataTestIds.textInput).querySelector('p.MuiFormHelperText-root.Mui-error');
}

describe('AutocompleteField', () => {
  it('shows forced error', () => {
    const forcedError = 'ouch!';
    const { queryByTestId } = render(createAutocompleteField({ error: forcedError }));

    // ensure error is propagated to formik and able to display there.
    expect(queryByTestId(formErrorTestId)).toHaveTextContent(forcedError);

    // ensure error is shown in autoCompleteField control.
    expect(queryAutoCompleteError(queryByTestId)).toHaveTextContent(forcedError);
  });

  it('shows error initially then error is removed', () => {
    const forcedError = 'ouch!!!';
    const { queryByTestId, rerender } = render(createAutocompleteField({ error: forcedError }));

    // render again without error
    const newError = '';
    rerender(createAutocompleteField({ error: newError }));

    expect(queryByTestId(formErrorTestId)).toHaveTextContent(newError);

    // control will return null query when error is removed.
    expect(queryAutoCompleteError(queryByTestId)).toBeFalsy();
  });

  it('disables the field', () => {
    const { queryByTestId } = render(createAutocompleteField({ disabled: true }));
    expect(queryByTestId(dataTestIds.textInput).querySelector('input')).toBeDisabled();
  });

  it('enables the field', () => {
    const { queryByTestId } = render(createAutocompleteField({ disabled: false }));
    expect(queryByTestId(dataTestIds.textInput).querySelector('input')).not.toBeDisabled();
  });
});

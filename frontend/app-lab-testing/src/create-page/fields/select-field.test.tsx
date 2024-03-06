import { render } from '@testing-library/react';
import { Form, Formik } from 'formik';
import React from 'react';

import { dataTestIdsSelectField as dataTestIds, SelectField } from './select-field';

describe('SelectField', () => {
  function renderSelectField(disabled: boolean) {
    const options = [
      { value: 'value1', label: 'value 1' },
      { value: 'value2', label: 'value 2' },
    ];
    return render(
      <Formik initialValues={{}} onSubmit={() => {}}>
        {() => {
          return (
            <Form>
              <SelectField
                className=""
                fieldName="test-select-field"
                options={options}
                label="test"
                disabled={disabled}
              />
            </Form>
          );
        }}
      </Formik>
    );
  }

  it('disables the field', () => {
    const { queryByTestId } = renderSelectField(true);
    expect(queryByTestId(dataTestIds.textField).querySelector('.MuiSelect-root')).toHaveAttribute('aria-disabled');
  });

  it('enables the field', () => {
    const { queryByTestId } = renderSelectField(false);
    expect(queryByTestId(dataTestIds.textField).querySelector('.MuiSelect-root')).not.toHaveAttribute('aria-disabled');
  });
});

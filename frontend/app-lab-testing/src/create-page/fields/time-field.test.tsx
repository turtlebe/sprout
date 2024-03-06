import { render } from '@testing-library/react';
import { Form, Formik } from 'formik';
import React from 'react';

import { dataTestIdsTimeField as dataTestIds, TimeField } from './time-field';

describe('TimeField', () => {
  function renderTimeField(disabled: boolean) {
    return render(
      <Formik initialValues={{}} onSubmit={() => {}}>
        {() => {
          return (
            <Form>
              <TimeField className="" fieldName="test-time-field" label="test" disabled={disabled} />
            </Form>
          );
        }}
      </Formik>
    );
  }

  it('disabled the field', () => {
    const { queryByTestId } = renderTimeField(true);
    expect(queryByTestId(dataTestIds.keyboardTimePicker).querySelector('input')).toBeDisabled();
  });

  it('enables the field', () => {
    const { queryByTestId } = renderTimeField(false);
    expect(queryByTestId(dataTestIds.keyboardTimePicker).querySelector('input')).not.toBeDisabled();
  });
});

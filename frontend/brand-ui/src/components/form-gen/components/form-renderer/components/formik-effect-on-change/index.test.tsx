import { InputRenderer } from '@plentyag/brand-ui/src/components/form-gen/components/input-renderer';
import { getInputComponent } from '@plentyag/brand-ui/src/components/form-gen/components/inputs';
import { changeTextField, chooseFromAutocompleteByIndex, openAutocomplete } from '@plentyag/brand-ui/src/test-helpers';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { fireEvent, render } from '@testing-library/react';
import { Formik } from 'formik';
import React from 'react';

import { FormikEffectOnChange } from '.';

describe('FormikEffectOnChange', () => {
  it('executes a callback when FieldAutocompleteMultiple input is changed', async () => {
    const handleChange = jest.fn();
    const formGenField: FormGen.FieldAutocompleteMultiple = {
      type: 'AutocompleteMultiple',
      name: 'mockName',
      label: 'Mock Label',
      options: ['A', 'B', 'C'],
    };
    const { getByTestId } = render(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        {formikProps => (
          <>
            <FormikEffectOnChange formikProps={formikProps} onChange={handleChange} />
            <InputRenderer
              InputComponent={getInputComponent(formGenField)}
              formGenField={formGenField}
              formikProps={formikProps}
            />
          </>
        )}
      </Formik>
    );

    const input = getByTestId(formGenField.name).querySelector('input');
    expect(handleChange).toHaveBeenCalledTimes(0);

    await actAndAwait(() => openAutocomplete(input));
    await actAndAwait(() => chooseFromAutocompleteByIndex(0));
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith({ mockName: ['A'] });

    await actAndAwait(() => openAutocomplete(input));
    await actAndAwait(() => chooseFromAutocompleteByIndex(1));
    expect(handleChange).toHaveBeenCalledTimes(2);
    expect(handleChange).toHaveBeenCalledWith({ mockName: ['A', 'B'] });
  });

  it('executes a callback when FieldTextField input is changed', async () => {
    const handleChange = jest.fn();
    const formGenField: FormGen.FieldTextField = {
      type: 'TextField',
      name: 'mockName',
      label: 'Mock Label',
    };

    const { getByTestId } = render(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        {formikProps => (
          <>
            <FormikEffectOnChange formikProps={formikProps} onChange={handleChange} />
            <InputRenderer
              InputComponent={getInputComponent(formGenField)}
              formGenField={formGenField}
              formikProps={formikProps}
            />
          </>
        )}
      </Formik>
    );

    const input = getByTestId(formGenField.name).querySelector('input');

    await actAndAwait(() => {
      changeTextField(input, 'ABC');
      fireEvent.blur(input);
    });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith({ mockName: 'ABC' });
  });
});

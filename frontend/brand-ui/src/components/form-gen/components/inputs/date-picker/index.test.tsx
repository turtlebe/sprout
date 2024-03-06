import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { fireEvent } from '@testing-library/react';
import * as yup from 'yup';

import { makeOptions, renderFormGenInput } from '../test-helpers';

import { DatePicker } from '.';

const options = makeOptions({});

describe('Datepicker', () => {
  it('validates on blur', async () => {
    const [{ getByTestId }, { formGenField, validateField }] = renderFormGenInput(DatePicker, options());

    const input = getByTestId(formGenField.name).querySelector('input');
    const label = getByTestId(formGenField.name).querySelector('label');

    expect(label).toHaveTextContent(formGenField.label);
    expect(input).toHaveAttribute('id', formGenField.name);
    expect(input).toHaveAttribute('name', formGenField.name);

    await actAndAwait(() => fireEvent.blur(input));

    expect(validateField).toHaveBeenCalled();
  });

  it('initialize the value to the formik context', () => {
    const [{ getByTestId }, { formGenField }] = renderFormGenInput(
      DatePicker,
      options({ initialValues: { mockName: '01/01/2020 12:00 AM' } })
    );

    const input = getByTestId(formGenField.name).querySelector('input');

    expect(input).toHaveValue('01/01/2020 12:00 AM');
    expect(input).toHaveAttribute('id', formGenField.name);
    expect(input).toHaveAttribute('name', formGenField.name);
  });

  it('decorates the label with "*" when required with yup', () => {
    const [{ getByTestId }, { formGenField }] = renderFormGenInput(
      DatePicker,
      options({ formGenField: { validate: yup.mixed().required() } })
    );

    const label = getByTestId(formGenField.name).querySelector('label');

    expect(label).toHaveTextContent(`${formGenField.label} *`);
  });

  it('supports MUI DatePicker props', () => {
    const [{ getByTestId }, { formGenField }] = renderFormGenInput(
      DatePicker,
      options({ formGenField: { datePickerProps: { disabled: true } } })
    );

    const input = getByTestId(formGenField.name).querySelector('input');

    expect(input).toHaveAttribute('disabled');
  });
});

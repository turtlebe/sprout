import { changeTextField } from '@plentyag/brand-ui/src/test-helpers';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { DateTimeFormat } from '@plentyag/core/src/utils';
import { fireEvent, render } from '@testing-library/react';
import { DateTime } from 'luxon';
import React from 'react';
import * as yup from 'yup';

import { makeOptions, mockFormikProps, renderFormGenInputAsync } from '../test-helpers';

import { KeyboardDatePicker } from '.';

const options = makeOptions({});
let formikProps;

describe('KeyboardDatePicker', () => {
  it('validates on blur', async () => {
    const [{ getByTestId }, { formGenField, validateField }] = await renderFormGenInputAsync(
      KeyboardDatePicker,
      options()
    );

    const input = getByTestId(formGenField.name).querySelector('input');
    const label = getByTestId(formGenField.name).querySelector('label');

    expect(label).toHaveTextContent(formGenField.label);
    expect(input).toHaveAttribute('id', formGenField.name);
    expect(input).toHaveAttribute('name', formGenField.name);

    await actAndAwait(() => fireEvent.blur(input));

    expect(validateField).toHaveBeenCalled();
  });

  it('initialize the value to the formik context and validates on change', async () => {
    const [{ getByTestId }, { formGenField, validateField }] = await renderFormGenInputAsync(
      KeyboardDatePicker,
      options({ initialValues: { mockName: '01/01/2020' } })
    );

    const input = getByTestId(formGenField.name).querySelector('input');

    expect(input).toHaveValue('01/01/2020');
    expect(input).toHaveAttribute('id', formGenField.name);
    expect(input).toHaveAttribute('name', formGenField.name);

    await actAndAwait(() => changeTextField(input, '01/02/2020'));

    expect(input).toHaveValue('01/02/2020');
    expect(validateField).toHaveBeenCalled();
  });

  it('decorates the label with "*" when required with yup', async () => {
    const [{ getByTestId }, { formGenField }] = await renderFormGenInputAsync(
      KeyboardDatePicker,
      options({ formGenField: { validate: yup.mixed().required() } })
    );

    const label = getByTestId(formGenField.name).querySelector('label');

    expect(label).toHaveTextContent(`${formGenField.label} *`);
  });

  it('supports MUI KeyboardDatePicker props', async () => {
    const [{ getByTestId }, { formGenField }] = await renderFormGenInputAsync(
      KeyboardDatePicker,
      options({ formGenField: { keyboardDatePickerProps: { disabled: true } } })
    );

    const input = getByTestId(formGenField.name).querySelector('input');

    expect(input).toHaveAttribute('disabled');
  });

  it('formats the formik value on mount and on update', () => {
    const formGenField: FormGen.FieldKeyboardDatePicker = {
      type: 'KeyboardDatePicker',
      name: 'mockName',
      label: 'label',
      valueFormat: DateTimeFormat.SQL_DATE_ONLY,
      default: new Date(),
    };
    const today = DateTime.now();

    // 1 -> Render with default value = new Date()
    const formikProps1 = mockFormikProps({ formGenField });
    const setFieldValue1 = jest.spyOn(formikProps1, 'setFieldValue');
    const { getByTestId, rerender } = render(
      <KeyboardDatePicker formGenField={formGenField} formikProps={formikProps1} />
    );
    const input = getByTestId(formGenField.name).querySelector('input');
    expect(input).toHaveValue(today.toFormat(DateTimeFormat.US_DATE_ONLY));
    expect(setFieldValue1).toHaveBeenCalledWith(formGenField.name, today.toFormat(formGenField.valueFormat));

    // 2 -> Re-Render after default value has mutated the formik values.
    const formikProps2 = mockFormikProps({ formGenField, value: today.toFormat(formGenField.valueFormat) });
    const setFieldValue2 = jest.spyOn(formikProps2, 'setFieldValue');
    rerender(<KeyboardDatePicker formGenField={formGenField} formikProps={formikProps2} />);
    expect(input).toHaveValue(today.toFormat(DateTimeFormat.US_DATE_ONLY));
    expect(setFieldValue2).toHaveBeenCalledWith(formGenField.name, today.toFormat(formGenField.valueFormat));

    // 3 -> Re-Render after an external event updated the formik values (form reset for example)
    const formikProps3 = mockFormikProps({ formGenField });
    const setFieldValue3 = jest.spyOn(formikProps3, 'setFieldValue');
    rerender(<KeyboardDatePicker formGenField={formGenField} formikProps={formikProps3} />);
    expect(input).toHaveValue(today.toFormat(DateTimeFormat.US_DATE_ONLY));
    expect(setFieldValue3).toHaveBeenCalledWith(formGenField.name, today.toFormat(formGenField.valueFormat));

    // 4 -> Re-Render after an external event updated the formik values
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const formikProps4 = mockFormikProps({ formGenField, value: yesterday });
    const setFieldValue4 = jest.spyOn(formikProps4, 'setFieldValue');
    rerender(<KeyboardDatePicker formGenField={formGenField} formikProps={formikProps4} />);
    expect(input).toHaveValue(DateTime.fromJSDate(yesterday).toFormat(DateTimeFormat.US_DATE_ONLY));
    expect(setFieldValue4).toHaveBeenCalledWith(
      formGenField.name,
      DateTime.fromJSDate(yesterday).toFormat(formGenField.valueFormat)
    );
  });

  it('formats the formik value on mount and on update (without default)', () => {
    const formGenField: FormGen.FieldKeyboardDatePicker = {
      type: 'KeyboardDatePicker',
      name: 'mockName',
      label: 'label',
      valueFormat: DateTimeFormat.SQL_DATE_ONLY,
    };
    const today = DateTime.now();

    // 1 -> Render with no default value
    const formikProps1 = mockFormikProps({ formGenField });
    const setFieldValue1 = jest.spyOn(formikProps1, 'setFieldValue');
    const { getByTestId, rerender } = render(
      <KeyboardDatePicker formGenField={formGenField} formikProps={formikProps1} />
    );
    const input = getByTestId(formGenField.name).querySelector('input');
    expect(input).toHaveValue('');
    expect(setFieldValue1).toHaveBeenCalledWith(formGenField.name, undefined);

    // 2 -> Re-Render after default value has mutated the formik values.
    const formikProps2 = mockFormikProps({ formGenField, value: today.toFormat(formGenField.valueFormat) });
    const setFieldValue2 = jest.spyOn(formikProps2, 'setFieldValue');
    rerender(<KeyboardDatePicker formGenField={formGenField} formikProps={formikProps2} />);
    expect(input).toHaveValue(today.toFormat(DateTimeFormat.US_DATE_ONLY));
    expect(setFieldValue2).toHaveBeenCalledWith(formGenField.name, today.toFormat(formGenField.valueFormat));

    // 3 -> Re-Render after an external event updated the formik values (form reset for example)
    const formikProps3 = mockFormikProps({ formGenField });
    const setFieldValue3 = jest.spyOn(formikProps3, 'setFieldValue');
    rerender(<KeyboardDatePicker formGenField={formGenField} formikProps={formikProps3} />);
    expect(input).toHaveValue('');
    expect(setFieldValue3).toHaveBeenCalledWith(formGenField.name, undefined);

    // 4 -> Re-Render after an external event updated the formik values
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const formikProps4 = mockFormikProps({ formGenField, value: yesterday });
    const setFieldValue4 = jest.spyOn(formikProps4, 'setFieldValue');
    rerender(<KeyboardDatePicker formGenField={formGenField} formikProps={formikProps4} />);
    expect(input).toHaveValue(DateTime.fromJSDate(yesterday).toFormat(DateTimeFormat.US_DATE_ONLY));
    expect(setFieldValue4).toHaveBeenCalledWith(
      formGenField.name,
      DateTime.fromJSDate(yesterday).toFormat(formGenField.valueFormat)
    );
  });

  it('clears the input and the formik values', async () => {
    const [{ getByTestId }, { formGenField, validateField }] = await renderFormGenInputAsync(
      KeyboardDatePicker,
      options({ initialValues: { mockName: '01/01/2020' }, setFormikProps: f => (formikProps = f) })
    );

    const input = getByTestId(formGenField.name).querySelector('input');

    expect(input).toHaveValue('01/01/2020');
    expect(formikProps.values.mockName).toBe(DateTime.fromFormat('01/01/2020', DateTimeFormat.US_DATE_ONLY).toISO());

    await actAndAwait(() => changeTextField(input, null));

    expect(input).toHaveValue('');
    expect(formikProps.values.mockName).toBeNull();
    expect(validateField).toHaveBeenCalled();
  });

  describe('without format value', () => {
    it('defaults to ISO String when datetime is passed as a string (with default date time format)', async () => {
      const datetime = '12/01/2021 01:00 AM';
      const [{ getByTestId }, { formGenField }] = await renderFormGenInputAsync(
        KeyboardDatePicker,
        options({
          initialValues: { mockName: datetime },
          setFormikProps: f => (formikProps = f),
        })
      );

      const input = getByTestId(formGenField.name).querySelector('input');

      expect(input).toHaveValue(
        DateTime.fromFormat(datetime, DateTimeFormat.US_DEFAULT).toFormat(DateTimeFormat.US_DATE_ONLY)
      );
      expect(formikProps.values.mockName).toBe(DateTime.fromFormat(datetime, DateTimeFormat.US_DEFAULT).toISO());
    });

    it('defaults to ISO string when datetime is passed as a native Date object', async () => {
      const date = new Date();
      const dateTime = DateTime.fromJSDate(date);
      const [{ getByTestId }, { formGenField }] = await renderFormGenInputAsync(
        KeyboardDatePicker,
        options({
          initialValues: { mockName: date },
          setFormikProps: f => (formikProps = f),
        })
      );

      const input = getByTestId(formGenField.name).querySelector('input');

      expect(input).toHaveValue(dateTime.toFormat(DateTimeFormat.US_DATE_ONLY));
      expect(formikProps.values.mockName).toBe(dateTime.toISO());
    });
  });
});

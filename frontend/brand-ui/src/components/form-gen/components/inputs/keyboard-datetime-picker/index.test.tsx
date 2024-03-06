import { changeTextField } from '@plentyag/brand-ui/src/test-helpers';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { DateTimeFormat } from '@plentyag/core/src/utils';
import { fireEvent, render } from '@testing-library/react';
import { DateTime } from 'luxon';
import React from 'react';
import * as yup from 'yup';

import { makeOptions, mockFormikProps, renderFormGenInput, renderFormGenInputAsync } from '../test-helpers';

import { KeyboardDateTimePicker } from '.';

const options = makeOptions({});
let formikProps;
const customDateFormat = 'yyyy/MM/dd hh:mm a';

describe('KeyboardDateTimePicker', () => {
  it('validates on blur', async () => {
    const [{ getByTestId }, { formGenField, validateField }] = renderFormGenInput(KeyboardDateTimePicker, options());

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
      KeyboardDateTimePicker,
      options({
        formGenField: { valueFormat: customDateFormat },
        initialValues: { mockName: '2021/12/01 01:00 am' },
      })
    );

    const input = getByTestId(formGenField.name).querySelector('input');

    // The input here uses the default format provide by KeyboardDateTimePicker in brand-ui/src/material-ui/pickers.
    expect(input).toHaveValue('12/01/2021 01:00 AM');
    expect(input).toHaveAttribute('id', formGenField.name);
    expect(input).toHaveAttribute('name', formGenField.name);

    await actAndAwait(() => changeTextField(input, '12/01/2021 05:00 AM'));

    expect(input).toHaveValue('12/01/2021 05:00 AM');
    expect(validateField).toHaveBeenCalled();
  });

  it('accepts time as native Date object', async () => {
    const dateObject = new Date();
    const [{ getByTestId }, { formGenField }] = await renderFormGenInputAsync(
      KeyboardDateTimePicker,
      options({
        formGenField: { valueFormat: customDateFormat },
        initialValues: { mockName: dateObject },
        setFormikProps: f => (formikProps = f),
      })
    );

    const input = getByTestId(formGenField.name).querySelector('input');

    expect(input).toHaveValue(DateTime.fromJSDate(dateObject).toFormat(DateTimeFormat.US_DEFAULT));
    expect(formikProps.values.mockName).toBe(DateTime.fromJSDate(dateObject).toFormat(customDateFormat));
  });

  it('accepts time as DateTime object', async () => {
    const dateTime = DateTime.now();
    const [{ getByTestId }, { formGenField }] = await renderFormGenInputAsync(
      KeyboardDateTimePicker,
      options({
        formGenField: { valueFormat: customDateFormat },
        initialValues: { mockName: dateTime },
        setFormikProps: f => (formikProps = f),
      })
    );

    const input = getByTestId(formGenField.name).querySelector('input');

    expect(input).toHaveValue(dateTime.toFormat(DateTimeFormat.US_DEFAULT));
    expect(formikProps.values.mockName).toBe(dateTime.toFormat(customDateFormat));
  });

  describe('without format value', () => {
    it('defaults to ISO String when datetime is passed as a string (with default date time format)', async () => {
      const datetime = '12/01/2021 01:00 AM';
      const [{ getByTestId }, { formGenField }] = await renderFormGenInputAsync(
        KeyboardDateTimePicker,
        options({
          initialValues: { mockName: datetime },
          setFormikProps: f => (formikProps = f),
        })
      );

      const input = getByTestId(formGenField.name).querySelector('input');

      expect(input).toHaveValue(
        DateTime.fromFormat(datetime, DateTimeFormat.US_DEFAULT).toFormat(DateTimeFormat.US_DEFAULT)
      );
      expect(formikProps.values.mockName).toBe(DateTime.fromFormat(datetime, DateTimeFormat.US_DEFAULT).toISO());
    });

    it('defaults to ISO string when datetime is passed as a native Date object', async () => {
      const date = new Date();
      const [{ getByTestId }, { formGenField }] = await renderFormGenInputAsync(
        KeyboardDateTimePicker,
        options({
          initialValues: { mockName: date },
          setFormikProps: f => (formikProps = f),
        })
      );

      const input = getByTestId(formGenField.name).querySelector('input');

      expect(input).toHaveValue(DateTime.fromJSDate(date).toFormat(DateTimeFormat.US_DEFAULT));
      expect(formikProps.values.mockName).toBe(DateTime.fromJSDate(date).toISO());
    });

    it('defaults to ISO string when datetime is passed as a DateTime object', async () => {
      const dateTime = DateTime.now();
      const [{ getByTestId }, { formGenField }] = await renderFormGenInputAsync(
        KeyboardDateTimePicker,
        options({
          initialValues: { mockName: dateTime },
          setFormikProps: f => (formikProps = f),
        })
      );

      const input = getByTestId(formGenField.name).querySelector('input');

      expect(input).toHaveValue(dateTime.toFormat(DateTimeFormat.US_DEFAULT));
      expect(formikProps.values.mockName).toBe(dateTime.toISO());
    });
  });

  it('decorates the label with "*" when required with yup', async () => {
    const [{ getByTestId }, { formGenField }] = await renderFormGenInputAsync(
      KeyboardDateTimePicker,
      options({ formGenField: { validate: yup.mixed().required() } })
    );

    const label = getByTestId(formGenField.name).querySelector('label');

    expect(label).toHaveTextContent(`${formGenField.label} *`);
  });

  it('supports MUI KeyboardDateTimePicker props', async () => {
    const [{ getByTestId }, { formGenField }] = await renderFormGenInputAsync(
      KeyboardDateTimePicker,
      options({ formGenField: { keyboardDateTimePickerProps: { disabled: true } } })
    );

    const input = getByTestId(formGenField.name).querySelector('input');

    expect(input).toHaveAttribute('disabled');
  });

  it('formats the formik value on mount and on update', () => {
    const formGenField: FormGen.FieldKeyboardDateTimePicker = {
      type: 'KeyboardDateTimePicker',
      name: 'mockName',
      label: 'label',
      valueFormat: customDateFormat,
      default: new Date(),
    };
    const today = DateTime.now();

    // 1 -> Render with default value = new Date()
    const formikProps1 = mockFormikProps({ formGenField });
    const setFieldValue1 = jest.spyOn(formikProps1, 'setFieldValue');
    const { getByTestId, rerender } = render(
      <KeyboardDateTimePicker formGenField={formGenField} formikProps={formikProps1} />
    );
    const input = getByTestId(formGenField.name).querySelector('input');
    expect(input).toHaveValue(today.toFormat(DateTimeFormat.US_DEFAULT));
    expect(setFieldValue1).toHaveBeenCalledWith(formGenField.name, today.toFormat(formGenField.valueFormat));

    // 2 -> Re-Render after default value has mutated the formik values
    const formikProps2 = mockFormikProps({ formGenField, value: today.toFormat(formGenField.valueFormat) });
    const setFieldValue2 = jest.spyOn(formikProps2, 'setFieldValue');
    rerender(<KeyboardDateTimePicker formGenField={formGenField} formikProps={formikProps2} />);
    expect(input).toHaveValue(today.toFormat(DateTimeFormat.US_DEFAULT));
    expect(setFieldValue2).toHaveBeenCalledWith(formGenField.name, today.toFormat(formGenField.valueFormat));

    // 3 -> Re-Render after an external event updated the formik values (form reset for example)
    const formikProps3 = mockFormikProps({ formGenField });
    const setFieldValue3 = jest.spyOn(formikProps3, 'setFieldValue');
    rerender(<KeyboardDateTimePicker formGenField={formGenField} formikProps={formikProps3} />);
    expect(input).toHaveValue(today.toFormat(DateTimeFormat.US_DEFAULT));
    expect(setFieldValue3).toHaveBeenCalledWith(formGenField.name, today.toFormat(formGenField.valueFormat));

    // 4 -> Re-Render after an external event updated the formik values
    const anHourAgo = new Date();
    anHourAgo.setHours(anHourAgo.getHours() - 1);

    const formikProps4 = mockFormikProps({ formGenField, value: anHourAgo });
    const setFieldValue4 = jest.spyOn(formikProps4, 'setFieldValue');
    rerender(<KeyboardDateTimePicker formGenField={formGenField} formikProps={formikProps4} />);
    expect(input).toHaveValue(DateTime.fromJSDate(anHourAgo).toFormat(DateTimeFormat.US_DEFAULT));
    expect(setFieldValue4).toHaveBeenCalledWith(
      formGenField.name,
      DateTime.fromJSDate(anHourAgo).toFormat(formGenField.valueFormat)
    );
  });

  it('clears the input and the formik values', async () => {
    const [{ getByTestId }, { formGenField, validateField }] = await renderFormGenInputAsync(
      KeyboardDateTimePicker,
      options({
        initialValues: { mockName: '2021-12-01T01:00' },
        setFormikProps: f => (formikProps = f),
      })
    );

    const input = getByTestId(formGenField.name).querySelector('input');

    expect(input).toHaveValue('12/01/2021 01:00 AM');
    expect(formikProps.values.mockName).toBe(
      DateTime.fromFormat('12/01/2021 01:00 AM', DateTimeFormat.US_DEFAULT).toISO()
    );

    await actAndAwait(() => changeTextField(input, null));

    expect(input).toHaveValue('');
    expect(formikProps.values.mockName).toBeNull();
    expect(validateField).toHaveBeenCalled();
  });
});

import { changeTextField } from '@plentyag/brand-ui/src/test-helpers';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { DateTimeFormat } from '@plentyag/core/src/utils';
import { fireEvent, render } from '@testing-library/react';
import { DateTime } from 'luxon';
import React from 'react';
import * as yup from 'yup';

import { makeOptions, mockFormikProps, renderFormGenInput, renderFormGenInputAsync } from '../test-helpers';

import { KeyboardTimePicker } from '.';

const options = makeOptions({});
let formikProps;

describe('KeyboardTimePicker', () => {
  it('validates on blur', async () => {
    const [{ getByTestId }, { formGenField, validateField }] = renderFormGenInput(KeyboardTimePicker, options());

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
      KeyboardTimePicker,
      options({ formGenField: { valueFormat: 'hh:mm a' }, initialValues: { mockName: '01:00 AM' } })
    );

    const input = getByTestId(formGenField.name).querySelector('input');

    expect(input).toHaveValue('01:00 AM');
    expect(input).toHaveAttribute('id', formGenField.name);
    expect(input).toHaveAttribute('name', formGenField.name);

    await actAndAwait(() => changeTextField(input, '05:00 AM'));

    expect(input).toHaveValue('05:00 AM');
    expect(validateField).toHaveBeenCalled();
  });

  it('accepts time as string', async () => {
    const [{ getByTestId }, { formGenField }] = await renderFormGenInputAsync(
      KeyboardTimePicker,
      options({
        formGenField: { valueFormat: 'hh:mm a' },
        initialValues: { mockName: '01:00 AM' },
        setFormikProps: f => (formikProps = f),
      })
    );

    const input = getByTestId(formGenField.name).querySelector('input');

    expect(input).toHaveValue('01:00 AM');
    expect(formikProps.values.mockName).toBe('01:00 AM');
  });

  it('accepts time as native Date object', async () => {
    const dateObject = new Date();
    const expectedStringValue = DateTime.fromJSDate(dateObject).toFormat(DateTimeFormat.US_TIME_ONLY);
    const [{ getByTestId }, { formGenField }] = await renderFormGenInputAsync(
      KeyboardTimePicker,
      options({
        formGenField: { valueFormat: 'hh:mm a' },
        initialValues: { mockName: dateObject },
        setFormikProps: f => (formikProps = f),
      })
    );

    const input = getByTestId(formGenField.name).querySelector('input');

    expect(input).toHaveValue(expectedStringValue);
    expect(formikProps.values.mockName).toBe(expectedStringValue);
  });

  it('accepts time as DateTime object', async () => {
    const dateTime = DateTime.now();
    const [{ getByTestId }, { formGenField }] = await renderFormGenInputAsync(
      KeyboardTimePicker,
      options({
        formGenField: { valueFormat: 'hh:mm a' },
        initialValues: { mockName: dateTime },
        setFormikProps: f => (formikProps = f),
      })
    );

    const input = getByTestId(formGenField.name).querySelector('input');

    expect(input).toHaveValue(dateTime.toFormat('hh:mm a'));
    expect(formikProps.values.mockName).toBe(dateTime.toFormat('hh:mm a'));
  });

  describe('without format value', () => {
    it('defaults to null when time is passed as a string', async () => {
      const [{ getByTestId }, { formGenField }] = await renderFormGenInputAsync(
        KeyboardTimePicker,
        options({
          initialValues: { mockName: '01:00 AM' },
          setFormikProps: f => (formikProps = f),
        })
      );

      const input = getByTestId(formGenField.name).querySelector('input');

      expect(input).toHaveValue('');
      expect(formikProps.values.mockName).toBe(null);
    });

    it('defaults to ISO string when time is passed as a native Date object', async () => {
      const date = new Date();
      const dateTime = DateTime.fromJSDate(date);
      const [{ getByTestId }, { formGenField }] = await renderFormGenInputAsync(
        KeyboardTimePicker,
        options({
          initialValues: { mockName: date },
          setFormikProps: f => (formikProps = f),
        })
      );

      const input = getByTestId(formGenField.name).querySelector('input');

      expect(input).toHaveValue(dateTime.toFormat('hh:mm a'));
      expect(formikProps.values.mockName).toBe(dateTime.toISO());
    });

    it('defaults to ISO string when time is passed as a DateTime object', async () => {
      const dateTime = DateTime.now();
      const [{ getByTestId }, { formGenField }] = await renderFormGenInputAsync(
        KeyboardTimePicker,
        options({
          initialValues: { mockName: dateTime },
          setFormikProps: f => (formikProps = f),
        })
      );

      const input = getByTestId(formGenField.name).querySelector('input');

      expect(input).toHaveValue(dateTime.toFormat('hh:mm a'));
      expect(formikProps.values.mockName).toBe(dateTime.toISO());
    });
  });

  it('decorates the label with "*" when required with yup', async () => {
    const [{ getByTestId }, { formGenField }] = await renderFormGenInputAsync(
      KeyboardTimePicker,
      options({ formGenField: { validate: yup.mixed().required() } })
    );

    const label = getByTestId(formGenField.name).querySelector('label');

    expect(label).toHaveTextContent(`${formGenField.label} *`);
  });

  it('supports MUI KeyboardTimePicker props', async () => {
    const [{ getByTestId }, { formGenField }] = await renderFormGenInputAsync(
      KeyboardTimePicker,
      options({ formGenField: { keyboardTimePickerProps: { disabled: true } } })
    );

    const input = getByTestId(formGenField.name).querySelector('input');

    expect(input).toHaveAttribute('disabled');
  });

  it('formats the formik value on mount and on update', () => {
    const formGenField: FormGen.FieldKeyboardTimePicker = {
      type: 'KeyboardTimePicker',
      name: 'mockName',
      label: 'label',
      valueFormat: 'HH:mm',
      default: new Date(),
    };
    const today = DateTime.now();

    // 1 -> Render with default value = new Date()
    const formikProps1 = mockFormikProps({ formGenField });
    const setFieldValue1 = jest.spyOn(formikProps1, 'setFieldValue');
    const { getByTestId, rerender } = render(
      <KeyboardTimePicker formGenField={formGenField} formikProps={formikProps1} />
    );
    const input = getByTestId(formGenField.name).querySelector('input');
    expect(input).toHaveValue(today.toFormat(DateTimeFormat.US_TIME_ONLY));
    expect(setFieldValue1).toHaveBeenCalledWith(formGenField.name, today.toFormat(formGenField.valueFormat));

    // 2 -> Re-Render after default value has mutated the formik values.
    const formikProps2 = mockFormikProps({ formGenField, value: today.toFormat(formGenField.valueFormat) });
    const setFieldValue2 = jest.spyOn(formikProps2, 'setFieldValue');
    rerender(<KeyboardTimePicker formGenField={formGenField} formikProps={formikProps2} />);
    expect(input).toHaveValue(today.toFormat(DateTimeFormat.US_TIME_ONLY));
    expect(setFieldValue2).toHaveBeenCalledWith(formGenField.name, today.toFormat(formGenField.valueFormat));

    // 3 -> Re-Render after an external event updated the formik values (form reset for example)
    const formikProps3 = mockFormikProps({ formGenField });
    const setFieldValue3 = jest.spyOn(formikProps3, 'setFieldValue');
    rerender(<KeyboardTimePicker formGenField={formGenField} formikProps={formikProps3} />);
    expect(input).toHaveValue(today.toFormat(DateTimeFormat.US_TIME_ONLY));
    expect(setFieldValue3).toHaveBeenCalledWith(formGenField.name, today.toFormat(formGenField.valueFormat));

    // 4 -> Re-Render after an external event updated the formik values
    const anHourAgo = new Date();
    anHourAgo.setHours(anHourAgo.getHours() - 1);

    const formikProps4 = mockFormikProps({ formGenField, value: anHourAgo });
    const setFieldValue4 = jest.spyOn(formikProps4, 'setFieldValue');
    rerender(<KeyboardTimePicker formGenField={formGenField} formikProps={formikProps4} />);
    expect(input).toHaveValue(DateTime.fromJSDate(anHourAgo).toFormat(DateTimeFormat.US_TIME_ONLY));
    expect(setFieldValue4).toHaveBeenCalledWith(
      formGenField.name,
      DateTime.fromJSDate(anHourAgo).toFormat(formGenField.valueFormat)
    );
  });

  it('clears the input and formik value', async () => {
    const dateTime = DateTime.now();
    const [{ getByTestId }, { formGenField, validateField }] = await renderFormGenInputAsync(
      KeyboardTimePicker,
      options({
        initialValues: { mockName: dateTime },
        setFormikProps: f => (formikProps = f),
      })
    );

    const input = getByTestId(formGenField.name).querySelector('input');

    expect(input).toHaveValue(dateTime.toFormat(DateTimeFormat.US_TIME_ONLY));
    expect(formikProps.values.mockName).toBe(dateTime.toISO());

    await actAndAwait(() => changeTextField(input, null));

    expect(input).toHaveValue('');
    expect(formikProps.values.mockName).toBeNull();
    expect(validateField).toHaveBeenCalled();
  });
});

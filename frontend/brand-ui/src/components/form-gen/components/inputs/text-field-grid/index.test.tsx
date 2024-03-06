import { changeTextField } from '@plentyag/brand-ui/src/test-helpers';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { fireEvent } from '@testing-library/react';
import * as yup from 'yup';

import { makeOptions, renderFormGenInputAsync } from '../test-helpers';

import { TextFieldGrid } from '.';

import { BlurEffects } from './hooks/use-text-field-grid-init';

const options = makeOptions({
  formGenField: {
    columns: ['C1', 'C2'],
    rows: [
      { label: 'R1', value: 'r1' },
      { label: 'R2', value: 'r2' },
    ],
  },
});
let formikProps;

function getTextField(name: string) {
  return document.querySelector<HTMLInputElement>(`input[name="${name}"]`);
}

describe('TextFieldGrid', () => {
  it('initializes the text-field grid with inputs\' value to "" and the formik value to undefined', async () => {
    const [{ container }] = await renderFormGenInputAsync(
      TextFieldGrid,
      options({ setFormikProps: f => (formikProps = f) })
    );

    expect(container.querySelectorAll('input')).toHaveLength(4);
    expect(getTextField('mockName.r1[0]')).toHaveValue('');
    expect(getTextField('mockName.r1[1]')).toHaveValue('');
    expect(getTextField('mockName.r2[0]')).toHaveValue('');
    expect(getTextField('mockName.r2[1]')).toHaveValue('');
    expect(formikProps.values.mockName).toEqual({ r1: [undefined, undefined], r2: [undefined, undefined] });
  });

  it('initializes the text-field grid with the formik value passed', async () => {
    const [{ container }] = await renderFormGenInputAsync(
      TextFieldGrid,
      options({
        initialValues: { mockName: { r1: ['1', '2'], r2: ['3', '4'] } },
        setFormikProps: f => (formikProps = f),
      })
    );

    expect(container.querySelectorAll('input')).toHaveLength(4);
    expect(getTextField('mockName.r1[0]')).toHaveValue('1');
    expect(getTextField('mockName.r1[1]')).toHaveValue('2');
    expect(getTextField('mockName.r2[0]')).toHaveValue('3');
    expect(getTextField('mockName.r2[1]')).toHaveValue('4');
    expect(formikProps.values.mockName).toEqual({ r1: ['1', '2'], r2: ['3', '4'] });
  });

  it('updates the formik values', async () => {
    await renderFormGenInputAsync(TextFieldGrid, options({ setFormikProps: f => (formikProps = f) }));

    expect(formikProps.values.mockName).toEqual({ r1: [undefined, undefined], r2: [undefined, undefined] });
    await actAndAwait(() => changeTextField(getTextField('mockName.r1[0]'), 'new-value'));
    expect(getTextField('mockName.r1[0]')).toHaveValue('new-value');
    expect(formikProps.values.mockName).toEqual({ r1: ['new-value', undefined], r2: [undefined, undefined] });
  });

  it('updates the formik values and parse based on the input type', async () => {
    await renderFormGenInputAsync(
      TextFieldGrid,
      options({ formGenField: { textFieldProps: { type: 'number' } }, setFormikProps: f => (formikProps = f) })
    );

    expect(formikProps.values.mockName).toEqual({ r1: [undefined, undefined], r2: [undefined, undefined] });
    await actAndAwait(() => changeTextField(getTextField('mockName.r1[0]'), '1.11'));
    expect(getTextField('mockName.r1[0]')).toHaveValue(1.11);
    expect(formikProps.values.mockName).toEqual({ r1: [1.11, undefined], r2: [undefined, undefined] });
  });

  it('does not decorate the label with "*" when not required with yup', async () => {
    const [{ getByTestId }, { formGenField }] = await renderFormGenInputAsync(TextFieldGrid, options());
    const label = getByTestId(formGenField.name).querySelector('label');

    expect(label).not.toHaveTextContent(`${formGenField.label} *`);
  });

  it('decorates the label with "*" when required with yup', async () => {
    const [{ getByTestId }, { formGenField }] = await renderFormGenInputAsync(
      TextFieldGrid,
      options({ formGenField: { validate: yup.mixed().required() } })
    );
    const label = getByTestId(formGenField.name).querySelector('label');

    expect(label).toHaveTextContent(`${formGenField.label} *`);
  });

  it('shows an error', async () => {
    const [{ getByTestId }, { formGenField }] = await renderFormGenInputAsync(
      TextFieldGrid,
      options({
        initialValues: { mockName: null },
        formGenField: {
          validate: yup
            .mixed()
            .required()
            .test('automatic-failure', 'mockName is a required field', () => false),
        },
        setFormikProps: f => (formikProps = f),
      })
    );
    const label = getByTestId(formGenField.name).querySelector('label');

    await actAndAwait(() => formikProps.validateField(formGenField.name));

    const helperText = getByTestId(formGenField.name).querySelector('p.MuiFormHelperText-root');

    expect(label).toHaveClass('MuiFormLabel-root');
    expect(helperText).toHaveClass('Mui-error');
    expect(helperText).toHaveTextContent('mockName is a required field');
  });

  it('uses the blurEffect leadingZeroTrailingOneDecimal', async () => {
    await renderFormGenInputAsync(
      TextFieldGrid,
      options({
        formGenField: { blurEffect: BlurEffects.leadingZeroTrailingOneDecimal, textFieldProps: { type: 'number' } },
        setFormikProps: f => (formikProps = f),
      })
    );

    expect(formikProps.values.mockName).toEqual({ r1: [undefined, undefined], r2: [undefined, undefined] });
    await actAndAwait(() => changeTextField(getTextField('mockName.r1[0]'), '1'));
    await actAndAwait(() => fireEvent.blur(getTextField('mockName.r1[0]')));
    expect(getTextField('mockName.r1[0]').value).toBe('01.0'); // do no use toHaveValue as we want the raw value of the input
    expect(formikProps.values.mockName).toEqual({ r1: [1, undefined], r2: [undefined, undefined] });
  });

  it('provides regular tabbing', async () => {
    await renderFormGenInputAsync(TextFieldGrid, options());

    await actAndAwait(() => fireEvent.keyDown(getTextField('mockName.r1[0]'), { key: 'Tab', code: 'Tab' }));

    expect(getTextField('mockName.r2[0]')).not.toHaveFocus();
  });

  it('supports tabbing vertically first', async () => {
    await renderFormGenInputAsync(TextFieldGrid, options({ formGenField: { tabbing: 'vertical' } }));

    await actAndAwait(() => fireEvent.keyDown(getTextField('mockName.r1[0]'), { key: 'Tab', code: 'Tab' }));

    expect(getTextField('mockName.r2[0]')).toHaveFocus();
  });
});

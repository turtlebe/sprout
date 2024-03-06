import { changeTextField, chooseFromAutocompleteByIndex, openAutocomplete } from '@plentyag/brand-ui/src/test-helpers';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { fireEvent, render } from '@testing-library/react';
import * as yup from 'yup';

import { makeOptions, mockFormikProps, renderFormGenInput, renderFormGenInputAsync } from '../test-helpers';

import { Autocomplete } from '.';

const options = makeOptions({ formGenField: { options: ['A', 'B', 'C'] } });

function getAutocompleteTextInput(element: Element) {
  return element.querySelector('.MuiInputBase-input');
}

describe('Autocomplete', () => {
  it('validates on blur', async () => {
    const [{ getByTestId }, { formGenField, validateField }] = renderFormGenInput(Autocomplete, options());

    const input = getByTestId(formGenField.name).querySelector('input');
    const label = getByTestId(formGenField.name).querySelector('label');

    expect(label).toHaveTextContent(formGenField.label);
    expect(input).toHaveAttribute('id', formGenField.name);
    expect(input).toHaveAttribute('name', formGenField.name);

    await actAndAwait(() => fireEvent.blur(input));

    expect(validateField).toHaveBeenCalled();
  });

  it('supports passing an array of label/value', async () => {
    let formikProps;
    const [{ getByTestId }, { formGenField, validateField }] = await renderFormGenInputAsync(
      Autocomplete,
      options({
        initialValues: { mockName: 'a' },
        formGenField: {
          options: [
            { label: 'A', value: 'a' },
            { label: 'B', value: 'b' },
            { label: 'C', value: 'c' },
          ],
        },
        setFormikProps: f => (formikProps = f),
      })
    );

    const setFieldValue = jest.spyOn(formikProps, 'setFieldValue');
    const input = getByTestId(formGenField.name).querySelector('input');
    const label = getByTestId(formGenField.name).querySelector('label');

    expect(label).toHaveTextContent(formGenField.label);
    expect(input).toHaveAttribute('id', formGenField.name);
    expect(input).toHaveAttribute('name', formGenField.name);
    expect(input).toHaveValue('A');

    await actAndAwait(() => openAutocomplete(input));
    await actAndAwait(() => chooseFromAutocompleteByIndex(1));

    expect(input).toHaveValue('B');

    expect(validateField).toHaveBeenCalled();
    expect(setFieldValue).toHaveBeenCalledWith(formGenField.name, 'b');
  });

  it('validates on change new', async () => {
    const [{ getByTestId }, { formGenField, validateField }] = renderFormGenInput(
      Autocomplete,
      options({ initialValues: { mockName: 'A' } })
    );

    const input = getByTestId(formGenField.name).querySelector('input');
    const label = getByTestId(formGenField.name).querySelector('label');

    expect(label).toHaveTextContent(formGenField.label);
    expect(input).toHaveAttribute('id', formGenField.name);
    expect(input).toHaveAttribute('name', formGenField.name);
    expect(input).toHaveValue('A');

    await actAndAwait(() => openAutocomplete(input));
    await actAndAwait(() => chooseFromAutocompleteByIndex(1));

    expect(input).toHaveValue('B');

    expect(validateField).toHaveBeenCalled();
  });

  it('decorates the label with "*" when required with yup', async () => {
    const [{ getByTestId }, { formGenField }] = await renderFormGenInputAsync(
      Autocomplete,
      options({ formGenField: { validate: yup.mixed().required() } })
    );

    const label = getByTestId(formGenField.name).querySelector('label');

    expect(label).toHaveTextContent(`${formGenField.label} *`);
  });

  it('supports MUI TextField props', async () => {
    const [{ getByTestId }, { formGenField }] = await renderFormGenInputAsync(
      Autocomplete,
      options({ formGenField: { autocompleteProps: { disabled: true } } })
    );

    const input = getByTestId(formGenField.name).querySelector('input');
    expect(input).toHaveAttribute('disabled');
  });

  it('updates selected value when value changes', () => {
    const formGenField: FormGen.FieldAutocomplete = {
      type: 'Autocomplete',
      name: 'test-field',
      options: ['A', 'B', 'C'],
    };

    const { rerender, baseElement } = render(
      <Autocomplete formGenField={formGenField} formikProps={mockFormikProps({ formGenField, value: 'A' })} />
    );

    expect(getAutocompleteTextInput(baseElement)).toHaveValue('A');

    rerender(<Autocomplete formGenField={formGenField} formikProps={mockFormikProps({ formGenField, value: 'C' })} />);

    expect(getAutocompleteTextInput(baseElement)).toHaveValue('C');

    rerender(<Autocomplete formGenField={formGenField} formikProps={mockFormikProps({ formGenField, value: 'D' })} />);

    // D should not get rendered because it is not a valid option
    expect(getAutocompleteTextInput(baseElement)).toHaveValue('');
  });

  it('sets the formik value to null when the options changes and the selected option is no longer available', () => {
    const formGenField1: FormGen.FieldAutocomplete = {
      type: 'Autocomplete',
      name: 'test-field',
      options: ['A', 'B', 'C'],
    };
    const formikProps1 = mockFormikProps({ formGenField: formGenField1, value: 'A' });

    const { rerender, baseElement } = render(<Autocomplete formGenField={formGenField1} formikProps={formikProps1} />);

    expect(getAutocompleteTextInput(baseElement)).toHaveValue('A');
    expect(formikProps1.setFieldValue).toHaveBeenCalledTimes(0);

    const formGenField2: FormGen.FieldAutocomplete = {
      type: 'Autocomplete',
      name: 'test-field',
      options: ['D', 'E', 'F'],
    };
    const formikProps2 = mockFormikProps({ formGenField: formGenField2, value: 'A' });

    rerender(<Autocomplete formGenField={formGenField2} formikProps={formikProps2} />);

    expect(getAutocompleteTextInput(baseElement)).toHaveValue('');
    expect(formikProps2.setFieldValue).toHaveBeenCalledTimes(1);
    expect(formikProps2.setFieldValue).toHaveBeenCalledWith('test-field', null);
  });

  it('does not set the formik value to null when the options area loading and the selected option is not available', () => {
    const formGenField1: FormGen.FieldAutocomplete = {
      type: 'Autocomplete',
      name: 'test-field',
      options: [],
      autocompleteProps: { loading: true },
    };
    const formikProps1 = mockFormikProps({ formGenField: formGenField1, value: 'A' });

    const { baseElement } = render(<Autocomplete formGenField={formGenField1} formikProps={formikProps1} />);

    expect(getAutocompleteTextInput(baseElement)).toHaveValue('');
    expect(formikProps1.setFieldValue).toHaveBeenCalledTimes(0);
  });

  it('supports free solo initial values', async () => {
    const options = makeOptions({
      initialValues: { 'test-field': 'D' },
      formGenField: {
        options: ['A', 'B'],
        name: 'test-field',
        autocompleteProps: { freeSolo: true },
      },
    });

    let formikProps;
    const [{ baseElement }, { formGenField }] = await renderFormGenInputAsync(
      Autocomplete,
      options({ setFormikProps: f => (formikProps = f) })
    );

    expect(formikProps.values[formGenField.name]).toEqual('D');
    expect(getAutocompleteTextInput(baseElement)).toHaveValue('D');
  });

  it('supports custom input values in free solo mode', async () => {
    const options = makeOptions({
      initialValues: { 'test-field': 'A' },
      formGenField: {
        options: ['A', 'B'],
        name: 'test-field',
        autocompleteProps: { freeSolo: true },
      },
    });

    let formikProps;
    const [{ getByTestId, baseElement }, { formGenField }] = await renderFormGenInputAsync(
      Autocomplete,
      options({ setFormikProps: f => (formikProps = f) })
    );

    // custom input: 'XYZ'
    const input = getByTestId(formGenField.name).querySelector('input');
    changeTextField(input, 'XYZ');

    // 'XYZ' should be the only option
    await actAndAwait(() => chooseFromAutocompleteByIndex(0));

    expect(formikProps.values[formGenField.name]).toEqual('XYZ');
    expect(getAutocompleteTextInput(baseElement)).toHaveValue('XYZ');
  });

  it('supports custom input in free solo when label/value are provided as options', async () => {
    const options = makeOptions({
      initialValues: { 'test-field': 'aaa' },
      formGenField: {
        options: [
          { label: 'A', value: 'aaa' },
          { label: 'B', value: 'bbb' },
        ],
        name: 'test-field',
        autocompleteProps: { freeSolo: true },
      },
    });

    let formikProps;
    const [{ getByTestId, baseElement }, { formGenField }] = await renderFormGenInputAsync(
      Autocomplete,
      options({ setFormikProps: f => (formikProps = f) })
    );

    // ensure free solo does not break existing label/value input.
    changeTextField(getByTestId(formGenField.name).querySelector('input'), 'B');

    // 'B' should be the only option
    await actAndAwait(() => chooseFromAutocompleteByIndex(0));

    expect(formikProps.values[formGenField.name]).toEqual('bbb');
    expect(getAutocompleteTextInput(baseElement)).toHaveValue('B');

    // custom input: 'XYZ'
    changeTextField(getByTestId(formGenField.name).querySelector('input'), 'XYZ');

    // 'XYZ' should be the only option
    await actAndAwait(() => chooseFromAutocompleteByIndex(0));

    expect(formikProps.values[formGenField.name]).toEqual('XYZ');
    expect(getAutocompleteTextInput(baseElement)).toHaveValue('XYZ');
  });
});

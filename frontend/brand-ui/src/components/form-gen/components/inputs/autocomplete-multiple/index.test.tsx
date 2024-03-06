import { changeTextField, chooseFromAutocompleteByIndex, openAutocomplete } from '@plentyag/brand-ui/src/test-helpers';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { render } from '@testing-library/react';
import * as yup from 'yup';

import { makeOptions, mockFormikProps, renderFormGenInput, renderFormGenInputAsync } from '../test-helpers';

import { AutocompleteMultiple } from '.';

const options = makeOptions({
  formGenField: {
    options: ['A', 'B', 'C'],
    getChipLabel: (item: string) => item,
  },
});

describe('AutocompleteMultiple', () => {
  it('validates on change', async () => {
    let formikProps;
    const [{ getByTestId }, { formGenField }] = await renderFormGenInputAsync(
      AutocompleteMultiple,
      options({ setFormikProps: f => (formikProps = f) })
    );

    const input = getByTestId(formGenField.name).querySelector('input');

    expect(formikProps.values[formGenField.name]).toBe(undefined);

    await actAndAwait(() => openAutocomplete(input));
    await actAndAwait(() => chooseFromAutocompleteByIndex(0));

    expect(formikProps.values[formGenField.name]).toEqual(['A']);

    await actAndAwait(() => openAutocomplete(input));
    await actAndAwait(() => chooseFromAutocompleteByIndex(1));

    expect(formikProps.values[formGenField.name]).toEqual(['A', 'B']);
  });

  it('supports passing an array of label/value', async () => {
    let formikProps;
    const [{ getByTestId }, { formGenField }] = renderFormGenInput(
      AutocompleteMultiple,
      options({
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

    const input = getByTestId(formGenField.name).querySelector('input');

    expect(formikProps.values[formGenField.name]).toBe(undefined);

    await actAndAwait(() => openAutocomplete(input));
    await actAndAwait(() => chooseFromAutocompleteByIndex(0));

    expect(formikProps.values[formGenField.name]).toEqual(['a']);

    await actAndAwait(() => openAutocomplete(input));
    await actAndAwait(() => chooseFromAutocompleteByIndex(1));

    expect(formikProps.values[formGenField.name]).toEqual(['a', 'b']);
  });

  it('decorates the label with "*" when required with yup', async () => {
    const [{ getByTestId }, { formGenField }] = await renderFormGenInputAsync(
      AutocompleteMultiple,
      options({ formGenField: { validate: yup.mixed().required() } })
    );

    const label = getByTestId(formGenField.name).querySelector('label');

    expect(label).toHaveTextContent(`${formGenField.label} *`);
  });

  it('supports MUI TextField props', async () => {
    const [{ getByTestId }, { formGenField }] = await renderFormGenInputAsync(
      AutocompleteMultiple,
      options({ formGenField: { autocompleteProps: { disabled: true } } })
    );

    const input = getByTestId(formGenField.name).querySelector('input');

    expect(input).toHaveAttribute('disabled');
  });

  it('updates selected options when array of values change', () => {
    const formGenField: FormGen.FieldAutocompleteMultiple = {
      type: 'AutocompleteMultiple',
      name: 'test-field',
      options: ['A', 'B', 'C'],
    };

    const { rerender, baseElement } = render(
      <AutocompleteMultiple
        formGenField={formGenField}
        formikProps={mockFormikProps({ formGenField, value: ['A', 'B'] })}
      />
    );

    const renderedChips = baseElement.querySelectorAll('span.MuiChip-label');

    expect(renderedChips).toHaveLength(2);
    expect(renderedChips[0]).toHaveTextContent('A');
    expect(renderedChips[1]).toHaveTextContent('B');

    rerender(
      <AutocompleteMultiple
        formGenField={formGenField}
        formikProps={mockFormikProps({ formGenField, value: ['A', 'C'] })}
      />
    );

    expect(renderedChips).toHaveLength(2);
    expect(renderedChips[0]).toHaveTextContent('A');
    expect(renderedChips[1]).toHaveTextContent('C');

    rerender(
      <AutocompleteMultiple
        formGenField={formGenField}
        formikProps={mockFormikProps({ formGenField, value: ['A', 'D'] })}
      />
    );

    // D should not get rendered because it is not a valid option
    expect(baseElement.querySelectorAll('span.MuiChip-label')).toHaveLength(1);
    expect(renderedChips[0]).toHaveTextContent('A');
  });

  it('supports free solo initial value', async () => {
    const options = makeOptions({
      formGenField: {
        options: ['A', 'B', 'C'],
        getChipLabel: (item: string) => item,
        name: 'test-field',
        autocompleteProps: { freeSolo: true },
      },
      initialValues: {
        'test-field': ['A', 'D'], // D is free solo value.
      },
    });

    let formikProps;
    const [{ baseElement }, { formGenField }] = await renderFormGenInputAsync(
      AutocompleteMultiple,
      options({ setFormikProps: f => (formikProps = f) })
    );

    expect(formikProps.values[formGenField.name]).toEqual(['A', 'D']);

    const renderedChips = baseElement.querySelectorAll('span.MuiChip-label');

    // 'D' get rendered because we are in "free solo" mode.
    expect(renderedChips).toHaveLength(2);
    expect(renderedChips[0]).toHaveTextContent('A');
    expect(renderedChips[1]).toHaveTextContent('D');
  });

  it('supports custom input values in free solo mode', async () => {
    const options = makeOptions({
      formGenField: {
        options: ['A', 'B', 'C'],
        getChipLabel: (item: string) => item,
        name: 'test-field',
        autocompleteProps: { freeSolo: true },
      },
      initialValues: {
        'test-field': ['A', 'D'],
      },
    });

    let formikProps;
    const [{ getByTestId, baseElement }, { formGenField }] = await renderFormGenInputAsync(
      AutocompleteMultiple,
      options({ setFormikProps: f => (formikProps = f) })
    );

    // custom input: 'XYZ'
    const input = getByTestId(formGenField.name).querySelector('input');
    changeTextField(input, 'XYZ');

    // 'XYZ' should be the only option
    await actAndAwait(() => chooseFromAutocompleteByIndex(0));

    expect(formikProps.values[formGenField.name]).toEqual(['A', 'D', 'XYZ']);

    const renderedChips = baseElement.querySelectorAll('span.MuiChip-label');
    expect(renderedChips).toHaveLength(3);
    expect(renderedChips[0]).toHaveTextContent('A');
    expect(renderedChips[1]).toHaveTextContent('D');
    expect(renderedChips[2]).toHaveTextContent('XYZ');
  });

  it('supports custom input in free solo when label/value are provided as options', async () => {
    const options = makeOptions({
      formGenField: {
        options: [
          { label: 'A', value: 'aaa' },
          { label: 'B', value: 'bbb' },
        ],
        getChipLabel: (item: string) => item,
        name: 'test-field',
        autocompleteProps: { freeSolo: true },
      },
      initialValues: {
        'test-field': ['aaa', 'bbb'],
      },
    });

    let formikProps;
    const [{ getByTestId, baseElement }, { formGenField }] = await renderFormGenInputAsync(
      AutocompleteMultiple,
      options({ setFormikProps: f => (formikProps = f) })
    );

    // custom input: 'XYZ', free solo input the value and label will be: 'XYZ'
    const input = getByTestId(formGenField.name).querySelector('input');
    changeTextField(input, 'XYZ');

    // 'XYZ' should be the only option
    await actAndAwait(() => chooseFromAutocompleteByIndex(0));

    expect(formikProps.values[formGenField.name]).toEqual(['aaa', 'bbb', 'XYZ']);

    const renderedChips = baseElement.querySelectorAll('span.MuiChip-label');
    expect(renderedChips).toHaveLength(3);
    expect(renderedChips[0]).toHaveTextContent('A');
    expect(renderedChips[1]).toHaveTextContent('B');
    expect(renderedChips[2]).toHaveTextContent('XYZ');
  });
});

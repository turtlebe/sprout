import { chooseFromSelectByIndex, openSelect } from '@plentyag/brand-ui/src/test-helpers';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { fireEvent } from '@testing-library/react';
import * as yup from 'yup';

import { makeOptions, renderFormGenInput } from '../test-helpers';

import { Select } from '.';

const options = makeOptions({
  formGenField: {
    options: ['A', 'B', 'C'],
  },
});

describe('Select', () => {
  it('validates on blur', async () => {
    const [{ getByTestId }, { formGenField, validateField }] = renderFormGenInput(Select, options());

    const input = getByTestId(formGenField.name).querySelector('input');
    const select = getByTestId(formGenField.name).querySelector(`div#${formGenField.name}`);
    const label = getByTestId(formGenField.name).querySelector('label');

    expect(select).toBeInTheDocument();
    expect(label).toHaveTextContent(formGenField.label);
    expect(input).not.toHaveAttribute('id');
    expect(input).toHaveAttribute('name', formGenField.name);

    await actAndAwait(() => fireEvent.blur(select));

    expect(validateField).toHaveBeenCalled();
  });

  it('validates on change', async () => {
    const [{ getByTestId }, { formGenField, validateField }] = renderFormGenInput(
      Select,
      options({ initialValues: { mockName: 'A' } })
    );

    const input = getByTestId(formGenField.name).querySelector('input');
    const select = getByTestId(formGenField.name).querySelector(`div#${formGenField.name}`);

    expect(select).toBeInTheDocument();
    expect(input).not.toHaveAttribute('id');
    expect(input).toHaveAttribute('name', formGenField.name);
    expect(input).toHaveValue('A');

    await actAndAwait(() => openSelect(formGenField.name));
    await actAndAwait(() => chooseFromSelectByIndex(1));

    expect(input).toHaveValue('B');

    expect(validateField).toHaveBeenCalled();
  });

  it('supports passing an array of label/value', async () => {
    const options = makeOptions({
      formGenField: {
        options: [
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b' },
          { label: 'C', value: 'c' },
        ],
      },
    });

    const [{ getByTestId }, { formGenField, validateField }] = renderFormGenInput(
      Select,
      options({ initialValues: { mockName: 'a' } })
    );

    const input = getByTestId(formGenField.name).querySelector('input');
    const select = getByTestId(formGenField.name).querySelector(`div#${formGenField.name}`);

    expect(select).toBeInTheDocument();
    expect(input).not.toHaveAttribute('id');
    expect(input).toHaveAttribute('name', formGenField.name);
    expect(input).toHaveValue('a');

    await actAndAwait(() => openSelect(formGenField.name));
    await actAndAwait(() => chooseFromSelectByIndex(1));

    expect(input).toHaveValue('b');

    expect(validateField).toHaveBeenCalled();
  });

  it('decorates the label with "*" when required with yup', () => {
    const [{ getByTestId }, { formGenField }] = renderFormGenInput(
      Select,
      options({ formGenField: { validate: yup.mixed().required() } })
    );

    const label = getByTestId(formGenField.name).querySelector('label');

    expect(label).toHaveTextContent(`${formGenField.label} *`);
  });
});

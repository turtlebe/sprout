import HelpIcon from '@material-ui/icons/Help';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { fireEvent } from '@testing-library/react';
import React from 'react';
import * as yup from 'yup';

import { makeOptions, renderFormGenInput } from '../test-helpers';

import { Checkbox } from '.';

const options = makeOptions({});

describe('Checkbox', () => {
  it('validates on blur', async () => {
    const [{ getByTestId }, { formGenField, validateField }] = renderFormGenInput(Checkbox);

    const input = getByTestId(formGenField.name).querySelector('input');
    const label = getByTestId(formGenField.name).querySelector('label');

    expect(label).toHaveTextContent(formGenField.label);
    expect(input).not.toBeChecked();
    expect(input).toHaveAttribute('id', formGenField.name);
    expect(input).toHaveAttribute('name', formGenField.name);

    await actAndAwait(() => fireEvent.blur(input));

    expect(validateField).toHaveBeenCalled();
  });

  it('validates on change', async () => {
    const [{ getByTestId }, { formGenField, validateField }] = renderFormGenInput(
      Checkbox,
      options({ initialValues: { mockName: true } })
    );

    const input = getByTestId(formGenField.name).querySelector('input');

    expect(input).toBeChecked();
    expect(input).toHaveAttribute('id', formGenField.name);
    expect(input).toHaveAttribute('name', formGenField.name);

    await actAndAwait(() => input.click());

    expect(input).not.toBeChecked();
    expect(validateField).toHaveBeenCalled();
  });

  it('does not decorate the label with "*" when not required with yup', () => {
    const [{ getByTestId }, { formGenField }] = renderFormGenInput(Checkbox, options());

    const label = getByTestId(formGenField.name).querySelector('label');

    expect(label).not.toHaveTextContent(`${formGenField.label} *`);
  });

  it('decorates the label with "*" when required with yup', () => {
    const [{ getByTestId }, { formGenField }] = renderFormGenInput(
      Checkbox,
      options({ formGenField: { validate: yup.mixed().required() } })
    );

    const label = getByTestId(formGenField.name).querySelector('label');

    expect(label).toHaveTextContent(`${formGenField.label} *`);
  });

  it('supports MUI Checkbox props', () => {
    const [{ getByTestId }] = renderFormGenInput(
      Checkbox,
      options({ formGenField: { checkboxProps: { icon: <HelpIcon data-testid="help-icon" /> } } })
    );

    expect(getByTestId('help-icon')).toBeInTheDocument();
  });
});

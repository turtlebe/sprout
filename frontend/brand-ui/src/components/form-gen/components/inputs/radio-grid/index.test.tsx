import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { fireEvent } from '@testing-library/react';
import { map } from 'lodash';
import * as yup from 'yup';

import { makeOptions, renderFormGenInput } from '../test-helpers';

import { CHECK_ALL, RadioGrid } from '.';

let formikProps;

const options = makeOptions({
  formGenField: {
    columns: ['C1', 'C2'],
    rows: [
      { label: 'R1', value: 'on' },
      { label: 'R2', value: 'off' },
    ],
  },
});

describe('RadioGrid', () => {
  it('initializes the radio grid to false', () => {
    const [{ container }] = renderFormGenInput(RadioGrid, options());

    expect(container.querySelectorAll('input')).toHaveLength(6); // 2 cols * 2 rows + 2 check all
    expect(map(container.querySelectorAll<HTMLInputElement>('input'), input => input.checked)).toEqual([
      false,
      false,
      false,
      false,
      false,
      false,
    ]);
  });

  it('initializes the radio grid to the passed prop', () => {
    const [{ container }] = renderFormGenInput(RadioGrid, options({ initialValues: { mockName: ['on', 'off'] } }));

    expect(container.querySelectorAll('input')).toHaveLength(6); // 2 cols * 2 rows + 2 check all
    expect(map(container.querySelectorAll<HTMLInputElement>('input'), input => input.checked)).toEqual([
      true,
      false,
      false,
      false,
      true,
      false,
    ]);
  });

  it('updates the formik values', async () => {
    const [{ container }] = renderFormGenInput(RadioGrid, options({ setFormikProps: f => (formikProps = f) }));
    const radioC1On = container.querySelectorAll<HTMLInputElement>('input[name="mockName[0]"]')[0];
    const radioC1Off = container.querySelectorAll<HTMLInputElement>('input[name="mockName[0]"]')[1];
    const radioC2On = container.querySelectorAll<HTMLInputElement>('input[name="mockName[1]"]')[0];
    const radioC2Off = container.querySelectorAll<HTMLInputElement>('input[name="mockName[1]"]')[1];
    const radioAllOn = container.querySelectorAll<HTMLInputElement>(`input[name="mockName.${CHECK_ALL}"]`)[0];
    const radioAllOff = container.querySelectorAll<HTMLInputElement>(`input[name="mockName.${CHECK_ALL}"]`)[1];

    await actAndAwait(() => fireEvent.click(radioC1On));

    expect(radioC1On).toBeChecked();
    expect(radioC1Off).not.toBeChecked();
    expect(radioAllOn).not.toBeChecked();
    expect(radioAllOff).not.toBeChecked();
    expect(formikProps.values).toEqual({ mockName: ['on'] });

    await actAndAwait(() => fireEvent.click(radioC1Off));

    expect(radioC1On).not.toBeChecked();
    expect(radioC1Off).toBeChecked();
    expect(formikProps.values).toEqual({ mockName: ['off'] });

    await actAndAwait(() => fireEvent.click(radioC2On));

    expect(radioC2On).toBeChecked();
    expect(radioC2Off).not.toBeChecked();
    expect(formikProps.values).toEqual({ mockName: ['off', 'on'] });

    await actAndAwait(() => fireEvent.click(radioC2Off));

    expect(radioC2On).not.toBeChecked();
    expect(radioC2Off).toBeChecked();
    expect(formikProps.values).toEqual({ mockName: ['off', 'off'] });
  });

  it('does not decorate the label with "*" when not required with yup', () => {
    const [{ getByTestId }, { formGenField }] = renderFormGenInput(RadioGrid, options());
    const label = getByTestId(formGenField.name).querySelector('label');

    expect(label).not.toHaveTextContent(`${formGenField.label} *`);
  });

  it('decorates the label with "*" when required with yup', () => {
    const [{ getByTestId }, { formGenField }] = renderFormGenInput(
      RadioGrid,
      options({ formGenField: { validate: yup.mixed().required() } })
    );
    const label = getByTestId(formGenField.name).querySelector('label');

    expect(label).toHaveTextContent(`${formGenField.label} *`);
  });

  it('shows an error', async () => {
    const [{ getByTestId }, { formGenField }] = renderFormGenInput(
      RadioGrid,
      options({
        formGenField: { validate: yup.mixed().required() },
        setFormikProps: f => (formikProps = f),
      })
    );
    const label = getByTestId(formGenField.name).querySelector('label');

    await actAndAwait(() => formikProps.validateField(formGenField.name));

    const helperText = getByTestId(formGenField.name).querySelector('p.MuiFormHelperText-root');

    expect(label).toHaveClass('Mui-error');
    expect(helperText).toHaveClass('Mui-error');
    expect(helperText).toHaveTextContent('mockName is a required field');
  });

  it('provides a checkAll column', async () => {
    const [{ container }] = renderFormGenInput(
      RadioGrid,
      options({ initialValues: { mockName: ['on', 'on'] }, setFormikProps: f => (formikProps = f) })
    );
    const radioC1On = container.querySelectorAll<HTMLInputElement>('input[name="mockName[0]"]')[0];
    const radioC1Off = container.querySelectorAll<HTMLInputElement>('input[name="mockName[0]"]')[1];
    const radioC2On = container.querySelectorAll<HTMLInputElement>('input[name="mockName[1]"]')[0];
    const radioC2Off = container.querySelectorAll<HTMLInputElement>('input[name="mockName[1]"]')[1];
    const radioAllOn = container.querySelectorAll<HTMLInputElement>(`input[name="mockName.${CHECK_ALL}"]`)[0];
    const radioAllOff = container.querySelectorAll<HTMLInputElement>(`input[name="mockName.${CHECK_ALL}"]`)[1];

    expect(radioC1On).toBeChecked();
    expect(radioC2On).toBeChecked();
    expect(radioAllOn).toBeChecked();

    await actAndAwait(() => fireEvent.click(radioC1Off));

    // unchecking one "ON" should uncheck the check-all
    expect(radioAllOn).not.toBeChecked();

    await actAndAwait(() => fireEvent.click(radioAllOff));

    expect(radioC1On).not.toBeChecked();
    expect(radioC2On).not.toBeChecked();
    expect(radioAllOn).not.toBeChecked();
    expect(radioC1Off).toBeChecked();
    expect(radioC2Off).toBeChecked();
    expect(radioAllOff).toBeChecked();
    expect(formikProps.values).toEqual({ mockName: ['off', 'off'] });
  });
});

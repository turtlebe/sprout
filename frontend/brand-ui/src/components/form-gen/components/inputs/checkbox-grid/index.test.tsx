import { actAndAwait, actAndAwaitRender } from '@plentyag/core/src/test-helpers';
import { fireEvent } from '@testing-library/react';
import { map } from 'lodash';
import * as yup from 'yup';

import { makeOptions, mockFormikProps, renderFormGenInputAsync } from '../test-helpers';

import { CHECK_ALL, CheckboxGrid } from '.';

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

function getCheckbox(name: string) {
  return document.querySelector<HTMLInputElement>(`input[name="${name}"]`);
}

describe('CheckboxGrid', () => {
  it('initializes the checkbox grid to false', async () => {
    const [{ container }] = await renderFormGenInputAsync(
      CheckboxGrid,
      options({ setFormikProps: f => (formikProps = f) })
    );

    expect(container.querySelectorAll('input')).toHaveLength(6); // 2 columns + 1 check-all columns * 2 rows
    expect(map(container.querySelectorAll<HTMLInputElement>('input'), input => input.checked)).toEqual([
      false,
      false,
      false,
      false,
      false,
      false,
    ]);
    expect(formikProps.values.mockName).toEqual({ r1: [false, false], r2: [false, false] });
  });

  it('initializes the formik props to false', async () => {
    await renderFormGenInputAsync(CheckboxGrid, options({ setFormikProps: f => (formikProps = f) }));

    expect(formikProps.values.mockName).toEqual({ r1: [false, false], r2: [false, false] });
  });

  it('initializes the checkbox grid to the formik value passed', async () => {
    const [{ container }] = await renderFormGenInputAsync(
      CheckboxGrid,
      options({
        initialValues: { mockName: { r1: [false, true], r2: [true, false] } },
        setFormikProps: f => (formikProps = f),
      })
    );

    expect(container.querySelectorAll('input')).toHaveLength(6); // 2 columns + 1 check-all columns * 2 rows
    expect(getCheckbox('mockName.r1[0]')).not.toBeChecked();
    expect(getCheckbox('mockName.r1[1]')).toBeChecked();
    expect(getCheckbox('mockName.r2[0]')).toBeChecked();
    expect(getCheckbox('mockName.r2[1]')).not.toBeChecked();
    expect(formikProps.values.mockName).toEqual({ r1: [false, true], r2: [true, false] });
  });

  it('initializes the checkbox grid when formik values are turned to undefined', async () => {
    const registerField = jest.fn();
    const unregisterField = jest.fn();
    const setFieldValue = jest.fn();
    const getFieldProps = jest.fn();

    const formGenField: FormGen.FieldCheckboxGrid = {
      name: 'mockName',
      type: 'CheckboxGrid',
      columns: ['C1', 'C2'],
      rows: [
        { label: 'R1', value: 'r1' },
        { label: 'R2', value: 'r2' },
      ],
    };

    const formikProps = mockFormikProps({
      formGenField,
      value: { r1: [false, true], r2: [true, false] },
      registerField,
      unregisterField,
      setFieldValue,
      getFieldProps,
    });

    const { container, rerender } = await actAndAwaitRender(
      <CheckboxGrid formGenField={formGenField} formikProps={formikProps} />
    );

    expect(container.querySelectorAll('input')).toHaveLength(6); // 2 columns + 1 check-all columns * 2 rows
    expect(getCheckbox('mockName.r1[0]')).not.toBeChecked();
    expect(getCheckbox('mockName.r1[1]')).toBeChecked();
    expect(getCheckbox('mockName.r2[0]')).toBeChecked();
    expect(getCheckbox('mockName.r2[1]')).not.toBeChecked();
    expect(registerField).toHaveBeenCalledWith('mockName', {});

    rerender(
      <CheckboxGrid formGenField={formGenField} formikProps={{ ...formikProps, values: { mockName: undefined } }} />
    );

    expect(container.querySelectorAll('input')).toHaveLength(6); // 2 columns + 1 check-all columns * 2 rows
    expect(getCheckbox('mockName.r1[0]')).not.toBeChecked();
    expect(getCheckbox('mockName.r1[1]')).not.toBeChecked();
    expect(getCheckbox('mockName.r2[0]')).not.toBeChecked();
    expect(getCheckbox('mockName.r2[1]')).not.toBeChecked();
    expect(setFieldValue).toHaveBeenCalledWith('mockName', { r1: [false, false], r2: [false, false] });
  });

  it('initializes the checkbox grid to the formik value passed (with null)', async () => {
    await renderFormGenInputAsync(
      CheckboxGrid,
      options({ initialValues: { mockName: { r1: null, r2: [false, false] } }, setFormikProps: f => (formikProps = f) })
    );
    const checkbox = getCheckbox('mockName.r1[0]');

    expect(checkbox).not.toBeChecked();
    expect(formikProps.values.mockName).toEqual({ r1: null, r2: [false, false] });

    await actAndAwait(() => fireEvent.click(checkbox));

    expect(checkbox).toBeChecked();
    expect(formikProps.values).toEqual({ mockName: { r1: [true, false], r2: [false, false] } });
  });

  it('updates the formik values', async () => {
    await renderFormGenInputAsync(CheckboxGrid, options({ setFormikProps: f => (formikProps = f) }));
    const checkbox = getCheckbox('mockName.r1[0]');

    await actAndAwait(() => fireEvent.click(checkbox));

    expect(checkbox).toBeChecked();
    expect(formikProps.values).toEqual({ mockName: { r1: [true, false], r2: [false, false] } });

    await actAndAwait(() => fireEvent.click(checkbox));

    expect(checkbox).not.toBeChecked();
    expect(formikProps.values).toEqual({ mockName: { r1: [false, false], r2: [false, false] } });
  });

  it('does not decorate the label with "*" when not required with yup', async () => {
    const [{ getByTestId }, { formGenField }] = await renderFormGenInputAsync(CheckboxGrid, options());
    const label = getByTestId(formGenField.name).querySelector('label');

    expect(label).not.toHaveTextContent(`${formGenField.label} *`);
  });

  it('decorates the label with "*" when required with yup', async () => {
    const [{ getByTestId }, { formGenField }] = await renderFormGenInputAsync(
      CheckboxGrid,
      options({ formGenField: { validate: yup.mixed().required() } })
    );
    const label = getByTestId(formGenField.name).querySelector('label');

    expect(label).toHaveTextContent(`${formGenField.label} *`);
  });

  it('shows an error', async () => {
    const [{ getByTestId }, { formGenField }] = await renderFormGenInputAsync(
      CheckboxGrid,
      options({
        initialValues: { mockName: null },
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
    const [{ container }] = await renderFormGenInputAsync(
      CheckboxGrid,
      options({
        initialValues: { mockName: { r1: [true, true], r2: [false, false] } },
        setFormikProps: f => (formikProps = f),
      })
    );

    expect(container.querySelectorAll('input')).toHaveLength(6); // 2 columns + 1 check-all columns * 2 rows
    expect(getCheckbox('mockName.r1[0]')).toBeChecked();
    expect(getCheckbox('mockName.r1[1]')).toBeChecked();
    expect(getCheckbox(`mockName.r1.${CHECK_ALL}`)).toBeChecked();
    expect(getCheckbox('mockName.r2[0]')).not.toBeChecked();
    expect(getCheckbox('mockName.r2[1]')).not.toBeChecked();
    expect(getCheckbox(`mockName.r2.${CHECK_ALL}`)).not.toBeChecked();
    expect(formikProps.values.mockName).toEqual({ r1: [true, true], r2: [false, false] });

    // uncheck one cell
    await actAndAwait(() => getCheckbox('mockName.r1[0]').click());
    expect(getCheckbox('mockName.r1[0]')).not.toBeChecked();
    expect(getCheckbox(`mockName.r1.${CHECK_ALL}`)).not.toBeChecked();
    expect(formikProps.values.mockName).toEqual({ r1: [false, true], r2: [false, false] });

    // check one cell
    await actAndAwait(() => getCheckbox('mockName.r1[0]').click());
    expect(getCheckbox('mockName.r1[0]')).toBeChecked();
    expect(getCheckbox(`mockName.r1.${CHECK_ALL}`)).toBeChecked();
    expect(formikProps.values.mockName).toEqual({ r1: [true, true], r2: [false, false] });

    // unselect the entire row
    await actAndAwait(() => getCheckbox(`mockName.r1.${CHECK_ALL}`).click());
    expect(getCheckbox('mockName.r1[0]')).not.toBeChecked();
    expect(getCheckbox('mockName.r1[1]')).not.toBeChecked();
    expect(getCheckbox(`mockName.r1.${CHECK_ALL}`)).not.toBeChecked();
    expect(formikProps.values.mockName).toEqual({ r1: [false, false], r2: [false, false] });

    // select the entire row
    await actAndAwait(() => getCheckbox(`mockName.r1.${CHECK_ALL}`).click());
    expect(getCheckbox('mockName.r1[0]')).toBeChecked();
    expect(getCheckbox('mockName.r1[1]')).toBeChecked();
    expect(getCheckbox(`mockName.r1.${CHECK_ALL}`)).toBeChecked();
    expect(formikProps.values.mockName).toEqual({ r1: [true, true], r2: [false, false] });
  });
});

import { actAndAwaitForHook } from '@plentyag/core/src/test-helpers';
import { renderHook } from '@testing-library/react-hooks';
import { useFormik } from 'formik';
import React from 'react';
import * as yup from 'yup';

import { formatWithLeadingZeroTrailingOneDecimal, useTextFieldGridInit } from './use-text-field-grid-init';

function setup({ initialValues = {}, type = 'string' } = {}) {
  const formGenField: FormGen.FieldTextFieldGrid = {
    type: 'TextFieldGrid',
    name: 'mockName',
    label: 'Mock Label',
    columns: ['c1', 'c2'],
    rows: [
      { label: 'r1', value: 'r1' },
      { label: 'r2', value: 'r2' },
    ],
    textFieldProps: { type },
    blurEffect: 'leadingZeroTrailingOneDecimal',
  };

  const { result } = renderHook(() =>
    useFormik({
      initialValues,
      validationSchema: yup.object().shape({ mockName: formGenField.validate }),
      onSubmit: jest.fn(),
    })
  );

  return {
    formikHook: result,
    formGenField,
  };
}

describe('useTextFieldGridInit', () => {
  it('initializes the internalValues and internalParsedValues with defaultValue', () => {
    const { formGenField, formikHook } = setup();
    const { result } = renderHook(() => useTextFieldGridInit(formikHook.current, formGenField));

    expect(result.current.internalValues).toEqual({ r1: [undefined, undefined], r2: [undefined, undefined] });
    expect(result.current.internalParsedValues).toEqual({ r1: [undefined, undefined], r2: [undefined, undefined] });
  });

  it('updates when re-rendering', () => {
    const { formGenField, formikHook } = setup();
    const { result, rerender } = renderHook(
      ({ formikHook, formGenField }) => useTextFieldGridInit(formikHook, formGenField),
      { initialProps: { formikHook: formikHook.current, formGenField } }
    );

    expect(result.current.internalValues).toEqual({ r1: [undefined, undefined], r2: [undefined, undefined] });
    expect(result.current.internalParsedValues).toEqual({ r1: [undefined, undefined], r2: [undefined, undefined] });

    rerender({
      formikHook: { ...formikHook.current, values: { [formGenField.name]: { r1: ['1', '2'], r2: ['3', '4'] } } },
      formGenField,
    });

    expect(result.current.internalValues).toEqual({ r1: ['1', '2'], r2: ['3', '4'] });
    expect(result.current.internalParsedValues).toEqual({ r1: ['1', '2'], r2: ['3', '4'] });
  });

  it('updates when re-rendering with undefined', () => {
    const { formGenField, formikHook } = setup({
      initialValues: { mockName: { r1: ['1', '2'], r2: ['3', '4'] } },
    });
    const { result, rerender } = renderHook(
      ({ formikHook, formGenField }) => useTextFieldGridInit(formikHook, formGenField),
      { initialProps: { formikHook: formikHook.current, formGenField } }
    );

    expect(result.current.internalValues).toEqual({ r1: ['1', '2'], r2: ['3', '4'] });
    expect(result.current.internalParsedValues).toEqual({ r1: ['1', '2'], r2: ['3', '4'] });

    rerender({
      formikHook: { ...formikHook.current, values: { [formGenField.name]: undefined } },
      formGenField,
    });

    expect(result.current.internalValues).toEqual({ r1: [undefined, undefined], r2: [undefined, undefined] });
    expect(result.current.internalParsedValues).toEqual({ r1: [undefined, undefined], r2: [undefined, undefined] });
  });

  it('initializes the internalValues and internalParsedValues with the formik value', () => {
    const { formGenField, formikHook } = setup({
      initialValues: {
        mockName: { r1: ['1', '2'], r2: ['3', '4'] },
      },
    });
    const { result } = renderHook(() => useTextFieldGridInit(formikHook.current, formGenField));

    expect(result.current.internalValues).toEqual({ r1: ['1', '2'], r2: ['3', '4'] });
    expect(result.current.internalParsedValues).toEqual({ r1: ['1', '2'], r2: ['3', '4'] });
  });

  it('initializes the internalValues and internalParsedValues with the formik value (with numbers)', () => {
    const { formGenField, formikHook } = setup({
      initialValues: {
        mockName: { r1: [1, 2], r2: [3, 4] },
      },
    });
    const { result } = renderHook(() => useTextFieldGridInit(formikHook.current, formGenField));

    expect(result.current.internalValues).toEqual({ r1: ['01.0', '02.0'], r2: ['03.0', '04.0'] });
    expect(result.current.internalParsedValues).toEqual({ r1: [1, 2], r2: [3, 4] });
  });

  it('provides a blur effect that will prefix the value with "0" and suffix with ".0" for any single digit integer', async () => {
    const { formGenField, formikHook } = setup({ type: 'number' });
    const { result } = renderHook(() => useTextFieldGridInit(formikHook.current, formGenField));

    expect(result.current.internalValues).toEqual({ r1: [undefined, undefined], r2: [undefined, undefined] });
    expect(result.current.internalParsedValues).toEqual({ r1: [undefined, undefined], r2: [undefined, undefined] });

    const event = {
      currentTarget: { name: 'mockName.r1[0]', type: 'number', value: 1 },
    } as unknown as React.FocusEvent<HTMLInputElement>;
    await actAndAwaitForHook(() => result.current.handleBlur(event));

    expect(result.current.internalValues).toEqual({ r1: ['01.0', undefined], r2: [undefined, undefined] });
    // it leaves the internalParsedValues untouched (this is just comestic)
    expect(result.current.internalParsedValues).toEqual({ r1: [undefined, undefined], r2: [undefined, undefined] });
  });
});

describe('validates changes in textfield grid columns ', () => {
  it('recomputes the internalValues and internalParsedValues when increasing column size', () => {
    const { formGenField, formikHook } = setup({
      initialValues: {
        mockName: { r1: [1, 2], r2: [3, 4] },
      },
    });

    const { result, rerender } = renderHook(
      ({ formikHook, formGenField }) => useTextFieldGridInit(formikHook, formGenField),
      { initialProps: { formikHook: formikHook.current, formGenField } }
    );

    expect(result.current.internalValues).toEqual({ r1: ['01.0', '02.0'], r2: ['03.0', '04.0'] });
    expect(result.current.internalParsedValues).toEqual({ r1: [1, 2], r2: [3, 4] });

    rerender({
      formikHook: formikHook.current,
      formGenField: { ...formGenField, columns: ['c1', 'c2', 'c3'] },
    });

    expect(result.current.internalValues).toEqual({ r1: ['01.0', '02.0', undefined], r2: ['03.0', '04.0', undefined] });
    expect(result.current.internalParsedValues).toEqual({ r1: [1, 2, undefined], r2: [3, 4, undefined] });
  });

  it('recomputes the internalValues and internalParsedValues when decreasing the columns size', () => {
    const { formGenField, formikHook } = setup({
      initialValues: {
        mockName: { r1: [1, 2], r2: [3, 4] },
      },
    });
    const { result, rerender } = renderHook(
      ({ formikHook, formGenField }) => useTextFieldGridInit(formikHook, formGenField),
      { initialProps: { formikHook: formikHook.current, formGenField } }
    );

    expect(result.current.internalValues).toEqual({ r1: ['01.0', '02.0'], r2: ['03.0', '04.0'] });
    expect(result.current.internalParsedValues).toEqual({ r1: [1, 2], r2: [3, 4] });

    rerender({
      formikHook: formikHook.current,
      formGenField: { ...formGenField, columns: ['c1'] },
    });

    expect(result.current.internalValues).toEqual({ r1: ['01.0'], r2: ['03.0'] });
    expect(result.current.internalParsedValues).toEqual({ r1: [1], r2: [3] });
  });

  it('initializes internalValues and internalParsedValues correctly when some data is missing compared to the columns and rows definitions', () => {
    const { formGenField, formikHook } = setup({
      initialValues: {
        mockName: { r2: [3, 4] }, // r1 is missing here in the data.
      },
    });
    const { result } = renderHook(({ formikHook, formGenField }) => useTextFieldGridInit(formikHook, formGenField), {
      initialProps: { formikHook: formikHook.current, formGenField },
    });

    // r1 should be initialized with undefined when missing.
    expect(result.current.internalValues).toEqual({ r1: [undefined, undefined], r2: ['03.0', '04.0'] });
    expect(result.current.internalParsedValues).toEqual({ r1: [undefined, undefined], r2: [3, 4] });
  });
});

describe('formatWithLeadingZeroTrailingOneDecimal', () => {
  it('returns 01.0', () => {
    expect(formatWithLeadingZeroTrailingOneDecimal(1)).toBe('01.0');
  });

  it('returns 01.1', () => {
    expect(formatWithLeadingZeroTrailingOneDecimal(1.1)).toBe('01.1');
  });

  it('returns 11.1', () => {
    expect(formatWithLeadingZeroTrailingOneDecimal(11.1)).toBe('11.1');
  });

  it('returns 111.1', () => {
    expect(formatWithLeadingZeroTrailingOneDecimal(111.1)).toBe('111.1');
  });

  it('returns 01.11', () => {
    expect(formatWithLeadingZeroTrailingOneDecimal(1.11)).toBe('01.11');
  });

  it('returns 1', () => {
    expect(formatWithLeadingZeroTrailingOneDecimal('1')).toBe('1');
  });

  it('returns undefined', () => {
    expect(formatWithLeadingZeroTrailingOneDecimal(undefined)).toBeUndefined();
  });

  it('returns null', () => {
    expect(formatWithLeadingZeroTrailingOneDecimal(null)).toBeNull();
  });
});

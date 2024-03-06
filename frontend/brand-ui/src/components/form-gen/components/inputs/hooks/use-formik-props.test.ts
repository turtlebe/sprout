import { actAndAwaitForHook } from '@plentyag/core/src/test-helpers';
import { renderHook } from '@testing-library/react-hooks';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { useFormikProps } from './use-formik-props';

function useTestHook({ initialValues = {}, defaultValue = undefined } = {}) {
  const formGenField: FormGen.FieldTextField = {
    type: 'TextField',
    name: 'mockName',
    label: 'Mock Label',
    default: defaultValue,
    validate: yup.mixed().required(),
  };

  const formikProps = useFormik({
    initialValues,
    validationSchema: yup.object().shape({ mockName: formGenField.validate }),
    onSubmit: jest.fn(),
  });

  const registerSpy = jest.spyOn(formikProps, 'registerField');
  const unregisterSpy = jest.spyOn(formikProps, 'unregisterField');

  return {
    ...useFormikProps(formikProps, formGenField),
    formGenField,
    formikProps,
    registerSpy,
    unregisterSpy,
  };
}

describe('useFormikProps', () => {
  it('returns undefined when unitialized', () => {
    const { result } = renderHook(() => useTestHook());

    expect(result.current.value).toBeUndefined();
    expect(result.current.error).toBeUndefined();
  });

  it('returns the initialized value', () => {
    const { result } = renderHook(() => useTestHook({ initialValues: { mockName: 'test-value' } }));

    expect(result.current.value).toBe('test-value');
    expect(result.current.error).toBeUndefined();
  });

  it('updates the value when the Formik value changes', async () => {
    const { result, rerender } = renderHook(() => useTestHook());

    await actAndAwaitForHook(async () =>
      result.current.formikProps.setFieldValue(result.current.formGenField.name, 'test-value')
    );

    rerender();

    expect(result.current.value).toBe('test-value');
    expect(result.current.error).toBeUndefined();
  });

  it('updates the value with default when value is undefined', async () => {
    const mockDefault = 'hello-world';

    const { result } = renderHook(() =>
      useTestHook({
        defaultValue: mockDefault,
      })
    );

    await actAndAwaitForHook(() => expect(result.current.value).toEqual(mockDefault));
  });

  it('does not update the value with default when value is defined', async () => {
    const mockNameInitialValue = 'test-value';
    const { result } = renderHook(() =>
      useTestHook({ initialValues: { mockName: mockNameInitialValue }, defaultValue: 'mock-default' })
    );

    await actAndAwaitForHook(() => expect(result.current.value).toEqual(mockNameInitialValue));
  });

  it('updates value when default value changes', async () => {
    const { result, rerender } = renderHook(({ defaultValue }) => useTestHook({ defaultValue }), {
      initialProps: { defaultValue: 'initial-default' },
    });

    await actAndAwaitForHook(() => expect(result.current.value).toEqual('initial-default'));

    rerender({ defaultValue: 'new-default-value' });

    await actAndAwaitForHook(() => expect(result.current.value).toEqual('new-default-value'));
  });

  it('updates value when default value changes - even if it already has value', async () => {
    const mockNameInitialValue = 'test-value';
    const { result, rerender } = renderHook(
      ({ defaultValue }) => useTestHook({ defaultValue, initialValues: { mockName: mockNameInitialValue } }),
      {
        initialProps: { defaultValue: 'initial-default' },
      }
    );

    await actAndAwaitForHook(() => expect(result.current.value).toEqual('test-value'));

    rerender({ defaultValue: 'new-default-value' });

    await actAndAwaitForHook(() => expect(result.current.value).toEqual('new-default-value'));
  });

  it('returns an error when validation fails', async () => {
    const { result, rerender } = renderHook(() => useTestHook());

    await actAndAwaitForHook(async () => result.current.formikProps.validateField(result.current.formGenField.name));

    rerender();

    expect(result.current.value).toBeUndefined();
    expect(result.current.error).toBe('mockName is a required field');
  });

  it('registers and unregisters the field to Formik', () => {
    const { result, unmount } = renderHook(() => useTestHook());

    expect(result.current.registerSpy).toHaveBeenCalledWith(
      result.current.formGenField.name,
      expect.objectContaining({
        validate: result.current.formGenField.validate,
      })
    );

    unmount();

    expect(result.current.unregisterSpy).toHaveBeenCalledWith(result.current.formGenField.name);
  });
});

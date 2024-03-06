import { mockFormikProps } from '@plentyag/brand-ui/src/components/form-gen/components/inputs/test-helpers';
import { renderHook } from '@testing-library/react-hooks';
import * as yup from 'yup';

import { useValidationField } from './use-validation-field';

const minErroMsg = 'value must be >= 1';
const formGenField: FormGen.Field = {
  type: 'TextField',
  name: 'count',
  default: 1,
  validate: yup.number().min(1, minErroMsg),
  textFieldProps: { type: 'number' },
};

const validationSchema = yup.object().shape({ [formGenField.name]: formGenField.validate });

describe('useValidationField', () => {
  function testValidation(value: number) {
    const formikProps = mockFormikProps({ formGenField, value });

    const { result, waitFor } = renderHook(() => useValidationField({ validationSchema, formikProps }));

    const validateField = result.current;

    validateField(formGenField.name);

    return { waitFor, formikProps };
  }

  it('sets error when validations fails', async () => {
    const { waitFor, formikProps } = testValidation(0);

    await waitFor(() => expect(formikProps.setFieldError).toHaveBeenCalledTimes(1));
    expect(formikProps.setFieldError).toHaveBeenCalledWith(formGenField.name, minErroMsg);
  });

  it('clears error when validation fails', async () => {
    const { waitFor, formikProps } = testValidation(2);

    await waitFor(() => expect(formikProps.setFieldError).toHaveBeenCalledTimes(1));
    expect(formikProps.setFieldError).toHaveBeenCalledWith(formGenField.name, null);
  });
});

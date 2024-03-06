import { InputRenderer } from '@plentyag/brand-ui/src/components/form-gen/components/input-renderer';
import { getInputComponent } from '@plentyag/brand-ui/src/components/form-gen/components/inputs';
import { actAndAwaitRender } from '@plentyag/core/src/test-helpers';
import { Formik } from 'formik';
import React from 'react';
import * as yup from 'yup';

import { FormikEffectOnError } from '.';

describe('FormikEffectOnError', () => {
  it('executes a callback when a formGenField has an error', async () => {
    const handleError = jest.fn();
    const formGenField: FormGen.FieldTextField = {
      type: 'TextField',
      name: 'mockName',
      label: 'Mock Label',
      validate: yup.string().required(),
    };
    const validationSchema = yup.object().shape({ [formGenField.name]: formGenField.validate });

    await actAndAwaitRender(
      <Formik initialValues={{}} onSubmit={jest.fn()} validateOnMount={true} validationSchema={validationSchema}>
        {formikProps => (
          <>
            <FormikEffectOnError formikProps={formikProps} onError={handleError} />
            <InputRenderer
              InputComponent={getInputComponent(formGenField)}
              formGenField={formGenField}
              formikProps={formikProps}
            />
          </>
        )}
      </Formik>
    );

    expect(handleError).toHaveBeenCalledTimes(1);
    expect(handleError).toHaveBeenCalledWith({ [formGenField.name]: `${formGenField.name} is a required field` });
  });
});

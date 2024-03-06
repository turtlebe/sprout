import { render } from '@testing-library/react';
import { Formik } from 'formik';
import React from 'react';

import { getInputComponent } from '../inputs';
import { dataTestIds as tooltipDataTestIds } from '../tooltip-renderer';

import { InputRenderer } from '.';

let consoleError;

describe('InputRenderer', () => {
  beforeAll(() => {
    consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    consoleError.mockRestore();
  });

  afterEach(() => {
    consoleError.mockClear();
  });

  it('renders an input based on a valid configuration', () => {
    const formGenField: FormGen.FieldTextField = {
      type: 'TextField',
      name: 'mockName',
      label: 'Mock Label',
    };

    const { getByTestId, queryByTestId } = render(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        {formikProps => (
          <InputRenderer
            InputComponent={getInputComponent(formGenField)}
            formGenField={formGenField}
            formikProps={formikProps}
          />
        )}
      </Formik>
    );

    expect(getByTestId(formGenField.name)).toBeInTheDocument();
    expect(queryByTestId(tooltipDataTestIds.root)).not.toBeInTheDocument();
  });

  it('renders an input with tooltip', () => {
    const formGenField: FormGen.FieldTextField = {
      type: 'TextField',
      name: 'mockName',
      label: 'Mock Label',
      tooltip: () => <span>mock-tooltip</span>,
    };

    const { getByTestId } = render(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        {formikProps => (
          <InputRenderer
            InputComponent={getInputComponent(formGenField)}
            formGenField={formGenField}
            formikProps={formikProps}
          />
        )}
      </Formik>
    );

    expect(getByTestId(formGenField.name)).toBeInTheDocument();
    expect(getByTestId(tooltipDataTestIds.root)).toBeInTheDocument();
  });

  it('throws an error given an invalid FormGenField', () => {
    const formGenField: FormGen.FieldTextField = {
      type: 'InvalidComponent',
      name: 'mockName',
      label: 'Mock Label',
    } as unknown as FormGen.FieldTextField;

    expect(() => {
      render(
        <Formik initialValues={{}} onSubmit={jest.fn()}>
          {formikProps => (
            <InputRenderer
              InputComponent={getInputComponent(formGenField)}
              formGenField={formGenField}
              formikProps={formikProps}
            />
          )}
        </Formik>
      );
    }).toThrow('Invalid formGenField type: InvalidComponent');
  });
});

import { changeTextField, getInputByName } from '@plentyag/brand-ui/src/test-helpers';
import { actAndAwait, actAndAwaitRender } from '@plentyag/core/src/test-helpers';
import { DateTimeFormat } from '@plentyag/core/src/utils';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { act } from '@testing-library/react-hooks';
import { DateTime } from 'luxon';
import React from 'react';

import { FormRenderer } from '.';

import { dataTestIds } from './components/form-body-renderer';

const formGenConfig: FormGen.Config = {
  fields: [
    {
      type: 'TextField',
      name: 'textField',
      label: 'TextField',
    },
    {
      if: values => values.textField === 'showSecondTextField',
      fields: [
        {
          type: 'TextField',
          name: 'secondTextField',
          label: 'Another TextField',
        },
      ],
    },
  ],
};

describe('FormRenderer', () => {
  it('executes a callback when submitting', async () => {
    const handleSubmit = jest.fn().mockImplementation(values => {
      expect(values).toEqual({});
    });
    const { getByTestId } = render(
      <FormRenderer initialValues={{}} formGenConfig={formGenConfig} onSubmit={handleSubmit} />
    );

    await actAndAwait(() => getByTestId(dataTestIds.submit).click());

    expect(handleSubmit).toHaveBeenCalled();
  });

  it('initializes the form with values', async () => {
    const values = { textField: 'something', secondTextField: 'somethingElse' };
    const handleSubmit = jest.fn().mockImplementation(values => {
      expect(values).toEqual(values);
    });
    const { getByTestId } = render(
      <FormRenderer initialValues={values} formGenConfig={formGenConfig} onSubmit={handleSubmit} />
    );

    await actAndAwait(() => getByTestId(dataTestIds.submit).click());

    expect(handleSubmit).toHaveBeenCalled();
  });

  it('hides the submit button', () => {
    const { queryByTestId } = render(
      <FormRenderer initialValues={{}} formGenConfig={formGenConfig} onSubmit={jest.fn()} renderSubmitButton={false} />
    );

    expect(queryByTestId(dataTestIds.submit)).not.toBeInTheDocument();
  });

  it('passes the formik props to the children', () => {
    render(
      <FormRenderer initialValues={{}} formGenConfig={formGenConfig} onSubmit={jest.fn()} renderSubmitButton={false}>
        {formikProps => {
          expect(formikProps).toBeDefined();
          expect(formikProps.setFieldValue).toBeDefined();

          return <span></span>;
        }}
      </FormRenderer>
    );

    expect.assertions(4);
  });

  it('executes a callback when changing form fields', async () => {
    const handleChange = jest.fn();
    const { getByTestId } = render(
      <FormRenderer initialValues={{}} formGenConfig={formGenConfig} onChange={handleChange} onSubmit={jest.fn()} />
    );
    const input = getByTestId((formGenConfig.fields[0] as FormGen.FieldTextField).name).querySelector('input');

    void act(() => {
      changeTextField(input, 10);
      fireEvent.blur(input);
    });

    await waitFor(() => expect(handleChange).toHaveBeenCalledTimes(1));
  });

  it.skip('does not recompute initialValues if the props does not change', async () => {
    function getFormGenConfig() {
      const dateField: FormGen.FieldKeyboardDatePicker = {
        type: 'KeyboardDatePicker',
        name: 'datepicker',
        label: 'Datepicker',
        default: new Date(),
      };
      const textField: FormGen.FieldTextField = {
        type: 'TextField',
        name: 'textfield',
        label: 'TextField',
      };
      return { fields: [dateField, textField] };
    }

    const { getByTestId, rerender } = render(
      <FormRenderer
        enableReinitialize={true}
        initialValues={{}}
        formGenConfig={getFormGenConfig()}
        onSubmit={jest.fn()}
      />
    );

    const dateInput = getByTestId('datepicker').querySelector('input');
    const textInput = getByTestId('textfield').querySelector('input');

    expect(dateInput).toHaveValue(DateTime.now().toFormat(DateTimeFormat.DEFAULT));
    expect(textInput).toHaveValue('');

    await actAndAwait(() => changeTextField(textInput, 'new-value'));

    expect(textInput).toHaveValue('new-value');

    rerender(
      <FormRenderer
        enableReinitialize={true}
        initialValues={{}}
        formGenConfig={getFormGenConfig()}
        onSubmit={jest.fn()}
      />
    );

    // @todo fix
    expect(textInput).toHaveValue('new-value');
  });

  it('supports passing a context', () => {
    const context = { arbitrary: 'data' };
    const MockComponent: React.FC<FormGen.FieldProps<FormGen.FieldReactComponent>> = props => {
      expect(props.context).toEqual(context);
      return <span>mock-component</span>;
    };
    const formGenConfig: FormGen.Config = {
      fields: [
        {
          name: 'mock',
          type: 'ReactComponent',
          component: MockComponent,
        },
      ],
    };

    render(<FormRenderer initialValues={{}} formGenConfig={formGenConfig} onSubmit={jest.fn()} context={context} />);
  });

  it('renders a FieldGroupArray', () => {
    const formGenConfig: FormGen.Config = {
      fields: [{ type: 'group', name: 'groupArray', fields: [{ type: 'TextField', name: 'textfield' }] }],
    };

    render(<FormRenderer initialValues={{}} formGenConfig={formGenConfig} onSubmit={jest.fn()} />);

    expect(getInputByName('groupArray.textfield')).toHaveValue('');
  });

  it('renders a FieldGroupArray with initial values', async () => {
    const formGenConfig: FormGen.Config = {
      fields: [{ type: 'group', name: 'groupArray', fields: [{ type: 'TextField', name: 'textfield' }] }],
    };

    await actAndAwaitRender(
      <FormRenderer
        initialValues={{ groupArray: { textfield: '1' } }}
        formGenConfig={formGenConfig}
        onSubmit={jest.fn()}
      />
    );

    expect(getInputByName('groupArray.textfield')).toHaveValue('1');
  });

  it('renders a FieldGroupFunction', () => {
    const formGenConfig: FormGen.Config = {
      fields: [{ type: 'group', name: 'groupFunction', fields: () => [{ type: 'TextField', name: 'textfield' }] }],
    };

    render(<FormRenderer initialValues={{}} formGenConfig={formGenConfig} onSubmit={jest.fn()} />);

    expect(getInputByName('groupFunction[0].textfield')).toHaveValue('');
  });

  it('renders a FieldGroupFunction with initial values', async () => {
    const formGenConfig: FormGen.Config = {
      fields: [{ type: 'group', name: 'groupFunction', fields: () => [{ type: 'TextField', name: 'textfield' }] }],
    };

    await actAndAwaitRender(
      <FormRenderer
        initialValues={{ groupFunction: [{ textfield: '1' }, { textfield: '2' }] }}
        formGenConfig={formGenConfig}
        onSubmit={jest.fn()}
      />
    );

    expect(getInputByName('groupFunction[0].textfield')).toHaveValue('1');
    expect(getInputByName('groupFunction[1].textfield')).toHaveValue('2');
  });

  it('renders nested FieldGroupArrays', () => {
    const formGenConfig: FormGen.Config = {
      fields: [
        {
          type: 'group',
          name: 'groupArray',
          fields: [
            { type: 'TextField', name: 'textfield' },
            {
              type: 'group',
              name: 'nestedGroupArray',
              fields: [{ type: 'TextField', name: 'nestedTextfield' }],
            },
          ],
        },
      ],
    };

    render(<FormRenderer initialValues={{}} formGenConfig={formGenConfig} onSubmit={jest.fn()} />);

    expect(getInputByName('groupArray.textfield')).toHaveValue('');
    expect(getInputByName('groupArray.nestedGroupArray.nestedTextfield')).toHaveValue('');
  });

  it('renders nested FieldGroupArrays with initial values', async () => {
    const formGenConfig: FormGen.Config = {
      fields: [
        {
          type: 'group',
          name: 'groupArray',
          fields: [
            { type: 'TextField', name: 'textfield' },
            {
              type: 'group',
              name: 'nestedGroupArray',
              fields: [{ type: 'TextField', name: 'nestedTextfield' }],
            },
          ],
        },
      ],
    };

    await actAndAwaitRender(
      <FormRenderer
        initialValues={{ groupArray: { textfield: '1', nestedGroupArray: { nestedTextfield: '2' } } }}
        formGenConfig={formGenConfig}
        onSubmit={jest.fn()}
      />
    );

    expect(getInputByName('groupArray.textfield')).toHaveValue('1');
    expect(getInputByName('groupArray.nestedGroupArray.nestedTextfield')).toHaveValue('2');
  });
});

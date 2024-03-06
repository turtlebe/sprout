import {
  changeTextArea,
  changeTextField,
  keyDownInTextArea,
  keyDownInTextField,
} from '@plentyag/brand-ui/src/test-helpers';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { fireEvent } from '@testing-library/react';
import * as yup from 'yup';

import { TEXT_FIELD_ENTER_EVENT } from '../../../constants';
import { makeOptions, renderFormGenInput, renderFormGenInputAsync } from '../test-helpers';

import { TextField } from '.';

const options = makeOptions({});

describe('TextField', () => {
  it('validates on blur', async () => {
    const [{ getByTestId }, { formGenField, validateField }] = renderFormGenInput(TextField);

    const input = getByTestId(formGenField.name).querySelector('input');
    const label = getByTestId(formGenField.name).querySelector('label');

    expect(label).toHaveTextContent(formGenField.label);
    expect(input).toHaveAttribute('id', formGenField.name);
    expect(input).toHaveAttribute('name', formGenField.name);

    await actAndAwait(() => fireEvent.blur(input));

    expect(validateField).toHaveBeenCalled();
  });

  it('validates on change', async () => {
    const [{ getByTestId }, { formGenField, validateField }] = renderFormGenInput(
      TextField,
      options({ initialValues: { mockName: 1 } })
    );

    const input = getByTestId(formGenField.name).querySelector('input');

    expect(input).toHaveValue('1');
    expect(input).toHaveAttribute('id', formGenField.name);
    expect(input).toHaveAttribute('name', formGenField.name);

    await actAndAwait(() => changeTextField(input, 2));

    expect(input).toHaveValue('2');
    expect(validateField).toHaveBeenCalled();
  });

  it('changes the formik value to ""', async () => {
    let formikProps;
    const [{ getByTestId }, { formGenField, validateField }] = renderFormGenInput(
      TextField,
      options({ initialValues: { mockName: 1 }, setFormikProps: f => (formikProps = f) })
    );

    const input = getByTestId(formGenField.name).querySelector('input');

    expect(input).toHaveValue('1');
    expect(input).toHaveAttribute('id', formGenField.name);
    expect(input).toHaveAttribute('name', formGenField.name);

    await actAndAwait(() => changeTextField(input, ''));

    expect(input).toHaveValue('');
    expect(validateField).toHaveBeenCalled();
    expect(formikProps.values[formGenField.name]).toBe('');
  });

  it('changes the formik value to null', async () => {
    let formikProps;
    const [{ getByTestId }, { formGenField, validateField }] = renderFormGenInput(
      TextField,
      options({
        initialValues: { mockName: 1 },
        formGenField: { textFieldProps: { type: 'number' } },
        setFormikProps: f => (formikProps = f),
      })
    );

    const input = getByTestId(formGenField.name).querySelector('input');

    expect(input).toHaveValue(1);
    expect(input).toHaveAttribute('id', formGenField.name);
    expect(input).toHaveAttribute('name', formGenField.name);

    await actAndAwait(() => changeTextField(input, ''));

    expect(input).toHaveValue(null);
    expect(validateField).toHaveBeenCalled();
    expect(formikProps.values[formGenField.name]).toBeNull();
  });

  it('does not decorate the label with "*" when not required with yup', async () => {
    const [{ getByTestId }, { formGenField }] = await renderFormGenInputAsync(TextField, options());
    const label = getByTestId(formGenField.name).querySelector('label');

    expect(label).not.toHaveTextContent(`${formGenField.label} *`);
  });

  it('decorates the label with "*" when required with yup', async () => {
    const [{ getByTestId }, { formGenField }] = await renderFormGenInputAsync(
      TextField,
      options({ formGenField: { validate: yup.mixed().required() } })
    );

    const label = getByTestId(formGenField.name).querySelector('label');

    expect(label).toHaveTextContent(`${formGenField.label} *`);
  });

  it('supports MUI TextField props', async () => {
    const [{ getByTestId }, { formGenField }] = await renderFormGenInputAsync(
      TextField,
      options({ formGenField: { textFieldProps: { multiline: true } } })
    );

    const textArea = getByTestId(formGenField.name).querySelector('textarea');

    expect(textArea).toBeInTheDocument();
  });

  it('hides the input and form-control when input type is ', async () => {
    const [{ getByTestId }, { formGenField }] = await renderFormGenInputAsync(
      TextField,
      options({ formGenField: { textFieldProps: { inputProps: { type: 'hidden' } } } })
    );

    expect(getByTestId(formGenField.name)).toHaveStyle('display: none');
  });

  it('converts initial string value to a number', async () => {
    const [{ getByTestId }, { formGenField }] = await renderFormGenInputAsync(
      TextField,
      options({ initialValues: { mockName: '3141' }, formGenField: { textFieldProps: { type: 'number' } } })
    );

    const input = getByTestId(formGenField.name).querySelector('input');
    expect(input).toHaveValue(3141);
  });

  it('sets the initial value to 0', async () => {
    const [{ getByTestId }, { formGenField }] = await renderFormGenInputAsync(
      TextField,
      options({ initialValues: { mockName: 0 }, formGenField: { textFieldProps: { type: 'number' } } })
    );

    const input = getByTestId(formGenField.name).querySelector('input');
    expect(input).toHaveValue(0);
  });

  it('converts initial value of "0" to a number', async () => {
    const [{ getByTestId }, { formGenField }] = await renderFormGenInputAsync(
      TextField,
      options({ initialValues: { mockName: '0' }, formGenField: { textFieldProps: { type: 'number' } } })
    );

    const input = getByTestId(formGenField.name).querySelector('input');
    expect(input).toHaveValue(0);
  });

  describe('TextField raises event for enter key pressed or text ending with newline', () => {
    async function renderTextFieldWithEventListener(isMultiline: boolean) {
      const wrapperDataTestId = 'wrapper-data-test-id';
      const [{ queryByTestId }, { formGenField }] = await renderFormGenInputAsync(
        TextField,
        options({
          formGenField: { addGroupOnNewLineOrReturn: true, textFieldProps: { multiline: isMultiline } },
          reactTestingLibRenderOptions: {
            wrapper: ({ children }) => <div data-testid={wrapperDataTestId}>{children}</div>,
          },
        })
      );

      const mockEnterEventListener = jest.fn();
      const wrapper = queryByTestId(wrapperDataTestId);
      wrapper.addEventListener(TEXT_FIELD_ENTER_EVENT, mockEnterEventListener);

      return { mockEnterEventListener, queryByTestId, formGenField };
    }
    it('raises event when text area contains newline', async () => {
      // note: newline only works with multiline since it uses textarea, single line uses input
      // which filters out newline.

      const { mockEnterEventListener, queryByTestId, formGenField } = await renderTextFieldWithEventListener(true);

      const textArea = queryByTestId(formGenField.name).querySelector('textarea');

      await actAndAwait(() => changeTextArea(textArea, 'test with no newline'));
      expect(mockEnterEventListener).not.toHaveBeenCalled();

      await actAndAwait(() => changeTextArea(textArea, 'test with newline\n'));
      expect(mockEnterEventListener).toHaveBeenCalled();
    });

    it('raises event when user hits enter key in multiline text field', async () => {
      const { mockEnterEventListener, queryByTestId, formGenField } = await renderTextFieldWithEventListener(true);

      const textArea = queryByTestId(formGenField.name).querySelector('textarea');

      await actAndAwait(() => keyDownInTextArea(textArea, 25));
      expect(mockEnterEventListener).not.toHaveBeenCalled();

      // enter key --> key code 13
      await actAndAwait(() => keyDownInTextArea(textArea, 13));
      expect(mockEnterEventListener).toHaveBeenCalled();
    });

    it('raises event when user hits enter key in single line text field', async () => {
      const { mockEnterEventListener, queryByTestId, formGenField } = await renderTextFieldWithEventListener(false);

      const textInput = queryByTestId(formGenField.name).querySelector('input');

      await actAndAwait(() => keyDownInTextField(textInput, 25));
      expect(mockEnterEventListener).not.toHaveBeenCalled();

      // enter key --> key code 13
      await actAndAwait(() => keyDownInTextField(textInput, 13));
      expect(mockEnterEventListener).toHaveBeenCalled();
    });
  });
});

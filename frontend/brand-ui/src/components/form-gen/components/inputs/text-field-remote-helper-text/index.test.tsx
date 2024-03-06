import { changeTextField } from '@plentyag/brand-ui/src/test-helpers';
import { useSwrAxios } from '@plentyag/core/src/hooks';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import * as yup from 'yup';

import { makeOptions, renderFormGenInputAsync } from '../test-helpers';

import { dataTestIdsTextFieldRemoteHelperText as dataTestIds, TextFieldRemoteHelperText } from '.';

jest.mock('@plentyag/core/src/hooks');

const mockUseSwrAxios = useSwrAxios as jest.Mock;

describe('TextFieldRemoteHelperText', () => {
  beforeEach(() => {
    mockUseSwrAxios.mockReturnValue({ data: undefined, isValidating: true });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders like TextField and validates on change', async () => {
    // ACT 1
    const [{ getByTestId }, { formGenField, validateField }] = await renderFormGenInputAsync(TextFieldRemoteHelperText);

    const input = getByTestId(formGenField.name).querySelector('input');
    const label = getByTestId(formGenField.name).querySelector('label');

    // ASSERT 1
    expect(label).toHaveTextContent(formGenField.label);
    expect(input).toHaveAttribute('id', formGenField.name);
    expect(input).toHaveAttribute('name', formGenField.name);

    // ACT 2
    await actAndAwait(() => changeTextField(input, 2));

    // ASSERT 2
    expect(validateField).toHaveBeenCalled();
  });

  describe('implementation with remote call', () => {
    let mockData, mockError, options, url, renderHelperText;

    const getMuiErrorHelperText = (container, name) => container.querySelector(`#${name}-helper-text`);

    beforeEach(() => {
      // ARRANGE
      // -- mock responses
      mockData = {
        sampleField: 'Success called',
      };

      mockError = new Error();
      mockError.message = 'This is an error!';

      // -- mock helper functions
      url = jest.fn().mockImplementation(value => `/api/sample-api/${value}`);
      renderHelperText = jest.fn().mockImplementation(response => response.sampleField);

      // -- mock form gen options
      options = makeOptions({
        formGenField: {
          url,
          renderHelperText,
          validate: yup.string().optional().min(5),
          label: 'Test',
          name: 'test',
        },
      });
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('does not resolve if the value inputted is not validated', async () => {
      // ARRANGE
      const [{ getByTestId, container }, { formGenField }] = await renderFormGenInputAsync(
        TextFieldRemoteHelperText,
        options()
      );
      const input = getByTestId(formGenField.name).querySelector('input');

      // ACT
      await actAndAwait(() => changeTextField(input, 'no'));

      // ASSERT
      expect(url).toHaveBeenCalledWith('no');
      expect(renderHelperText).not.toHaveBeenCalled();
      expect(getByTestId(dataTestIds.helperText(formGenField.name))).toHaveTextContent('');
      expect(getMuiErrorHelperText(container, formGenField.name)).toHaveTextContent(
        'test must be at least 5 characters'
      );
    });

    it('resolves and renders data after validated value is inputted', async () => {
      // ARRANGE
      mockUseSwrAxios.mockReturnValue({ data: mockData, isValidating: false });
      const [{ getByTestId }, { formGenField }] = await renderFormGenInputAsync(TextFieldRemoteHelperText, options());
      const input = getByTestId(formGenField.name).querySelector('input');

      // ACT
      await actAndAwait(() => changeTextField(input, 'testing'));

      // ASSERT
      expect(url).toHaveBeenCalledWith('testing');
      expect(renderHelperText).toHaveBeenCalledWith(mockData);
      expect(getByTestId(dataTestIds.helperText(formGenField.name))).toHaveTextContent(mockData.sampleField);
    });

    it('resolves and renders error after validated value is inputted', async () => {
      // ARRANGE
      mockUseSwrAxios.mockReturnValue({ data: undefined, error: mockError, isValidating: false });
      const [{ getByTestId, container }, { formGenField }] = await renderFormGenInputAsync(
        TextFieldRemoteHelperText,
        options()
      );
      const input = getByTestId(formGenField.name).querySelector('input');

      // ACT
      await actAndAwait(() => changeTextField(input, 'testing'));

      // ASSERT
      expect(url).toHaveBeenCalledWith('testing');
      expect(renderHelperText).not.toHaveBeenCalled();
      expect(getMuiErrorHelperText(container, formGenField.name)).toHaveTextContent(mockError.message);
    });
  });
});

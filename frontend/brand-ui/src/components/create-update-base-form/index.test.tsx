import { changeTextField, getInputByName } from '@plentyag/brand-ui/src/test-helpers';
import { usePostRequest, usePutRequest, useSwrAxios } from '@plentyag/core/src/hooks';
import { actAndAwait, actAndAwaitRender } from '@plentyag/core/src/test-helpers';
import { act, render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { CreateUpdateBaseForm, dataTestIdsCreateUpdateBaseForm as dataTestIds } from '.';

jest.mock('@plentyag/core/src/hooks');

const formGenConfig: FormGen.Config = {
  title: 'Create Update Form',
  createEndpoint: '/mock-endpoint/:textfield',
  updateEndpoint: '/mock-update-endpoint/:textfield',
  fields: [
    {
      type: 'TextField',
      name: 'textfield',
    },
  ],
};
const mockOnClose = jest.fn();
const mockOnSuccess = jest.fn();
const mockUsePostRequest = usePostRequest as jest.Mock;
const mockUsePutRequest = usePutRequest as jest.Mock;
const mockUseSwrAxios = useSwrAxios as jest.Mock;

describe('CreateUpdateBaseForm', () => {
  beforeEach(() => {
    mockUsePostRequest.mockRestore();
    mockUsePutRequest.mockRestore();
    mockOnClose.mockRestore();
    mockOnSuccess.mockRestore();
    mockUseSwrAxios.mockRestore();
  });

  function makeRequestMocks() {
    mockUsePostRequest.mockReturnValue({ makeRequest: jest.fn() });
    mockUsePutRequest.mockReturnValue({ makeRequest: jest.fn() });
    mockUseSwrAxios.mockReturnValue({ data: undefined, isValidating: false, error: undefined });
  }

  it('renders with a submit CTA', () => {
    makeRequestMocks();

    const { queryByTestId } = render(<CreateUpdateBaseForm formGenConfig={formGenConfig} onSuccess={mockOnSuccess} />, {
      wrapper: props => <MemoryRouter {...props} />,
    });

    expect(queryByTestId(dataTestIds.submit)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.submit)).toBeEnabled();
  });

  it('disables submit button', () => {
    makeRequestMocks();

    const { queryByTestId } = render(
      <CreateUpdateBaseForm isSubmitDisabled={true} formGenConfig={formGenConfig} onSuccess={mockOnSuccess} />,
      {
        wrapper: props => <MemoryRouter {...props} />,
      }
    );

    expect(queryByTestId(dataTestIds.submit)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.submit)).toBeDisabled();
    expect(queryByTestId(dataTestIds.title)).toBeInTheDocument();
  });

  it('hides title', () => {
    makeRequestMocks();

    const { queryByTestId } = render(
      <CreateUpdateBaseForm showTitle={false} formGenConfig={formGenConfig} onSuccess={mockOnSuccess} />,
      {
        wrapper: props => <MemoryRouter {...props} />,
      }
    );

    expect(queryByTestId(dataTestIds.title)).not.toBeInTheDocument();
  });

  async function submitForm(isUpdating = false, onBeforeSubmit?: () => void) {
    const makePostRequest = jest.fn().mockImplementation(
      () =>
        ({ onSuccess }) =>
          onSuccess()
    );
    const makePutRequest = jest.fn().mockImplementation(
      () =>
        ({ onSuccess }) =>
          onSuccess()
    );

    mockUsePostRequest.mockReturnValue({ makeRequest: makePostRequest });
    mockUsePutRequest.mockReturnValue({ makeRequest: makePutRequest });
    mockUseSwrAxios.mockReturnValue({ data: undefined, isValidating: false, error: undefined });

    const { queryByTestId } = render(
      <CreateUpdateBaseForm
        formGenConfig={formGenConfig}
        isUpdating={isUpdating}
        onSuccess={mockOnSuccess}
        onBeforeSubmit={onBeforeSubmit}
      />,
      { wrapper: props => <MemoryRouter {...props} /> }
    );

    expect(makePostRequest).toHaveBeenCalledTimes(0);
    expect(makePutRequest).toHaveBeenCalledTimes(0);

    await actAndAwait(() => changeTextField('textfield', 'textfield-value'));
    await actAndAwait(() => queryByTestId(dataTestIds.submit).click());

    return { makePutRequest, makePostRequest };
  }

  it('submits the form', async () => {
    const { makePutRequest, makePostRequest } = await submitForm();

    expect(makePutRequest).toHaveBeenCalledTimes(0);
    expect(makePostRequest).toHaveBeenCalledTimes(1);
    expect(makePostRequest).toHaveBeenCalledWith({
      data: { textfield: 'textfield-value' },
      url: '/mock-endpoint/textfield-value',
      onError: expect.any(Function),
      onSuccess: expect.any(Function),
    });
  });

  it('calls "onBeforeSubmit" before submitting the form then continue after "next" callback is called', async () => {
    let mockOnContinue;
    let mockCalled = jest.fn();

    const mockOnBeforeSubmit = jest.fn().mockImplementation((values, next) => {
      mockCalled(values);
      mockOnContinue = next;
    });

    const { makePostRequest } = await submitForm(false, mockOnBeforeSubmit);

    // should not call post yet
    expect(makePostRequest).toHaveBeenCalledTimes(0);
    expect(mockOnBeforeSubmit).toHaveBeenCalled();

    // call "next" to continue with request
    act(() => mockOnContinue({ textfield: 'textfield-value', updatedField: true }));

    expect(makePostRequest).toHaveBeenCalledTimes(1);
    expect(makePostRequest).toHaveBeenCalledWith({
      data: { textfield: 'textfield-value', updatedField: true },
      url: '/mock-endpoint/textfield-value',
      onError: expect.any(Function),
      onSuccess: expect.any(Function),
    });
  });

  it('uses "updateEndpoint" for url when "isUpdating" prop is true', async () => {
    const { makePutRequest, makePostRequest } = await submitForm(true);

    expect(makePostRequest).toHaveBeenCalledTimes(0);
    expect(makePutRequest).toHaveBeenCalledTimes(1);
    expect(makePutRequest).toHaveBeenCalledWith({
      data: { textfield: 'textfield-value' },
      url: '/mock-update-endpoint/textfield-value',
      onError: expect.any(Function),
      onSuccess: expect.any(Function),
    });
  });

  it('populates the form with initial values', async () => {
    makeRequestMocks();
    const initialValues = { textfield: 'textfield-value' };

    await actAndAwaitRender(
      <MemoryRouter>
        <CreateUpdateBaseForm
          formGenConfig={formGenConfig}
          isUpdating={true}
          initialValues={initialValues}
          onSuccess={mockOnSuccess}
        />
      </MemoryRouter>
    );

    expect(getInputByName('textfield')).toHaveValue(initialValues.textfield);
  });
});

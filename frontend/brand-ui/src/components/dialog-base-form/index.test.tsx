import { usePostRequest, usePutRequest, useSwrAxios } from '@plentyag/core/src/hooks';
import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { dataTestIdsDialogBaseForm as dataTestIds, DialogBaseForm } from '.';

jest.mock('@plentyag/core/src/hooks');

const formGenConfig: FormGen.Config = {
  title: 'Dialog Base Form',
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

describe('DialogBaseForm', () => {
  beforeEach(() => {
    mockUsePostRequest.mockRestore();
    mockUsePutRequest.mockRestore();
    mockUseSwrAxios.mockRestore();
    mockOnClose.mockRestore();
    mockOnSuccess.mockRestore();
  });

  function makeRequestMocks() {
    mockUsePostRequest.mockReturnValue({ makeRequest: jest.fn() });
    mockUsePutRequest.mockReturnValue({ makeRequest: jest.fn() });
    mockUseSwrAxios.mockReturnValue({ data: undefined, isValidating: false, error: false });
  }

  it('hides the modal', () => {
    makeRequestMocks();

    const { queryByTestId } = render(
      <DialogBaseForm open={false} formGenConfig={formGenConfig} onClose={mockOnClose} onSuccess={mockOnSuccess} />,
      { wrapper: props => <MemoryRouter {...props} /> }
    );

    expect(queryByTestId(dataTestIds.root)).not.toBeInTheDocument();
  });

  it('renders with a title and a submit CTA', () => {
    makeRequestMocks();

    const { queryByTestId } = render(
      <DialogBaseForm open formGenConfig={formGenConfig} onClose={mockOnClose} onSuccess={mockOnSuccess} />,
      { wrapper: props => <MemoryRouter {...props} /> }
    );

    expect(queryByTestId(dataTestIds.root)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.title)).toHaveTextContent(formGenConfig.title);
    expect(queryByTestId(dataTestIds.submit)).toBeInTheDocument();
  });

  it('calls onClose when closing the modal', () => {
    makeRequestMocks();

    const { queryByTestId } = render(
      <DialogBaseForm open formGenConfig={formGenConfig} onClose={mockOnClose} onSuccess={mockOnSuccess} />,
      { wrapper: props => <MemoryRouter {...props} /> }
    );

    expect(mockOnClose).toHaveBeenCalledTimes(0);

    queryByTestId(dataTestIds.close).click();

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});

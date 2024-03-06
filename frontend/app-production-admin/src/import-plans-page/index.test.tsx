import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { ImportPlansPage } from '.';

import {
  dataTestIdsImportedPlansTable,
  dataTestIdsImportPlansModule,
  ImportedPlansTable,
  ImportPlansModule,
} from './components';
import { useLoadUploadHistory } from './hooks';

jest.mock('./components/import-plans-module');
const mockImportPlansModule = ImportPlansModule as jest.Mock;

jest.mock('./components/imported-plans-table');
const mockImportedPlansTable = ImportedPlansTable as jest.Mock;

jest.mock('./hooks/use-load-upload-history');
const mockUseLoadUploadHistory = useLoadUploadHistory as jest.Mock;

describe('ImportPlansPage', () => {
  beforeEach(() => {
    mockImportPlansModule.mockImplementation(() => {
      return <div data-testid={dataTestIdsImportPlansModule.root}>no impl</div>;
    });
    mockImportedPlansTable.mockImplementation(() => {
      return <div data-testid={dataTestIdsImportedPlansTable.root}>no impl</div>;
    });
    mockUseLoadUploadHistory.mockReturnValue({
      isLoading: false,
      uploadHistory: [],
      revalidate: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  function renderImportPlansPage() {
    return render(<ImportPlansPage />, { wrapper: props => <MemoryRouter {...props} /> });
  }

  it('renders', () => {
    const { queryByTestId } = renderImportPlansPage();

    expect(queryByTestId(dataTestIdsImportPlansModule.root)).toBeInTheDocument();
    // TODO: TEMPORARILY REMOVE THIS FOR NOW.  Need to bring back after
    // expect(queryByTestId(dataTestIdsImportedPlansTable.root)).toBeInTheDocument();
  });

  // TODO: TEMPORARILY REMOVE THIS FOR NOW.  Need to bring back after
  it('refreshes after a success submit', () => {
    // ARRANGE
    const mockRevalidate = jest.fn();
    mockUseLoadUploadHistory.mockReturnValue({
      isLoading: false,
      uploadHistory: [],
      revalidate: mockRevalidate,
    });

    mockImportPlansModule.mockImplementation(({ onSuccess }) => {
      return (
        <div data-testid={dataTestIdsImportPlansModule.root}>
          <button data-testid="success" onClick={onSuccess}>
            success
          </button>
        </div>
      );
    });

    const { queryByTestId } = renderImportPlansPage();

    // ACT
    const mockSuccess = queryByTestId('success');
    mockSuccess.click();

    // ASSERT
    expect(mockRevalidate).toHaveBeenCalled();
  });
});

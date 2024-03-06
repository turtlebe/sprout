import { act, render } from '@testing-library/react';
import React from 'react';

import { useGetOperationsPaths } from '../../hooks';

import { dataTestIdsOperations as dataTestIds, Operations } from './index';

const mockAllowedOperations: ProdActions.AllowedOperation[] = [
  { name: 'TrashContainer', displayName: 'Trash Container', prefilledArgs: {} },
  { name: 'MoveContainer', displayName: 'Move Container', prefilledArgs: {} },
];

jest.mock('../../hooks/use-get-operations-paths');
const mockUseGetOperationsPaths = useGetOperationsPaths as jest.Mock;
const mockUseGetOperationsPathReturnValue = {
  isLoading: false,
  operationPaths: new Map([
    ['TrashContainer', 'sites/SSF2/interfaces/Traceability/methods/TrashContainer'],
    ['MoveContainer', 'sites/SSF2/interfaces/Traceability/methods/MoveContainer'],
  ]),
};

const mockSiteName = 'SSF2';

describe('Operations', () => {
  function renderOperations(areOperationsEnabled: boolean) {
    const mockSelectOperation = jest.fn();

    const renderResult = render(
      <Operations
        selectOperation={mockSelectOperation}
        allowedOperations={mockAllowedOperations}
        siteName={mockSiteName}
        areOperationsEnabled={areOperationsEnabled}
      />
    );
    return { ...renderResult, mockSelectOperation };
  }

  it('renders loading progress when loading operation paths', () => {
    mockUseGetOperationsPaths.mockReturnValue({ isLoading: true, operationPaths: [] });

    const { queryByTestId } = renderOperations(true);

    expect(queryByTestId(dataTestIds.loadingProgress)).toBeInTheDocument();

    mockUseGetOperationsPaths.mockReset();
  });

  it('renders Trash and Wash operations', () => {
    mockUseGetOperationsPaths.mockReturnValue(mockUseGetOperationsPathReturnValue);

    const { queryAllByTestId } = renderOperations(true);

    const operationButtons = queryAllByTestId(dataTestIds.operationButton);
    expect(operationButtons.length).toBe(2);
    operationButtons.forEach((button, index) =>
      expect(button).toHaveTextContent(mockAllowedOperations[index].displayName)
    );
  });

  it('calls selectOperation when operation is clicked', () => {
    mockUseGetOperationsPaths.mockReturnValue(mockUseGetOperationsPathReturnValue);

    const { queryAllByTestId, mockSelectOperation } = renderOperations(true);

    const operationButtons = queryAllByTestId(dataTestIds.operationButton);

    // click Trash operation.
    act(() => operationButtons[0].click());

    expect(mockSelectOperation).toHaveBeenCalledWith({
      ...mockAllowedOperations[0],
      path: 'sites/SSF2/interfaces/Traceability/methods/TrashContainer',
    });
  });

  it('disables the operation buttons', () => {
    mockUseGetOperationsPaths.mockReturnValue(mockUseGetOperationsPathReturnValue);

    const { queryAllByTestId } = renderOperations(false);

    const operationButtons = queryAllByTestId(dataTestIds.operationButton);
    expect(operationButtons.length).toBe(2);
    operationButtons.forEach(button => expect(button).toBeDisabled());
  });
});

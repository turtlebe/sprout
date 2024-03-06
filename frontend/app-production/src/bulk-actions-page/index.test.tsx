import { Operations } from '@plentyag/app-production/src/common/components';
import { mockContainersResourceState } from '@plentyag/app-production/src/common/test-helpers';
import { dataTestids as dataTestIdsRefreshButton } from '@plentyag/brand-ui/src/components/refresh-button';
import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { cloneDeep } from 'lodash';
import React from 'react';
import { Router } from 'react-router-dom';

import { BulkActionsPage, dataTestIdsBulkActionsPage as dataTestIds } from '.';

import {
  DialogActionResults,
  DialogAddContainerSerialNumbers,
  DialogPerformAction,
  TableBulkContainerSerials,
} from './components';
import { useGetContainersResourceState } from './hooks';
import { Container, SerialStatus } from './types';

mockCurrentUser({ currentFarmDefPath: 'sites/SSF2/farms/Tigris' });

jest.mock('@plentyag/app-production/src/common/components/operations');
const mockOperations = Operations as jest.Mock;
const mockActionButton = 'action-button';
mockOperations.mockImplementation(({ allowedOperations, selectOperation, areOperationsEnabled }) => {
  return (
    <>
      {allowedOperations.map(operation => (
        <button
          key={operation.name}
          disabled={!areOperationsEnabled}
          data-testid={mockActionButton}
          onClick={() => selectOperation(operation)}
        >
          {operation.name}
        </button>
      ))}
    </>
  );
});

jest.mock('./hooks/use-get-containers-resource-state');
const mockUseGetContainersResourceState = useGetContainersResourceState as jest.Mock;

jest.mock('./components/table-bulk-container-serials');
const mockTableBulkContainerSerials = TableBulkContainerSerials as jest.Mock;
const mockSelectInvalidSerialsDataTestId = 'mock-select-invalid-serials';
const mockSelectValidSerialsDataTestId = 'mock-select-valid-serials';
const mockEditSerialDataTestId = 'mock-edit-serial';
mockTableBulkContainerSerials.mockImplementation(({ onSerialChanged, onSelectedSerialsChanged }) => (
  <>
    <div
      data-testid={mockSelectInvalidSerialsDataTestId}
      onClick={() => onSelectedSerialsChanged(['xyz', 'P900-0008480B:L78A-EI4O-VG'])}
    />
    <div
      data-testid={mockSelectValidSerialsDataTestId}
      onClick={() => onSelectedSerialsChanged(['P900-0008480B:L78A-EI4O-VG'])}
    />
    <div data-testid={mockEditSerialDataTestId} onClick={() => onSerialChanged('xyz', 'P900-0008480B:R9R6-WY5F-5W')} />
  </>
));

jest.mock('./components/dialog-add-container-serial-numbers');
const mockDialogAddContainerSerialNumberss = DialogAddContainerSerialNumbers as jest.Mock;
const mockSerialNumbersDialogDataTestId = 'mock-serial-numbers-dialog';
mockDialogAddContainerSerialNumberss.mockImplementation(() => (
  <div data-testid={mockSerialNumbersDialogDataTestId}>mock serial numbers dialog</div>
));

jest.mock('./components/dialog-perform-action');
const mockDialogPerformAction = DialogPerformAction as jest.Mock;
const mockPeformActionsDataTestId = 'mock-perform-action';
mockDialogPerformAction.mockImplementation(({ onActionComplete }) => (
  <div>
    mock perform actions dialog
    <button data-testid={mockPeformActionsDataTestId} onClick={() => onActionComplete()}>
      mock perform action
    </button>
  </div>
));

jest.mock('./components/dialog-action-results');
const mockDialogActionResults = DialogActionResults as jest.Mock;
const mockResultsDialogDataTestId = 'mock-close-action-results-dialog';
mockDialogActionResults.mockImplementation(({ onClose }) => (
  <div>
    mock show results dialog
    <button data-testid={mockResultsDialogDataTestId} onClick={() => onClose()}>
      mock close results dialog
    </button>
  </div>
));

describe('BulkActionsPage', () => {
  afterEach(() => {
    mockOperations.mockClear();
    mockUseGetContainersResourceState.mockClear();
    mockTableBulkContainerSerials.mockClear();
    mockDialogAddContainerSerialNumberss.mockClear();
    mockDialogPerformAction.mockClear();
    mockDialogActionResults.mockClear();
  });

  function renderBulkActionsPage(mockResourceStates: ProdResources.ResourceState[], queryParametersString?: string) {
    const mockFetch = jest
      .fn()
      .mockImplementation((dedupedNewSerials, handleSuccess) => handleSuccess(mockResourceStates));
    mockUseGetContainersResourceState.mockReturnValue({
      isLoading: false,
      fetch: mockFetch,
    });

    const history = createMemoryHistory({
      initialEntries: [`bulk-actions?${queryParametersString}`],
    });

    const result = render(
      <Router history={history}>
        <BulkActionsPage />
      </Router>
    );

    return { ...result, mockFetch };
  }

  it('sets initial serial numbers from query parameters - ignoring dups - displays results in table', () => {
    const mockResourceState = mockContainersResourceState[0];
    const mockResourceStates: ProdResources.ResourceState[] = [mockResourceState];

    renderBulkActionsPage(mockResourceStates, 'serials[]=xyz&serials[]=P900-0008480B%3AL78A-EI4O-VG&serials[]=xyz');

    const expectedContainers: Container[] = [
      {
        isSelected: false,
        serial: 'xyz',
        serialStatus: SerialStatus.invalidSerial,
        resourceState: undefined,
      },
      {
        isSelected: false,
        serial: mockResourceState.containerObj.serial,
        serialStatus: SerialStatus.valid,
        resourceState: mockResourceState,
      },
    ];

    expect(mockTableBulkContainerSerials).toHaveBeenLastCalledWith(
      expect.objectContaining({ containers: expectedContainers }),
      {}
    );
  });

  it('opens dialog to add serials number when clicking "+ serials" button', () => {
    const { queryByTestId } = renderBulkActionsPage([]);

    expect(queryByTestId(mockSerialNumbersDialogDataTestId)).not.toBeInTheDocument();

    queryByTestId(dataTestIds.add).click();

    expect(queryByTestId(mockSerialNumbersDialogDataTestId)).toBeInTheDocument();
  });

  it('displays number of valid and invalid serials in header', () => {
    const mockResourceStates: ProdResources.ResourceState[] = mockContainersResourceState;

    const { queryByTestId } = renderBulkActionsPage(
      mockResourceStates,
      'serials[]=xyz&serials[]=P900-0008480B%3AL78A-EI4O-VG&serials[]=P900-0008480B%3AR9R6-WY5F-5W'
    );

    // two serials are valid and one is invalid.
    expect(queryByTestId(dataTestIds.validSerials)).toHaveTextContent('2');
    expect(queryByTestId(dataTestIds.invalidSerials)).toHaveTextContent('1');
  });

  it('enables "x serials" button and actions buttons when valid serials are selected', () => {
    const mockResourceStates: ProdResources.ResourceState[] = mockContainersResourceState;

    const { queryByTestId } = renderBulkActionsPage(
      mockResourceStates,
      'serials[]=xyz&serials[]=P900-0008480B%3AL78A-EI4O-VG&serials[]=P900-0008480B%3AR9R6-WY5F-5W'
    );

    expect(queryByTestId(dataTestIds.remove)).toBeDisabled();

    queryByTestId(mockSelectValidSerialsDataTestId).click();

    // enabled because all selected serials are valid.
    expect(queryByTestId(dataTestIds.remove)).toBeEnabled();
  });

  it('disables action buttons if any selected serial are invalid', () => {
    const mockResourceStates: ProdResources.ResourceState[] = mockContainersResourceState;

    const { queryByTestId, queryAllByTestId } = renderBulkActionsPage(
      mockResourceStates,
      'serials[]=xyz&serials[]=P900-0008480B%3AL78A-EI4O-VG&serials[]=P900-0008480B%3AR9R6-WY5F-5W'
    );

    expect(queryByTestId(dataTestIds.remove)).toBeDisabled();
    queryAllByTestId(mockActionButton).forEach(el => expect(el).toBeDisabled());

    queryByTestId(mockSelectInvalidSerialsDataTestId).click();

    expect(queryByTestId(dataTestIds.remove)).toBeEnabled();
    // disabled because selection includes an invalid serial
    queryAllByTestId(mockActionButton).forEach(el => expect(el).toBeDisabled());
  });

  it('opens dialog to run action when an action is selected and shows results dialog after action is complete', () => {
    const mockResourceStates: ProdResources.ResourceState[] = mockContainersResourceState;

    const { queryByTestId, queryAllByTestId } = renderBulkActionsPage(
      mockResourceStates,
      'serials[]=xyz&serials[]=P900-0008480B%3AL78A-EI4O-VG&serials[]=P900-0008480B%3AR9R6-WY5F-5W'
    );

    // no action dialog or results dialog should be in the document
    expect(queryByTestId(mockPeformActionsDataTestId)).not.toBeInTheDocument();
    expect(queryByTestId(mockResultsDialogDataTestId)).not.toBeInTheDocument();

    queryByTestId(mockSelectValidSerialsDataTestId).click();

    // click an action button
    queryAllByTestId(mockActionButton)[0].click();

    // should open dialog perform action
    expect(queryByTestId(mockPeformActionsDataTestId)).toBeInTheDocument();

    // fake submit to run the action
    queryByTestId(mockPeformActionsDataTestId).click();

    // should close the perform action dialog and open results dialog
    expect(queryByTestId(mockPeformActionsDataTestId)).not.toBeInTheDocument();
    expect(queryByTestId(mockResultsDialogDataTestId)).toBeInTheDocument();

    // fake close the results dialog
    queryByTestId(mockResultsDialogDataTestId).click();

    // results dialog should no longer be visible.
    expect(queryByTestId(mockResultsDialogDataTestId)).not.toBeInTheDocument();
  });

  it('refreshes resource states for containers when results dialog is closed', () => {
    const mockResourceStates: ProdResources.ResourceState[] = mockContainersResourceState;

    const mockInitialState = mockResourceStates[0];

    const refreshState = cloneDeep(mockInitialState);
    refreshState.containerLabels = [];

    // first fetch will get initial state,
    // 2nd fetch will be done when refreshing container resources states
    const mockFetch = jest
      .fn()
      .mockImplementationOnce((dedupedNewSerials, handleSuccess) => handleSuccess([mockInitialState]))
      .mockImplementationOnce((dedupedNewSerials, handleSuccess) => handleSuccess([refreshState]));
    mockUseGetContainersResourceState.mockReturnValue({
      isLoading: false,
      fetch: mockFetch,
    });

    const queryParametersString = 'serials[]=P900-0008480B%3AL78A-EI4O-VG';

    const history = createMemoryHistory({
      initialEntries: [`bulk-actions?${queryParametersString}`],
    });

    const { queryByTestId, queryAllByTestId } = render(
      <Router history={history}>
        <BulkActionsPage />
      </Router>
    );

    const expectedContainers: Container[] = [
      {
        isSelected: false,
        serial: mockInitialState.containerObj.serial,
        serialStatus: SerialStatus.valid,
        resourceState: mockInitialState,
      },
    ];
    expect(mockTableBulkContainerSerials).toHaveBeenLastCalledWith(
      expect.objectContaining({ containers: expectedContainers }),
      {}
    );

    // select action in the table and click action button
    queryByTestId(mockSelectValidSerialsDataTestId).click();
    queryAllByTestId(mockActionButton)[0].click();

    // perform action dialog should be open, then exec action
    expect(queryByTestId(mockPeformActionsDataTestId)).toBeInTheDocument();
    queryByTestId(mockPeformActionsDataTestId).click();

    // action results should be open, then close results
    expect(queryByTestId(mockResultsDialogDataTestId)).toBeInTheDocument();
    queryByTestId(mockResultsDialogDataTestId).click();

    // after closing results, expect to see table containing refreshed state.
    const expectedNewContainer: Container[] = [
      {
        isSelected: true,
        serial: refreshState.containerObj.serial,
        serialStatus: SerialStatus.valid,
        resourceState: refreshState,
      },
    ];
    expect(mockTableBulkContainerSerials).toHaveBeenLastCalledWith(
      expect.objectContaining({ containers: expectedNewContainer }),
      {}
    );
  });

  it('removes selected serials when the "x serials" button is selected', () => {
    const mockResourceStates: ProdResources.ResourceState[] = mockContainersResourceState;

    const { queryByTestId } = renderBulkActionsPage(
      mockResourceStates,
      'serials[]=xyz&serials[]=P900-0008480B%3AL78A-EI4O-VG&serials[]=P900-0008480B%3AR9R6-WY5F-5W'
    );

    // should select both 'xyz' and 'P900-0008480B%3AL78A-EI4O-VG'
    queryByTestId(mockSelectInvalidSerialsDataTestId).click();

    expect(queryByTestId(dataTestIds.remove)).toBeEnabled();

    // removes two selected items
    queryByTestId(dataTestIds.remove).click();

    // leaves on only container left after delete: P900-0008480B%3AR9R6-WY5F-5W
    const expectedContainers: Container[] = [
      {
        isSelected: false,
        serial: mockContainersResourceState[1].containerObj.serial,
        serialStatus: SerialStatus.valid,
        resourceState: mockContainersResourceState[1],
      },
    ];
    expect(mockTableBulkContainerSerials).toHaveBeenLastCalledWith(
      expect.objectContaining({ containers: expectedContainers }),
      {}
    );
  });

  it('fetches new resource state and updates table when a serial number is changed/edited', () => {
    const mockResourceStates: ProdResources.ResourceState[] = mockContainersResourceState;
    const mockFetch = jest
      .fn()
      .mockImplementationOnce((dedupedNewSerials, handleSuccess) => handleSuccess([mockResourceStates[0]]))
      .mockImplementationOnce((dedupedNewSerials, handleSuccess) => handleSuccess([mockResourceStates[1]]));
    mockUseGetContainersResourceState.mockReturnValue({
      isLoading: false,
      fetch: mockFetch,
    });

    const queryParametersString = 'serials[]=xyz&serials[]=P900-0008480B%3AL78A-EI4O-VG';

    const history = createMemoryHistory({
      initialEntries: [`bulk-actions?${queryParametersString}`],
    });

    const { queryByTestId } = render(
      <Router history={history}>
        <BulkActionsPage />
      </Router>
    );

    const expectedContainers: Container[] = [
      {
        isSelected: false,
        serial: 'xyz',
        serialStatus: SerialStatus.invalidSerial,
        resourceState: undefined,
      },
      {
        isSelected: false,
        serial: mockResourceStates[0].containerObj.serial,
        serialStatus: SerialStatus.valid,
        resourceState: mockResourceStates[0],
      },
    ];

    expect(mockTableBulkContainerSerials).toHaveBeenLastCalledWith(
      expect.objectContaining({ containers: expectedContainers }),
      {}
    );

    // fake an edit, so that serial xyz is changed to P900-0008480B:R9R6-WY5F-5W
    queryByTestId(mockEditSerialDataTestId).click();

    const expectedContainersAfterEdit: Container[] = [
      {
        isSelected: false,
        serial: mockResourceStates[1].containerObj.serial,
        serialStatus: SerialStatus.valid,
        resourceState: mockResourceStates[1],
      },
      {
        isSelected: false,
        serial: mockResourceStates[0].containerObj.serial,
        serialStatus: SerialStatus.valid,
        resourceState: mockResourceStates[0],
      },
    ];

    expect(mockTableBulkContainerSerials).toHaveBeenLastCalledWith(
      expect.objectContaining({ containers: expectedContainersAfterEdit }),
      {}
    );
  });

  it('calls api to fetch resources states when refresh button is clicked', () => {
    const mockResourceStates: ProdResources.ResourceState[] = mockContainersResourceState;

    const serials = [
      mockContainersResourceState[0].containerObj.serial,
      mockContainersResourceState[1].containerObj.serial,
    ];

    const { queryByTestId, mockFetch } = renderBulkActionsPage(
      mockResourceStates,
      `serials[]=${window.encodeURIComponent(serials[0])}&serials[]=${window.encodeURIComponent(serials[1])}`
    );

    expect(mockFetch).toHaveBeenCalledTimes(1);

    // simulate clicking refresh button
    queryByTestId(dataTestIdsRefreshButton.button).click();

    // call fetch again with the original serials
    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(mockFetch).toHaveBeenLastCalledWith(serials, expect.anything());
  });
});

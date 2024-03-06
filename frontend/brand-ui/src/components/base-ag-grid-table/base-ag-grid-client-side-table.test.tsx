import { GridReadyEvent } from '@ag-grid-community/all-modules';
import { SORT_BY_KEY } from '@plentyag/core/src/ag-grid/helpers';
import { mockUseLocalStorageQueryParams } from '@plentyag/core/src/ag-grid/test-helpers/mock-use-local-storage-query-params';
import { setSortModel } from '@plentyag/core/src/ag-grid/utils';
import { useQueryParam } from '@plentyag/core/src/hooks/use-query-param';
import { render, waitFor } from '@testing-library/react';
import React from 'react';
import { useHistory } from 'react-router-dom';

import { BaseAgGridClientSideTable } from './base-ag-grid-client-side-table';
import { mockAgGridConfig } from './test-helpers/mock-ag-grid-config';

jest.mock('react-router');
const mockUseHistory = useHistory as jest.Mock;
const mockHistoryPush = jest.fn();
mockUseHistory.mockReturnValue({
  location: {
    search: {},
  },
  push: mockHistoryPush,
});

jest.mock('@plentyag/core/src/hooks/use-query-param');
const mockUseQueryParm = useQueryParam as jest.Mock;
mockUseQueryParm.mockReturnValue(new URLSearchParams(''));

const { mockSetLocalStorageValue } = mockUseLocalStorageQueryParams();

describe('BaseAgGridClientSideTable', () => {
  beforeEach(() => {
    mockSetLocalStorageValue.mockClear();
    mockHistoryPush.mockClear();
  });

  async function renderBaseAgGridClientSideTable(
    persistFilterAndSortModelsInLocalStorage: boolean,
    updateFilterAndSortQueryParameters: boolean
  ) {
    let gridReadyEvent: GridReadyEvent;

    render(
      <BaseAgGridClientSideTable
        onGridReady={(event: GridReadyEvent) => (gridReadyEvent = event)}
        agGridConfig={mockAgGridConfig}
        persistFilterAndSortModelsInLocalStorage={persistFilterAndSortModelsInLocalStorage}
        updateFilterAndSortQueryParameters={updateFilterAndSortQueryParameters}
      />
    );

    await waitFor(() => expect(gridReadyEvent).toBeTruthy());

    let eventCalled = false;
    gridReadyEvent.api.addEventListener('sortChanged', () => {
      eventCalled = true;
    });

    const sortModel = { colId: 'col1', sort: 'asc' };
    setSortModel([sortModel], gridReadyEvent.columnApi);

    // events are async so wait until event is called before going on.
    await waitFor(() => expect(eventCalled).toBeTruthy());

    return sortModel;
  }

  it('does not persist filter and sort model to localStorage', async () => {
    await renderBaseAgGridClientSideTable(false, true);

    expect(mockSetLocalStorageValue).not.toHaveBeenCalled();
  });

  it('persists filter and sort model to localStorage', async () => {
    const sortModel = await renderBaseAgGridClientSideTable(true, true);

    expect(mockSetLocalStorageValue).toHaveBeenCalledWith({ order: sortModel.sort, [SORT_BY_KEY]: sortModel.colId });
  });

  it('update query parameters when fitler or sort changes', async () => {
    await renderBaseAgGridClientSideTable(true, true);

    expect(mockHistoryPush).toHaveBeenCalledWith({ search: '?sortBy=col1&order=asc' });
  });

  it('does not update query parameters when fitler or sort changes', async () => {
    await renderBaseAgGridClientSideTable(true, false);

    expect(mockHistoryPush).not.toHaveBeenCalled();
  });
});

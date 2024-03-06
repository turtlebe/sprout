import { GridReadyEvent } from '@ag-grid-community/all-modules';
import {
  getFilterModelFromQueryParams,
  getSortModelFromQueryParams,
  SORT_BY_KEY,
} from '@plentyag/core/src/ag-grid/helpers';
import { mockUseLocalStorageQueryParams } from '@plentyag/core/src/ag-grid/test-helpers/mock-use-local-storage-query-params';
import { useQueryParam } from '@plentyag/core/src/hooks/use-query-param';
import { render, waitFor } from '@testing-library/react';
import React from 'react';

import { BaseAgGridTable } from './base-ag-grid-table';
import { mockAgGridConfig } from './test-helpers';

jest.mock('@plentyag/core/src/ag-grid/helpers');
const mockGetFilterModelFromQueryParams = getFilterModelFromQueryParams as jest.Mock;
const mockGetSortModelFromQueryParams = getSortModelFromQueryParams as jest.Mock;

jest.mock('@plentyag/core/src/hooks/use-query-param');
const mockUseQueryParm = useQueryParam as jest.Mock;
mockUseQueryParm.mockReturnValue(new URLSearchParams(''));

const { mockLocalStorageValue } = mockUseLocalStorageQueryParams({ col2: '1' });

describe('BaseAgGridTable', () => {
  async function renderBaseAgGridTable(
    persistFilterAndSortModelsInLocalStorage: boolean,
    enableAutoSizeAllColumns = true
  ) {
    let gridReadyEvent: GridReadyEvent;
    render(
      <BaseAgGridTable
        onGridReady={(event: GridReadyEvent) => (gridReadyEvent = event)}
        agGridConfig={mockAgGridConfig}
        enableAutoSizeAllColumns={enableAutoSizeAllColumns}
        persistFilterAndSortModelsInLocalStorage={persistFilterAndSortModelsInLocalStorage}
      />
    );
    await waitFor(() => expect(gridReadyEvent).toBeTruthy());

    return gridReadyEvent;
  }

  it('does not restore filter and sort models from localstorage', async () => {
    await renderBaseAgGridTable(false);

    const emptyUrlSearchParams = new URLSearchParams('');

    expect(mockGetFilterModelFromQueryParams).toHaveBeenLastCalledWith(
      emptyUrlSearchParams,
      mockAgGridConfig.columnDefs
    );
    expect(mockGetSortModelFromQueryParams).toHaveBeenLastCalledWith(emptyUrlSearchParams, mockAgGridConfig.columnDefs);
  });

  it('restores filter and sort models from localstorage', async () => {
    await renderBaseAgGridTable(true);

    const urlSearchParams = new URLSearchParams(mockLocalStorageValue);

    expect(mockGetFilterModelFromQueryParams).toHaveBeenLastCalledWith(urlSearchParams, mockAgGridConfig.columnDefs);
    expect(mockGetSortModelFromQueryParams).toHaveBeenLastCalledWith(urlSearchParams, mockAgGridConfig.columnDefs);
  });

  it('restores filter and sort models from query parameters', async () => {
    const mockQueryParams = new URLSearchParams({ order: 'asc', [SORT_BY_KEY]: 'col1', col2: '1' });
    mockUseQueryParm.mockReturnValue(mockQueryParams);

    await renderBaseAgGridTable(true);

    expect(mockGetFilterModelFromQueryParams).toHaveBeenLastCalledWith(mockQueryParams, mockAgGridConfig.columnDefs);
    expect(mockGetSortModelFromQueryParams).toHaveBeenLastCalledWith(mockQueryParams, mockAgGridConfig.columnDefs);
  });

  it('resizes columns', async () => {
    const gridReadyEvent = await renderBaseAgGridTable(true);
    const spy = jest.spyOn(gridReadyEvent.columnApi, 'autoSizeAllColumns');

    // update row data to force resizeAllColumns being called.
    gridReadyEvent.api.setRowData(mockAgGridConfig.rowData);

    await waitFor(() => expect(spy).toHaveBeenCalled());
  });

  it('does not resize columns', async () => {
    const gridReadyEvent = await renderBaseAgGridTable(true, false);
    const spy = jest.spyOn(gridReadyEvent.columnApi, 'autoSizeAllColumns');

    // update row data to force resizeAllColumns being called.
    gridReadyEvent.api.setRowData(mockAgGridConfig.rowData);

    await waitFor(() => expect(spy).not.toHaveBeenCalled());
  });
});

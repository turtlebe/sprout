import { GridReadyEvent } from '@ag-grid-community/all-modules';
import { handleAgGridCsvDownload } from '@plentyag/core/src/ag-grid/utils';
import { usePostRequest } from '@plentyag/core/src/hooks';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { render } from '@testing-library/react';
import React from 'react';

import { BaseAgGridInfiniteTable } from '../base-ag-grid-table';

import { ButtonCsvDownloadInfinite, dataTestIdsButtonCsvDownloadInfinite as dataTestIds } from '.';

import { CsvDownload } from './components/csv-download';

jest.mock('@plentyag/core/src/ag-grid/utils/handle-ag-grid-csv-download');
jest.mock('@plentyag/core/src/hooks/use-axios');
jest.mock('./components/csv-download');

const mockUsePostRequest = usePostRequest as jest.Mock;
const mockHandleAgGridCsvDownload = handleAgGridCsvDownload as jest.Mock;
const MockCsvDownload = CsvDownload as jest.Mock;

const response = [
  { fieldA: 'valueA1', fieldB: { nested: 'valueB1' } },
  { fieldA: 'valueA2', fieldB: { nested: 'valueB2' } },
];

const agGridConfig: BaseAgGridInfiniteTable['agGridConfig'] = {
  columnDefs: [
    { field: 'fieldA', colId: 'fieldA' },
    { field: 'fieldB', colId: 'fieldB', valueFormatter: params => params.data.fieldB.nested },
  ],
};

describe('ButtonCsvDownloadInfinite', () => {
  beforeEach(() => {
    mockHandleAgGridCsvDownload.mockRestore();
    mockUsePostRequest.mockRestore();
    MockCsvDownload.mockRestore();
    MockCsvDownload.mockImplementation(() => <div />);
  });

  it("parses the unpaginate's response with the ag-grid config", async () => {
    mockUsePostRequest.mockReturnValue({
      makeRequest: jest.fn().mockImplementation(({ onSuccess }) => onSuccess(response)),
    });
    const gridReadyEvent: GridReadyEvent = {
      type: undefined,
      api: {
        getSelectedRows: () => [],
        getSortModel: () => [],
        getFilterModel: () => ({}),
        getColumnDefs: () => agGridConfig.columnDefs,
      },
      columnApi: {
        getAllColumns: () => agGridConfig.columnDefs.map(colDef => ({ getColDef: () => colDef })),
      },
    } as unknown as GridReadyEvent;

    const { queryByTestId } = render(
      <ButtonCsvDownloadInfinite
        serviceName="farm-def-service"
        operation="search-devices-by"
        fileNamePrefix="devices"
        agGridConfig={agGridConfig}
        gridReadyEvent={gridReadyEvent}
      />
    );

    await actAndAwait(() => queryByTestId(dataTestIds.button).click());

    expect(MockCsvDownload).toHaveBeenCalledWith(
      expect.objectContaining({
        data: [
          { fieldA: 'valueA1', fieldB: 'valueB1' },
          { fieldA: 'valueA2', fieldB: 'valueB2' },
        ],
      }),
      {}
    );
    expect(mockHandleAgGridCsvDownload).not.toHaveBeenCalled();
  });

  it('does not call makeRequest when at least one row is selected', async () => {
    const makeRequest = jest.fn();
    mockUsePostRequest.mockReturnValue({ makeRequest });
    const gridReadyEvent: GridReadyEvent = {
      type: undefined,
      api: {
        getSelectedRows: () => [{}],
        getSortModel: () => [],
        getFilterModel: () => ({}),
        getColumnDefs: () => agGridConfig.columnDefs,
      },
      columnApi: {
        getAllColumns: () => agGridConfig.columnDefs.map(colDef => ({ getColDef: () => colDef })),
      },
    } as unknown as GridReadyEvent;

    const { queryByTestId } = render(
      <ButtonCsvDownloadInfinite
        serviceName="farm-def-service"
        operation="search-devices-by"
        fileNamePrefix="devices"
        agGridConfig={agGridConfig}
        gridReadyEvent={gridReadyEvent}
      />
    );

    await actAndAwait(() => queryByTestId(dataTestIds.button).click());

    expect(MockCsvDownload).not.toHaveBeenCalled();
    expect(mockHandleAgGridCsvDownload).toHaveBeenCalled();
  });
});

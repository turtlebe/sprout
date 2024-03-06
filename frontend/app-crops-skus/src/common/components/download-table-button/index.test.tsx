import { handleAgGridCsvDownload } from '@plentyag/core/src/ag-grid/utils';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsDownloadButton as dataTestIds, DownloadTableButton } from '.';

jest.mock('@plentyag/core/src/ag-grid/utils/handle-ag-grid-csv-download');
const mockHandleAgGridCsvDownload = handleAgGridCsvDownload as jest.Mock;

const mockGridReadyEvent = {
  type: 'test-grid-ready-event',
  api: undefined,
  columnApi: undefined,
};

describe('DownloadButton', () => {
  it('disables download button', () => {
    const { queryByTestId } = render(
      <DownloadTableButton tableName="skus" gridReadyEvent={mockGridReadyEvent} disabled={true} />
    );
    expect(queryByTestId(dataTestIds.downloadButton)).toBeDisabled();
  });

  it('calls "handleAgGridCsvDownload" when download button clicked', async () => {
    const tableName = 'skus';
    const columnsToDownload = ['xyz'];
    const { queryByTestId } = render(
      <DownloadTableButton
        tableName={tableName}
        gridReadyEvent={mockGridReadyEvent}
        disabled={false}
        columnsToDownload={columnsToDownload}
      />
    );

    expect(queryByTestId(dataTestIds.downloadButton)).not.toBeDisabled();

    expect(mockHandleAgGridCsvDownload).not.toHaveBeenCalledWith();

    const downloadButton = queryByTestId(dataTestIds.downloadButton);
    expect(downloadButton).toBeEnabled();

    await actAndAwait(() => fireEvent.click(downloadButton));

    expect(mockHandleAgGridCsvDownload).toHaveBeenCalledWith({
      gridReadyEvent: mockGridReadyEvent,
      fileNamePrefix: `${tableName}-table`,
      columnsToDownload: columnsToDownload,
    });
  });
});

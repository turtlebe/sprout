import { handleAgGridCsvDownload } from '@plentyag/core/src/ag-grid/utils/handle-ag-grid-csv-download';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';

jest.mock('@plentyag/core/src/ag-grid/utils/handle-ag-grid-csv-download');
const mockHandleAgGridCsvDownload = handleAgGridCsvDownload as jest.Mock;

import { dataTestIdsDownloadReportButton as dataTestIds, DownloadReportButton } from '.';

describe('DownloadReportButton', () => {
  let mockGridReadyEvent;

  beforeEach(() => {
    mockGridReadyEvent = { api: { hi: 'bye' } } as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders button and can call AG Grid download handler with clicked', () => {
    // ACT 1
    const { queryByTestId } = render(<DownloadReportButton tableName="test" gridReadyEvent={mockGridReadyEvent} />);

    // ASSERT 1
    expect(queryByTestId(dataTestIds.downloadButton)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.downloadButton)).not.toBeDisabled();

    // ACT 2
    fireEvent.click(queryByTestId(dataTestIds.downloadButton));

    // ASSERT 2
    expect(mockHandleAgGridCsvDownload).toBeCalledWith({
      gridReadyEvent: mockGridReadyEvent,
      fileNamePrefix: 'test-report',
    });
  });

  it('renders disabled button when set', () => {
    // ACT
    const { queryByTestId } = render(
      <DownloadReportButton tableName="test" gridReadyEvent={mockGridReadyEvent} disabled />
    );

    // ASSERT
    expect(queryByTestId(dataTestIds.downloadButton)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.downloadButton)).toBeDisabled();
  });
});

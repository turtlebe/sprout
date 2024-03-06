import { GridReadyEvent } from '@ag-grid-community/all-modules';

import { mockLocation } from '../../test-helpers';

import { handleAgGridCsvDownload } from '.';

const mockExportDataAsCsv = jest.fn();
const mockGridReadyEvent: GridReadyEvent = {
  // @ts-ignore - since we only need porition of object for testing.
  api: {
    exportDataAsCsv: mockExportDataAsCsv,
  },
};

describe('handleAgGridCsvDownload', () => {
  beforeEach(() => {
    mockExportDataAsCsv.mockClear();
  });

  it('uses default suffix - which comes from window.location.search', () => {
    const restore = mockLocation({ search: '?hello-world=1' });

    handleAgGridCsvDownload({
      gridReadyEvent: mockGridReadyEvent,
      fileNamePrefix: 'testPrefix',
    });
    expect(mockExportDataAsCsv).toHaveBeenCalledWith(
      expect.objectContaining({
        fileName: 'testPrefix-hello-world=1.csv',
      })
    );

    restore();
  });

  it('uses supplied suffix', () => {
    handleAgGridCsvDownload({
      gridReadyEvent: mockGridReadyEvent,
      fileNamePrefix: 'testPrefix',
      fileNameSuffix: 'testSuffix',
    });
    expect(mockExportDataAsCsv).toHaveBeenCalledWith(
      expect.objectContaining({
        fileName: 'testPrefixtestSuffix.csv',
      })
    );
  });
});

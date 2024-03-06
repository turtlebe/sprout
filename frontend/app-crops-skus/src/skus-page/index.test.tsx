import { BaseAgGridClientSideTable } from '@plentyag/brand-ui/src/components';
import { render } from '@testing-library/react';
import React from 'react';

import { CropsSkusBreadcrumbs, DownloadTableButton, EditSkuButton } from '../common/components';
import { mockSkus } from '../common/test-helpers';

import { SkusPage } from '.';

import { useAgGridConfig, useLoadSkus } from './hooks';
import { skusTableCols } from './utils';

jest.mock('./hooks/use-load-skus');
const mockUseLoadSkus = useLoadSkus as jest.Mock;
mockUseLoadSkus.mockReturnValue({
  isValidating: false,
  data: mockSkus,
});

jest.mock('./hooks/use-ag-grid-config');
const mockUseAgGridConfig = useAgGridConfig as jest.Mock;
// note: tests here only need columns defs.
const mockAgGridConfig = {
  columnDefs: [
    {
      colId: '',
    },
    {
      colId: skusTableCols.packageImagery.colId,
    },
    {
      colId: skusTableCols.productName.colId,
    },
  ],
};
mockUseAgGridConfig.mockReturnValue(mockAgGridConfig);

jest.mock('../common/components');
const mockDownloadTableButton = DownloadTableButton as jest.Mock;
mockDownloadTableButton.mockReturnValue(<div />);

const mockCropsSkusBreadcrumbs = CropsSkusBreadcrumbs as jest.Mock;
mockCropsSkusBreadcrumbs.mockReturnValue(<div />);

const mockEditSkuButton = EditSkuButton as jest.Mock;
mockEditSkuButton.mockReturnValue(<div />);

const selectedSku = mockSkus[0];
jest.mock('@plentyag/brand-ui/src/components/base-ag-grid-table/base-ag-grid-client-side-table');
const mockBaseAgGridClientSideTable = BaseAgGridClientSideTable as jest.Mock;
mockBaseAgGridClientSideTable.mockImplementation(({ onSelectionChanged, onGridReady }) => {
  const event = {
    api: {
      getSelectedRows: () => [{ name: selectedSku.name }],
    },
  };
  const handleFakeSelect = () => {
    onSelectionChanged(event);
  };
  React.useEffect(() => {
    onGridReady(event);
  }, []);
  return <button data-testid="fake-table-select" onClick={handleFakeSelect} />;
});

describe('SkusPage', () => {
  it('downloads all columns except package imagery', () => {
    render(<SkusPage />);
    expect(mockDownloadTableButton).toHaveBeenCalledWith(
      {
        tableName: 'skus',
        columnsToDownload: expect.not.arrayContaining([skusTableCols.packageImagery.colId]),
        gridReadyEvent: null,
        disabled: false,
      },
      expect.anything()
    );
  });

  it('calls "EditSkuButton" with selected sku', () => {
    const { queryByTestId } = render(<SkusPage />);

    mockEditSkuButton.mockClear();
    queryByTestId('fake-table-select').click();

    expect(mockEditSkuButton).toHaveBeenCalledTimes(2);
    expect(mockEditSkuButton).toHaveBeenNthCalledWith(
      1,
      {
        sku: selectedSku,
        skus: mockSkus,
        isUpdating: true,
        onEditSuccess: expect.anything(),
      },
      expect.anything()
    );
    expect(mockEditSkuButton).toHaveBeenNthCalledWith(
      2,
      {
        sku: selectedSku,
        skus: mockSkus,
        isUpdating: false,
        onEditSuccess: expect.anything(),
      },
      expect.anything()
    );
  });
});

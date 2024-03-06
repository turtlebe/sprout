import { BaseAgGridClientSideTable } from '@plentyag/brand-ui/src/components';
import { render } from '@testing-library/react';
import React from 'react';

import { CropsSkusBreadcrumbs, DownloadTableButton, EditCropButton } from '../common/components';
import { mockCrops } from '../common/test-helpers';

import { CropsPage } from '.';

import { useLoadCrops } from './hooks';

jest.mock('./hooks/use-load-crops');
const mockUseLoadCrops = useLoadCrops as jest.Mock;
mockUseLoadCrops.mockReturnValue({
  isValidating: false,
  data: mockCrops,
});

jest.mock('../common/components');
const mockDownloadTableButton = DownloadTableButton as jest.Mock;
mockDownloadTableButton.mockReturnValue(<div />);

const mockCropsSkusBreadcrumbs = CropsSkusBreadcrumbs as jest.Mock;
mockCropsSkusBreadcrumbs.mockReturnValue(<div />);

const mockEditCropButton = EditCropButton as jest.Mock;
mockEditCropButton.mockReturnValue(<div />);

const selectedCrop = mockCrops[0];
jest.mock('@plentyag/brand-ui/src/components/base-ag-grid-table/base-ag-grid-client-side-table');
const mockBaseAgGridClientSideTable = BaseAgGridClientSideTable as jest.Mock;
mockBaseAgGridClientSideTable.mockImplementation(({ onSelectionChanged, onGridReady }) => {
  const event = {
    api: {
      getSelectedRows: () => [{ name: selectedCrop.name }],
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

describe('CropsPage', () => {
  it('calls "EditCropButton" with selected crop', () => {
    const { queryByTestId } = render(<CropsPage />);

    mockEditCropButton.mockClear();
    queryByTestId('fake-table-select').click();

    expect(mockEditCropButton).toHaveBeenCalledTimes(2);
    expect(mockEditCropButton).toHaveBeenNthCalledWith(
      1,
      {
        crop: selectedCrop,
        crops: mockCrops,
        isUpdating: true,
        onEditSuccess: expect.anything(),
      },
      expect.anything()
    );
    expect(mockEditCropButton).toHaveBeenNthCalledWith(
      2,
      {
        crop: selectedCrop,
        crops: mockCrops,
        isUpdating: false,
        onEditSuccess: expect.anything(),
      },
      expect.anything()
    );
  });
});

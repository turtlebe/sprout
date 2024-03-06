import { changeTextField } from '@plentyag/brand-ui/src/test-helpers';
import { handleAgGridCsvDownload } from '@plentyag/core/src/ag-grid/utils';
import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { useQueryParam } from '@plentyag/core/src/hooks/use-query-param';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { DateTime } from 'luxon';
import React from 'react';
import { useHistory } from 'react-router-dom';

import { useLoadWorkbinInstances } from '../../hooks';
import { mockWorkbinInstanceData } from '../../test-helpers';

import { dataTestIds, WorkbinInstancesTable } from '.';

const mockFarm = 'sites/SSF2/farms/Tigris';
const mockRole = 'Grower';
const mockLoadData = jest.fn();
const mockClearData = jest.fn();

mockCurrentUser({ currentFarmDefPath: mockFarm });

jest.mock('react-router');
const mockUseHistory = useHistory as jest.Mock;
mockUseHistory.mockReturnValue({
  location: {
    search: {},
  },
  push: () => {},
});

jest.mock('@plentyag/core/src/hooks/use-query-param');
const mockUseQueryParm = useQueryParam as jest.Mock;
mockUseQueryParm.mockReturnValue(new URLSearchParams(''));

jest.mock('@plentyag/core/src/ag-grid/utils/handle-ag-grid-csv-download');
const mockHandleAgGridCsvDownload = handleAgGridCsvDownload as jest.Mock;

jest.mock('../../hooks/use-load-workbin-instances');
const mockUseLoadWorkbinInstances = useLoadWorkbinInstances as jest.Mock;

describe('WorkbinInstancesTable', () => {
  beforeEach(() => {
    mockUseLoadWorkbinInstances.mockReturnValue({
      isLoading: false,
      unifiedWorkbinInstanceData: mockWorkbinInstanceData,
      loadData: mockLoadData,
      clearData: mockClearData,
    });
  });

  afterEach(() => {
    mockLoadData.mockReset();
    mockClearData.mockReset();
    jest.useRealTimers();
  });

  function expectMockLoadToHaveBeenCalled(farm: string, workspace: string) {
    expect(mockLoadData).toHaveBeenCalledWith({
      farm: farm,
      workbin: workspace,
      statuses: ['COMPLETED', 'SKIPPED'],
      createdAt: DateTime.now().startOf('day').toISO(),
      createdAtBefore: DateTime.now().endOf('day').toISO(),
    });
  }

  it('loads table with data present', () => {
    render(<WorkbinInstancesTable roleName={mockRole} />);
    expectMockLoadToHaveBeenCalled(mockFarm, mockRole);
  });

  it('refreshes data when button clicked', async () => {
    const { queryByTestId } = render(<WorkbinInstancesTable roleName={mockRole} />);
    expectMockLoadToHaveBeenCalled(mockFarm, mockRole);

    await waitFor(() => expect(queryByTestId(dataTestIds.refreshButton)).toBeEnabled());
    const button = queryByTestId(dataTestIds.refreshButton);
    fireEvent.click(button);
    expect(mockClearData).toHaveBeenCalled();
    expectMockLoadToHaveBeenCalled(mockFarm, mockRole);
  });

  it('refreshes data when date is changed', async () => {
    const { queryByTestId } = render(<WorkbinInstancesTable roleName={mockRole} />);
    expectMockLoadToHaveBeenCalled(mockFarm, mockRole);

    await waitFor(() => expect(queryByTestId(dataTestIds.dateSelectorBox)).toBeInTheDocument());
    changeTextField(dataTestIds.dateSelectorBox, '05-12-2020');
    expect(mockClearData).toHaveBeenCalled();
    expectMockLoadToHaveBeenCalled(mockFarm, mockRole);
  });

  it('disables download button when no workbin data is available', () => {
    mockUseLoadWorkbinInstances.mockReturnValue({
      isLoading: false,
      unifiedWorkbinInstanceData: [],
      loadData: mockLoadData,
      clearData: mockClearData,
    });

    const { queryByTestId } = render(<WorkbinInstancesTable roleName={mockRole} />);
    expect(queryByTestId(dataTestIds.downloadButton)).toBeDisabled();
  });

  it('calls "handleAgGridCsvDownload" when download button clicked', async () => {
    const { queryByTestId } = render(<WorkbinInstancesTable roleName={mockRole} />);

    expect(mockHandleAgGridCsvDownload).not.toHaveBeenCalled();

    const downloadButton = queryByTestId(dataTestIds.downloadButton);
    expect(downloadButton).toBeEnabled();
    fireEvent.click(downloadButton);

    await waitFor(() => expect(mockHandleAgGridCsvDownload).toHaveBeenCalled());
  });

  it('refreshes data when refresh is changed', () => {
    const { container, rerender } = render(<WorkbinInstancesTable roleName={mockRole} refresh={1} />);

    expect(container).not.toBeNull();

    expect(mockClearData).toHaveBeenCalled();
    expectMockLoadToHaveBeenCalled(mockFarm, mockRole);

    // re-render
    rerender(<WorkbinInstancesTable roleName={mockRole} refresh={2} />);

    expect(mockClearData).toHaveBeenCalledTimes(2);
    expect(mockLoadData).toHaveBeenCalledTimes(2);
  });
});

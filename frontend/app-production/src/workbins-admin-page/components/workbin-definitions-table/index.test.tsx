import { handleAgGridCsvDownload } from '@plentyag/core/src/ag-grid/utils';
import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { useQueryParam } from '@plentyag/core/src/hooks/use-query-param';
import { fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';
import { useHistory } from 'react-router-dom';

import { useGetSelectedTableTaskDefinition } from '../../../common/hooks/use-get-selected-table-task-definition';
import { useGetWorkspaces } from '../../../common/hooks/use-get-workspaces';
import { useLoadWorkbinTaskDefinitions } from '../../../common/hooks/use-load-workbin-task-definitions';
import { useLoadWorkbinTriggers } from '../../../common/hooks/use-load-workbin-triggers';
import { mockWorkbinTaskDefinitionData, mockWorkbinTriggerData } from '../../../common/test-helpers';
import { mockWorkspacesData } from '../../test-helpers';

import { dataTestIdsWorkbinDefinitionsTablePage, WorkbinDefinitionsTable } from '.';

const mockFarm = 'sites/SSF2/farms/Tigris';
const mockLoadData = jest.fn();
const mockClearData = jest.fn();
const mockUpdateSelectedRow = jest.fn();
const mockTriggersLoadData = jest.fn();
const mockTriggersClearData = jest.fn();

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

jest.mock('../../../common/hooks/use-get-workspaces');
const mockUseGetWorkspaces = useGetWorkspaces as jest.Mock;

jest.mock('../../../common/hooks/use-load-workbin-triggers');
const mockUseLoadWorkbinTriggers = useLoadWorkbinTriggers as jest.Mock;

jest.mock('../../../common/hooks/use-load-workbin-task-definitions');
const mockUseLoadWorkbinTaskDefinitions = useLoadWorkbinTaskDefinitions as jest.Mock;

jest.mock('../../../common/hooks/use-get-selected-table-task-definition');
const mockUseGetSelectedTableTaskDefinition = useGetSelectedTableTaskDefinition as jest.Mock;

describe('WorkbinDefinitionsTable', () => {
  beforeEach(() => {
    mockUseGetWorkspaces.mockReturnValue({ workspaces: mockWorkspacesData, isLoading: false });

    mockUseLoadWorkbinTaskDefinitions.mockReturnValue({
      isLoading: false,
      workbinTaskDefinitions: mockWorkbinTaskDefinitionData,
      loadData: mockLoadData,
      clearData: mockClearData,
    });

    mockUseLoadWorkbinTriggers.mockReturnValue({
      clearData: mockTriggersClearData,
      loadData: mockTriggersLoadData,
      workbinTaskTriggers: mockWorkbinTriggerData,
      isLoading: false,
    });

    mockUseGetSelectedTableTaskDefinition.mockReturnValue({
      selectedTaskDefinition: undefined,
      updateSelectedRow: mockUpdateSelectedRow,
    });
  });

  afterEach(() => {
    mockLoadData.mockReset();
    mockClearData.mockReset();
    mockTriggersClearData.mockReset();
    mockTriggersLoadData.mockReset();
    jest.useRealTimers();
  });

  function expectMockLoadToHaveBeenCalled(farm: string) {
    expect(mockLoadData).toHaveBeenCalledWith({
      farm: farm,
    });
  }

  it('loads table with data present', () => {
    render(<WorkbinDefinitionsTable />);
    expectMockLoadToHaveBeenCalled(mockFarm);
  });

  it('refreshes data when refresh button clicked', async () => {
    const { queryByTestId } = render(<WorkbinDefinitionsTable />);
    expectMockLoadToHaveBeenCalled(mockFarm);

    await waitFor(() => expect(queryByTestId(dataTestIdsWorkbinDefinitionsTablePage.refreshButton)).toBeEnabled());
    const button = queryByTestId(dataTestIdsWorkbinDefinitionsTablePage.refreshButton);
    fireEvent.click(button);
    expect(mockClearData).toHaveBeenCalled();
    expectMockLoadToHaveBeenCalled(mockFarm);
  });

  it('disables download button when no workbin data is available', () => {
    mockUseLoadWorkbinTaskDefinitions.mockReturnValue({
      isLoading: false,
      workbinTaskDefinitions: [],
      loadData: mockLoadData,
      clearData: mockClearData,
    });

    const { queryByTestId } = render(<WorkbinDefinitionsTable />);
    expect(queryByTestId(dataTestIdsWorkbinDefinitionsTablePage.downloadButton)).toBeDisabled();
  });

  it('calls "handleAgGridCsvDownload" when download button clicked', async () => {
    const { queryByTestId } = render(<WorkbinDefinitionsTable />);

    expect(mockHandleAgGridCsvDownload).not.toHaveBeenCalled();

    const downloadButton = queryByTestId(dataTestIdsWorkbinDefinitionsTablePage.downloadButton);
    expect(downloadButton).toBeEnabled();
    fireEvent.click(downloadButton);

    await waitFor(() => expect(mockHandleAgGridCsvDownload).toHaveBeenCalled());
  });

  it('disables edit button if no row is selected', async () => {
    const { queryByTestId } = render(<WorkbinDefinitionsTable />);
    const editButton = queryByTestId(dataTestIdsWorkbinDefinitionsTablePage.editButton).querySelector('button');
    await waitFor(() => expect(editButton).toBeDisabled());
  });

  it('enables edit button if row selected', async () => {
    mockUseGetSelectedTableTaskDefinition.mockReturnValue({
      selectedTaskDefinition: mockWorkbinTaskDefinitionData[0],
      updateSelectedRow: mockUpdateSelectedRow,
    });
    const { queryByTestId } = render(<WorkbinDefinitionsTable />);
    const editButton = queryByTestId(dataTestIdsWorkbinDefinitionsTablePage.editButton).querySelector('button');
    await waitFor(() => expect(editButton).toBeEnabled());
  });

  it('enables create button right away', async () => {
    const { queryByTestId } = render(<WorkbinDefinitionsTable />);
    const createButton = queryByTestId(dataTestIdsWorkbinDefinitionsTablePage.createButton).querySelector('button');
    await waitFor(() => expect(createButton).toBeEnabled());
  });
});

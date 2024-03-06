import { AppProductionTestWrapper } from '@plentyag/app-production/src/common/test-helpers';
import { mockAutocompleteFarmDefObject } from '@plentyag/brand-ui/src/components/autocomplete-farm-def-object/test-helpers';
import { BaseAgGridClientSideTable } from '@plentyag/brand-ui/src/components/base-ag-grid-table';
import { handleAgGridCsvDownload } from '@plentyag/core/src/ag-grid/utils';
import { actAndAwait, actAndAwaitRender } from '@plentyag/core/src/test-helpers';
import { fireEvent, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Route } from 'react-router-dom';

import { dataTestIds, MapsTable } from '.';

import { useGetAllowedPaths, useLoadMapTable } from './hooks';
import { MapTable } from './types';

const mockMapTable: MapTable = [
  {
    path: 'sites/SSF2/areas/VerticalGrow/lines/GrowRoom/machines/GrowLane3/containerLocations/T1',
    ref: '123',
    resource: {
      containerId: 'xyz',
      containerLabels: [],
      containerType: 'TOWER',
      containerStatus: 'IN_USE',
      containerSerial: '888',
      crop: 'WHC',
      materialId: 'abc',
      materialLabels: [],
      materialLotName: 'lot-name-xyz',
    },
  },
];

jest.mock('@plentyag/core/src/ag-grid/utils/handle-ag-grid-csv-download');
const mockHandleAgGridCsvDownload = handleAgGridCsvDownload as jest.Mock;

jest.mock('./hooks/use-load-map-table');
const mockClearData = jest.fn();
const mockLoadData = jest.fn();
const mockUseLoadMapTable = useLoadMapTable as jest.Mock;

const fakeClickFarmDef = { path: 'sites/SSF2/areas/VerticalGrow/lines/GrowLane1' };
const initialFarmDefPath = fakeClickFarmDef.path;
const fakeAutoCompleteFarmDefObject = 'fake-auto-complete-farm-def-object';
jest.mock('@plentyag/brand-ui/src/components/autocomplete-farm-def-object', () => {
  return mockAutocompleteFarmDefObject([
    { valueOnChange: fakeClickFarmDef, dataTestId: fakeAutoCompleteFarmDefObject },
  ]);
});

jest.mock('./hooks/use-get-allowed-paths');
const mockUseGetAllowedPaths = useGetAllowedPaths as jest.Mock;
mockUseGetAllowedPaths.mockReturnValue({
  allowedPaths: ['sites/SSF2/areas/BMP', 'sites/SSF2/areas/VerticalGrow'],
  initialPath: fakeClickFarmDef.path,
});

jest.mock('@plentyag/brand-ui/src/components/base-ag-grid-table');
const mockBaseAgGridClientSideTable = BaseAgGridClientSideTable as jest.Mock;
mockBaseAgGridClientSideTable.mockReturnValue(<div></div>);

const basePath = '/production';

describe('MapsTable', () => {
  beforeEach(() => {
    mockUseLoadMapTable.mockReturnValue({
      loadData: mockLoadData,
      clearData: mockClearData,
      mapTable: mockMapTable,
      isLoading: false,
    });
  });

  afterEach(() => {
    fakeClickFarmDef.path = initialFarmDefPath;
    mockClearData.mockClear();
    mockLoadData.mockClear();
    mockBaseAgGridClientSideTable.mockClear();
    mockHandleAgGridCsvDownload.mockClear();
  });

  async function renderMapsTable(initialFarmDefPath?: string) {
    const viewPath = `${basePath}/maps/table/${initialFarmDefPath}`;
    const history = createMemoryHistory({ initialEntries: [viewPath] });
    const result = await actAndAwaitRender(<Route path={`${basePath}/maps/table`} component={MapsTable} />, {
      wrapper: ({ children }) => <AppProductionTestWrapper history={history}>{children}</AppProductionTestWrapper>,
    });
    return { history, result };
  }

  it('gets site, area and line from url path', async () => {
    await renderMapsTable(initialFarmDefPath);
    expect(mockUseLoadMapTable).toHaveBeenCalledWith('sites/SSF2/areas/VerticalGrow/lines/GrowLane1');
  });

  it('loads mapTable from url path', async () => {
    await renderMapsTable(initialFarmDefPath);

    expect(mockBaseAgGridClientSideTable).toHaveBeenCalledWith(
      {
        agGridConfig: expect.objectContaining({
          rowData: mockMapTable,
        }),
        onGridReady: expect.anything(),
      },
      expect.anything()
    );
  });

  it('enables refresh button after mapTable is loaded and farm def object selected', async () => {
    const { result } = await renderMapsTable(initialFarmDefPath);
    const { queryByTestId } = result;

    const button = queryByTestId(fakeAutoCompleteFarmDefObject);
    fireEvent.click(button);

    await waitFor(() => expect(queryByTestId(dataTestIds.refreshButton)).toBeEnabled());
    expect(queryByTestId(dataTestIds.loadButton)).toBeNull();
  });

  it('enables load button when site and area selected but no mapTable loaded', async () => {
    mockUseLoadMapTable.mockReturnValue({
      loadData: () => {},
      clearData: () => {},
      mapTable: [],
      isLoading: false,
    });

    const { result } = await renderMapsTable('sites/SSF2');
    const { queryByTestId } = result;

    const button = queryByTestId(fakeAutoCompleteFarmDefObject);
    fireEvent.click(button);

    await waitFor(() => expect(queryByTestId(dataTestIds.refreshButton)).toBeNull());
    expect(queryByTestId(dataTestIds.loadButton)).toBeEnabled();
  });

  it('does not render either refresh or load buttons when only site selected', async () => {
    const path = 'sites/SSF2';
    fakeClickFarmDef.path = path;

    const { result } = await renderMapsTable(path);
    const { queryByTestId } = result;

    const button = queryByTestId(fakeAutoCompleteFarmDefObject);
    fireEvent.click(button);

    await waitFor(() => expect(queryByTestId(dataTestIds.refreshButton)).toBeNull());
    expect(queryByTestId(dataTestIds.loadButton)).toBeNull();
  });

  it('calls clearData when selectedFarmDefObject changes to path different from current query parameters', async () => {
    const { result } = await renderMapsTable(initialFarmDefPath);
    const { queryByTestId } = result;

    // called when initial farm def path set.
    expect(mockClearData).toHaveBeenCalledTimes(1);

    const button = queryByTestId(fakeAutoCompleteFarmDefObject);
    fireEvent.click(button);
    await actAndAwait(() => fireEvent.click(button));

    expect(mockClearData).toHaveBeenCalledTimes(2);

    fakeClickFarmDef.path = 'sites/SSF2/areas/Germination';
    fireEvent.click(button);

    // should be called again when new path set.
    await waitFor(() => expect(mockClearData).toHaveBeenCalledTimes(3));
  });

  it('loads new mapTable and set new query parameters when clicking load button', async () => {
    mockUseLoadMapTable.mockReturnValue({
      loadData: mockLoadData,
      clearData: () => {},
      mapTable: [],
      isLoading: false,
    });

    const { history, result } = await renderMapsTable('sites/SSF2');
    const { queryByTestId } = result;

    const button = queryByTestId(fakeAutoCompleteFarmDefObject);
    fireEvent.click(button);

    await waitFor(() => expect(queryByTestId(dataTestIds.loadButton)).toBeEnabled());

    expect(mockLoadData).not.toHaveBeenCalled();

    fireEvent.click(queryByTestId(dataTestIds.loadButton));
    await waitFor(() => expect(mockLoadData).toHaveBeenCalled());

    expect(history.location.pathname).toContain('sites/SSF2/areas/VerticalGrow/lines/GrowLane1');
  });

  it('loads new mapTable and set new query parameters when clicking refresh button', async () => {
    const { history, result } = await renderMapsTable(initialFarmDefPath);
    const { queryByTestId } = result;

    const button = queryByTestId(fakeAutoCompleteFarmDefObject);
    fireEvent.click(button);

    await waitFor(() => expect(queryByTestId(dataTestIds.refreshButton)).toBeEnabled());

    const refreshButton = queryByTestId(dataTestIds.refreshButton);

    expect(mockLoadData).not.toHaveBeenCalled();

    fireEvent.click(refreshButton);
    await waitFor(() => expect(mockLoadData).toHaveBeenCalled());
    expect(history.location.pathname).toContain('sites/SSF2/areas/VerticalGrow/lines/GrowLane1');
  });

  it('disables download button when no mapTable is loaded', async () => {
    mockUseLoadMapTable.mockReturnValue({
      loadData: () => {},
      clearData: () => {},
      mapTable: [],
      isLoading: false,
    });

    const { result } = await renderMapsTable();
    const { queryByTestId } = result;

    expect(queryByTestId(dataTestIds.downloadButton)).toBeDisabled();
  });

  it('calls "handleAgGridCsvDownload" when download button clicked', async () => {
    const { result } = await renderMapsTable(initialFarmDefPath);

    const { queryByTestId } = result;

    expect(mockHandleAgGridCsvDownload).not.toHaveBeenCalled();

    const downloadButton = queryByTestId(dataTestIds.downloadButton);
    expect(downloadButton).toBeEnabled();

    fireEvent.click(downloadButton);

    await waitFor(() => expect(mockHandleAgGridCsvDownload).toHaveBeenCalled());
  });
});

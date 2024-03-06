import { mockIrrigationTasks } from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-irrigation-tasks';
import { dataTestids as refreshButtonDataTestIds } from '@plentyag/brand-ui/src/components/refresh-button';
import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsDrawerWithClose } from '../../../drawer-with-close';
import { dataTestIdsIrrigationTable } from '../irrigation-table';
import { IrrigationTableRow } from '../irrigation-table-row';

import { dataTestIdsTableIrrigationDrawer as dataTestIds, IrrigationTableDrawer } from '.';

import { useLoadIrrigationTasks } from './hooks/load-irrigation-tasks';
import { useGetFarmDefSiteObject } from './hooks/use-get-farm-def-site-object';

jest.mock('../irrigation-table-row');
const mockIrrigationTableRow = IrrigationTableRow as jest.Mock;
const mockIrrigationTableRowDataTestid = 'mock-irrigation-table-row';
mockIrrigationTableRow.mockImplementation(({ onRefreshIrrigationTasks }) => {
  return <tr onClick={() => onRefreshIrrigationTasks()} data-testid={mockIrrigationTableRowDataTestid} />;
});

jest.mock('./hooks/load-irrigation-tasks');
const mockUseLoadIrrigationTasks = useLoadIrrigationTasks as jest.Mock;
const mockRefreshIrrigationTasks = jest.fn();
mockUseLoadIrrigationTasks.mockReturnValue({
  isLoading: false,
  irrigationTasks: mockIrrigationTasks,
  refreshIrrigationTasks: mockRefreshIrrigationTasks,
});

jest.mock('./hooks/use-get-farm-def-site-object');
const mockUseGetFarmDefSiteObject = useGetFarmDefSiteObject as jest.Mock;
const mockTimeZone = 'America/Los_Angeles';
mockUseGetFarmDefSiteObject.mockReturnValue({
  isLoading: false,
  farmSiteObject: {
    timezone: mockTimeZone,
  },
});

const mockLotName = 'mock-lot-name';
const mockSerial = 'mock-serial';
const mockRackPath = 'sites/LAX1/areas/Propagation/lines/PropagationRack1';

describe('IrrigationTableDrawer', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  function renderIrrigationTableDrawer(open: boolean, lotName: string) {
    const mockOnClose = jest.fn();
    const result = render(
      <IrrigationTableDrawer
        open={open}
        lotName={lotName}
        tableSerial={mockSerial}
        rackPath={mockRackPath}
        tableLoadedDate={new Date('2023-01-14T08:00:00.000Z')}
        onClose={mockOnClose}
      />
    );
    return { ...result, mockOnClose };
  }

  it('renders table when open is true', () => {
    const { queryByTestId } = renderIrrigationTableDrawer(true, mockLotName);

    expect(queryByTestId(dataTestIdsIrrigationTable.root)).toBeInTheDocument();
  });

  it('does not render table when lotName not provided', () => {
    const { queryByTestId } = renderIrrigationTableDrawer(true, undefined);

    expect(queryByTestId(dataTestIdsIrrigationTable.root)).toBeInTheDocument();
  });

  it('does not render table when open is false', () => {
    const { queryByTestId } = renderIrrigationTableDrawer(false, mockLotName);

    expect(queryByTestId(dataTestIdsIrrigationTable.root)).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const { queryByTestId, mockOnClose } = renderIrrigationTableDrawer(true, mockLotName);

    expect(mockOnClose).not.toHaveBeenCalled();

    queryByTestId(dataTestIdsDrawerWithClose.close).click();

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('refreshes data when refresh button is clicked', () => {
    const { queryByTestId } = renderIrrigationTableDrawer(true, mockLotName);

    expect(mockRefreshIrrigationTasks).not.toHaveBeenCalled();

    queryByTestId(refreshButtonDataTestIds.button).click();

    expect(mockRefreshIrrigationTasks).toHaveBeenCalled();
  });

  it('refreshes data when table row calls onRefreshIrrigationTasks', () => {
    const { queryAllByTestId } = renderIrrigationTableDrawer(true, mockLotName);

    expect(mockRefreshIrrigationTasks).not.toHaveBeenCalled();

    const tableRows = queryAllByTestId(mockIrrigationTableRowDataTestid);
    expect(tableRows).toHaveLength(11);
    // pick first row and simulate clicking refresh.
    tableRows[0].click();

    expect(mockRefreshIrrigationTasks).toHaveBeenCalled();
  });

  it('displays the time zone for site', () => {
    const { queryByTestId } = renderIrrigationTableDrawer(true, mockLotName);

    expect(queryByTestId(dataTestIds.footerTimeZone)).toHaveTextContent(mockTimeZone);
  });
});

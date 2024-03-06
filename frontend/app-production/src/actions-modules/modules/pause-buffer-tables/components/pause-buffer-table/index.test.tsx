import { mockReactorState } from '@plentyag/app-production/src/actions-modules/test-helpers';
import { ActionModule } from '@plentyag/app-production/src/actions-modules/types';
import { TableRow } from '@plentyag/brand-ui/src/material-ui/core';
import { render } from '@testing-library/react';
import React from 'react';

import { PauseBufferRow } from '../pause-buffer-row';

import { dataTestIdsPauseBufferTable as dataTestIds, PauseBufferTable } from './index';

jest.mock('../pause-buffer-row');
const mockPauseBufferRow = PauseBufferRow as jest.Mock;
mockPauseBufferRow.mockImplementation(() => <TableRow />);

const mockTitle = 'Loading';
const mockReactorPath = 'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance';
const mockActionModule: ActionModule = {
  actionName: 'pauseBufferOutflow',
  actionRequestType: 'Requests',
};
const mockRegisterActionModule = jest.fn();

describe('PauseBufferTable', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders table of buffers', () => {
    const mockBufferPaths = [
      'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/machines/PickupBuffer',
      'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/machines/SeedlingBuffer',
    ];
    const { queryByTestId } = render(
      <PauseBufferTable
        title={mockTitle}
        isLoading={false}
        bufferPaths={mockBufferPaths}
        reactorState={mockReactorState}
        reactorPath={mockReactorPath}
        registerActionModule={mockRegisterActionModule}
        actionModule={mockActionModule}
      />
    );

    expect(queryByTestId(dataTestIds.title)).toHaveTextContent(`Pausable ${mockTitle} Buffers`);
    expect(queryByTestId(dataTestIds.emptyTableMessage)).not.toBeInTheDocument();
    expect(mockPauseBufferRow).toHaveBeenCalledTimes(2);
    expect(mockPauseBufferRow).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        bufferName: 'PickupBuffer',
        actionModule: mockActionModule,
        registerActionModule: mockRegisterActionModule,
        reactorState: mockReactorState,
        bufferPath: 'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/machines/PickupBuffer',
        isLoading: false,
        reactorPath: mockReactorPath,
      }),
      {}
    );
    expect(mockPauseBufferRow).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        bufferName: 'SeedlingBuffer',
        actionModule: mockActionModule,
        registerActionModule: mockRegisterActionModule,
        reactorState: mockReactorState,
        bufferPath: 'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/machines/SeedlingBuffer',
        isLoading: false,
        reactorPath: mockReactorPath,
      }),
      {}
    );
  });

  it('renders no buffers and shows message when table is empty', () => {
    // these two buffers are not pausable, so the table should be empty.
    const mockBufferPaths = [
      'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/machines/MaintenanceBuffer',
      'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/machines/CutagainBuffer',
    ];
    const { queryByTestId } = render(
      <PauseBufferTable
        title={mockTitle}
        isLoading={false}
        bufferPaths={mockBufferPaths}
        reactorState={mockReactorState}
        reactorPath={mockReactorPath}
        registerActionModule={mockRegisterActionModule}
        actionModule={mockActionModule}
      />
    );
    expect(queryByTestId(dataTestIds.emptyTableMessage)).toBeInTheDocument();
  });
});

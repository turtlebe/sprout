import { render } from '@testing-library/react';
import React from 'react';

import { mockReactorState } from '../../test-helpers';

import { dataTestIdsPauseBufferTables as dataTestIds, PauseBufferTables } from '.';

import { PauseBufferTable } from './components/pause-buffer-table';

jest.mock('./components/pause-buffer-table');
const mockPauseBufferTable = PauseBufferTable as jest.Mock;
mockPauseBufferTable.mockImplementation(() => <div />);

describe('PauseBufferTables', () => {
  it('shows loading progress', () => {
    const { queryByTestId } = render(
      <PauseBufferTables isLoading reactorState={undefined} reactorPath="" registerActionModule={jest.fn()} />
    );

    expect(queryByTestId(dataTestIds.loading)).toBeInTheDocument();
  });

  it('renders the three buffer categories', () => {
    const mockReactorPath = 'mockReactorPath';
    const mockRegisterActionModule = jest.fn();
    render(
      <PauseBufferTables
        isLoading={false}
        reactorState={mockReactorState}
        reactorPath={mockReactorPath}
        registerActionModule={mockRegisterActionModule}
      />
    );

    expect(mockPauseBufferTable).toHaveBeenCalledTimes(3);
    expect(mockPauseBufferTable).toHaveBeenCalledWith(
      expect.objectContaining({
        actionModule: expect.anything(),
        registerActionModule: mockRegisterActionModule,
        title: 'Loading',
        isLoading: false,
        reactorState: mockReactorState,
        reactorPath: mockReactorPath,
        bufferPaths: [
          'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/machines/CutagainBuffer',
          'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/machines/SeedlingBuffer',
        ],
      }),
      {}
    );
    expect(mockPauseBufferTable).toHaveBeenCalledWith(
      expect.objectContaining({
        actionModule: expect.anything(),
        registerActionModule: mockRegisterActionModule,
        title: 'Empty',
        isLoading: false,
        reactorState: mockReactorState,
        reactorPath: mockReactorPath,
        bufferPaths: [
          'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/machines/EmptyCarrierBuffer',
          'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/machines/PickupBuffer',
        ],
      }),
      {}
    );
    expect(mockPauseBufferTable).toHaveBeenCalledWith(
      expect.objectContaining({
        actionModule: expect.anything(),
        registerActionModule: mockRegisterActionModule,
        title: 'Unloading',
        isLoading: false,
        reactorState: mockReactorState,
        reactorPath: mockReactorPath,
        bufferPaths: [
          'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/machines/AuxBuffer1',
          'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/machines/AuxBuffer2',
          'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/machines/PreInspectionBuffer',
        ],
      }),
      {}
    );
  });
});

import { useActionModule } from '@plentyag/app-production/src/actions-modules/hooks';
import { PauseBufferTablesSerializers } from '@plentyag/app-production/src/actions-modules/serializers';
import { CapacityGauge } from '@plentyag/app-production/src/actions-modules/shared/components/capacity-gauge';
import {
  mockPauseBufferOutflowActionModel,
  mockReactorState,
} from '@plentyag/app-production/src/actions-modules/test-helpers';
import { ActionModule } from '@plentyag/app-production/src/actions-modules/types';
import { Table, TableBody } from '@plentyag/brand-ui/src/material-ui/core';
import { render } from '@testing-library/react';
import React from 'react';

import { PauseBufferDropDown } from '../pause-buffer-drop-down';

import { dataTestIdsPauseBufferRow as dataTestIds, PauseBufferRow } from '.';

const mockBufferPath = 'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/machines/PickupBuffer';
const bufferName = 'PickupBuffer';

jest.mock('../pause-buffer-drop-down');
const MockPauseBufferDropDown = PauseBufferDropDown as jest.Mock;
MockPauseBufferDropDown.mockImplementation(() => <div />);

jest.mock('@plentyag/app-production/src/actions-modules/hooks/use-action-module');
const mockUseActionModule = useActionModule as jest.Mock;
const mockActionModuleProps = {
  formik: {},
  actionModel: mockPauseBufferOutflowActionModel,
  isLoading: false,
};
const mockHandleSubmit = jest.fn();
const mockResetForm = jest.fn();
const mockGetDataModel = jest.fn();
mockGetDataModel.mockImplementation(() =>
  PauseBufferTablesSerializers.getDataModelFromReactorState(
    mockPauseBufferOutflowActionModel,
    mockReactorState.state.buffersStates.bufferPathToBufferStateMap[mockBufferPath],
    {}
  )
);
mockUseActionModule.mockImplementation(() => ({
  actionModuleProps: mockActionModuleProps,
  resetForm: mockResetForm,
  getDataModel: mockGetDataModel,
  handleSubmit: mockHandleSubmit,
}));

const mockReactorPath = 'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance';
const mockActionModule: ActionModule = {
  actionName: 'pauseBufferOutflow',
  actionRequestType: 'Requests',
};
const mockRegisterActionModule = jest.fn();

jest.mock('@plentyag/app-production/src/actions-modules/shared/components/capacity-gauge');
const MockCapacityGauge = CapacityGauge as jest.Mock;

describe('PauseBufferRow', () => {
  beforeEach(() => {
    MockCapacityGauge.mockReturnValue(<div></div>);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  function renderPauseBufferRow() {
    return render(
      <PauseBufferRow
        bufferName={bufferName}
        actionModule={mockActionModule}
        isLoading={false}
        bufferPath={mockBufferPath}
        reactorState={mockReactorState}
        registerActionModule={mockRegisterActionModule}
        reactorPath={mockReactorPath}
      />,
      {
        wrapper: ({ children }) => (
          <Table>
            <TableBody>{children}</TableBody>
          </Table>
        ),
      }
    );
  }

  it('renders a pause buffer row', () => {
    const { queryByTestId } = renderPauseBufferRow();

    expect(queryByTestId(dataTestIds.bufferName)).toHaveTextContent(bufferName);
    expect(MockPauseBufferDropDown).toHaveBeenCalledWith(
      expect.objectContaining({
        ...mockActionModuleProps,
      }),
      expect.anything()
    );
    expect(MockCapacityGauge).toHaveBeenCalledWith(
      expect.objectContaining({
        farmDefObjectPath: 'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/machines/PickupBuffer',
        containerType: 'CARRIER',
        propertyKey: 'capacity',
      }),
      expect.anything()
    );
  });

  it('registers the action module', () => {
    renderPauseBufferRow();

    expect(mockUseActionModule).toHaveBeenCalledWith(
      expect.objectContaining({
        actionModule: mockActionModule,
        path: mockReactorPath,
        isLoading: false,
      })
    );

    expect(mockRegisterActionModule).toHaveBeenCalledWith({
      name: `${mockBufferPath}/${mockActionModule.actionName}`,
      actionModuleProps: mockActionModuleProps,
      handleSubmit: mockHandleSubmit,
    });
  });
});

import { mockCoreState } from '@plentyag/core/src/core-store/test-helpers';
import { mockConsoleError } from '@plentyag/core/src/test-helpers';

import { mockPauseBufferOutflowActionModel, mockReactorState } from '../../test-helpers';

import { getDataModelFromReactorState } from './get-data-model-from-reactor-state';

const consoleError = mockConsoleError();

const mockBufferState = {
  state:
    mockReactorState.state?.buffersStates?.bufferPathToBufferStateMap[
      'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/machines/AuxBuffer1'
    ],
};

describe('getDataModelFromReactorState', () => {
  beforeEach(() => {
    consoleError.mockReset();
  });

  it('returns empty object when reactorState is undefined', () => {
    expect(getDataModelFromReactorState(mockPauseBufferOutflowActionModel, undefined, mockCoreState)).toEqual({});
  });

  it('returns empty object when actionModel is undefined', () => {
    expect(getDataModelFromReactorState(undefined, mockBufferState, mockCoreState)).toEqual({});
  });

  it('returns empty object when reactor state bufferPath does not match action model choices', () => {
    const badMockBufferState = { ...mockBufferState, state: { ...mockBufferState.state, bufferPath: 'bad' } };
    expect(getDataModelFromReactorState(mockPauseBufferOutflowActionModel, badMockBufferState, mockCoreState)).toEqual(
      {}
    );
    expect(consoleError).toHaveBeenCalled();
  });

  it('returns data model', () => {
    expect(getDataModelFromReactorState(mockPauseBufferOutflowActionModel, mockBufferState, mockCoreState)).toEqual({
      submission_method: 'FarmOS UI',
      submitter: 'olittle',
      goal_count: 5,
      pause_buffer_outflow_mode: {
        value: 'PLAY_WITH_GOAL_COUNT',
      },
      buffer: {
        value: 'AUX_BUFFER_1',
      },
    });
  });
});

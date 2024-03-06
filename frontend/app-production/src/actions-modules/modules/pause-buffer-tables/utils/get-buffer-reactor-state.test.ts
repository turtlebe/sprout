import { mockReactorState } from '../../../test-helpers';

import { getBufferReactorState } from './get-buffer-reactor-state';

const bufferPath = 'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/machines/CutagainBuffer';

describe('getBufferReactorState', () => {
  it('gets the buffer state', () => {
    expect(getBufferReactorState(bufferPath, mockReactorState)).toEqual(
      mockReactorState.state.buffersStates.bufferPathToBufferStateMap[bufferPath]
    );
  });

  it('returns undefined if reactor state is undefined', () => {
    expect(getBufferReactorState(bufferPath, undefined)).toBeUndefined();
  });

  it('returns undefined if bufferPath is undefined', () => {
    expect(getBufferReactorState(undefined, mockReactorState)).toBeUndefined();
  });
});

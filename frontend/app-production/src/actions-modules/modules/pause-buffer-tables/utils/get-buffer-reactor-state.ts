import { ReactorStateReturnType } from '@plentyag/app-production/src/reactors-and-tasks-detail-page/types';

import { BufferState } from '../types';

/**
 * This function returns a slice of the reactor state corresponding to the given bufferPath.
 * ex: bufferPath = sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/machines/AuxBuffer1
 */
export function getBufferReactorState(bufferPath: string, reactorState: ReactorStateReturnType): BufferState {
  return reactorState?.state?.buffersStates?.bufferPathToBufferStateMap?.[bufferPath];
}

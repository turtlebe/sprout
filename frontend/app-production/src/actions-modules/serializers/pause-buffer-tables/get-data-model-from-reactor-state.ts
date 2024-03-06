import { GetDataModelFromReactorState } from '@plentyag/app-production/src/actions-modules/types';
import { snakeCase } from 'voca';

import {
  PAUSE_BUFFER_OUTFLOW_MODE_FIELD,
  PAUSE_BUFFER_PLAY_COUNT_GOAL,
  PauseBufferOutflowModeChoices,
} from '../../modules/pause-buffer-tables/types';
import { getFieldChoicesFromActionModel, getInitialDataModelFromActionModel } from '../../shared/utils';

/**
 * Returns data model from the reactor state of transfer conveyance
 * @param {ProdActions.ActionModel} actionModel
 * @param {ReactorStateReturnType} reactorState
 * @param {CoreStore} coreState
 * @returns {DataModel}
 */
export const getDataModelFromReactorState: GetDataModelFromReactorState = (actionModel, reactorState, coreState) => {
  if (!reactorState || !actionModel) {
    return {};
  }

  const bufferState = reactorState.state;

  // -- Buffer
  // map buffer path name to bufferChoices.
  // extract the last value of the buffer path and convert to case used by action model.
  // ex: sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/machines/AuxBuffer1
  // would be AuxBuffer1 --> AUX_BUFFER_1
  const choice = snakeCase(bufferState?.bufferPath?.split('/').pop()).toUpperCase();

  // make sure choice exists in actionModel choices.
  const bufferChoices = getFieldChoicesFromActionModel(actionModel, 'buffer');
  const bufferChoice = bufferChoices.find(c => c === choice);
  if (!bufferChoice) {
    const error = `Error: Buffer choice not found for ${choice} in action: ${actionModel.name}`;
    // this shouldn't happen in normal practice but if does produce console.error
    // so datadog is alerted. also since the choice is invalid the pause/play buttons
    // will disabled in the UI giving the user a tooltip indicating why they are disabled.
    console.error(error);
    return {};
  }

  // -- Mode
  const isPaused = bufferState?.bufferOutflowPaused;
  const isPlayWithCount = !isPaused && bufferState?.goalCount > 0;
  const value = isPaused
    ? PauseBufferOutflowModeChoices.PAUSE
    : isPlayWithCount
    ? PauseBufferOutflowModeChoices.PLAY_WITH_GOAL_COUNT
    : PauseBufferOutflowModeChoices.PLAY;

  // -- Goal Count
  const goalCount = bufferState?.['goalCount'] || null;

  return {
    ...getInitialDataModelFromActionModel(actionModel, coreState),
    [PAUSE_BUFFER_OUTFLOW_MODE_FIELD]: { value },
    [PAUSE_BUFFER_PLAY_COUNT_GOAL]: goalCount,
    buffer: { value: bufferChoice },
  };
};

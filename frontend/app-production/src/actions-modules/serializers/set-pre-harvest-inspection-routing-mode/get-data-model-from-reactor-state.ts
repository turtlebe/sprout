import { GetDataModelFromReactorState } from '@plentyag/app-production/src/actions-modules/types';

import { getInitialDataModelFromActionModel } from '../../shared/utils';

/**
 * Returns data model from the reactor state of transfer conveyance
 * @param {ProdActions.ActionModel} actionModel
 * @param {ReactorStateReturnType} reactorState
 * @param {CoreStore} coreState
 * @returns {DataModel}
 */
export const getDataModelFromReactorState: GetDataModelFromReactorState = (actionModel, reactorState, coreState) => {
  if (!reactorState) {
    return {};
  }

  const { preHarvestInspectionRoutingMode } = reactorState.state;

  return {
    ...getInitialDataModelFromActionModel(actionModel, coreState),
    mode: preHarvestInspectionRoutingMode,
  };
};

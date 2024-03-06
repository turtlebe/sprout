import { GetDataModelFromReactorState } from '@plentyag/app-production/src/actions-modules/types';

import { getDataModelFieldValue, getInitialDataModelFromActionModel } from '../../shared/utils';

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

  const {
    bufferManagementEnabled,
    lingeringCarriersManagementEnabled,
    pickupRobotRoutingEnabled,
    preHarvestBufferFlowRoutingEnabled,
    routingPathOverrideEnabled,
    emptyCarriersAtPreHarvestLanesManagementEnabled,
  } = reactorState.state;

  return {
    ...getInitialDataModelFromActionModel(actionModel, coreState),
    lingering_carriers_management_enabled: getDataModelFieldValue(lingeringCarriersManagementEnabled ? 'yes' : 'no'),
    buffer_management_enabled: getDataModelFieldValue(bufferManagementEnabled ? 'yes' : 'no'),
    empty_carriers_at_pre_harvest_lanes_management_enabled: getDataModelFieldValue(
      emptyCarriersAtPreHarvestLanesManagementEnabled ? 'yes' : 'no'
    ),
    pickup_robot_routing_enabled: getDataModelFieldValue(pickupRobotRoutingEnabled ? 'yes' : 'no'),
    routing_path_override_enabled: getDataModelFieldValue(routingPathOverrideEnabled ? 'yes' : 'no'),
    pre_harvest_buffer_flow_routing_enabled: getDataModelFieldValue(preHarvestBufferFlowRoutingEnabled ? 'yes' : 'no'),
  };
};

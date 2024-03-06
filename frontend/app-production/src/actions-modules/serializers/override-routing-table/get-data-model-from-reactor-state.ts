import { GetDataModelFromReactorState } from '@plentyag/app-production/src/actions-modules/types';
import v from 'voca';

import { setRule } from '../../modules/override-routing-table/utils/model-utils';
import { getFieldChoicesFromActionModel, getInitialDataModelFromActionModel } from '../../shared/utils';

const toReactorValue = (string: string): string => v.upperCase(string.replace(/-/g, '_'));

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

  const { overrideRoutingTableFinalDestinations, overrideRoutingTableConditions } = reactorState.state;

  return Object.keys(overrideRoutingTableFinalDestinations).reduce((acc, ruleFrom, index) => {
    const ruleNumber = index + 1;
    const ruleCondition = overrideRoutingTableConditions[ruleFrom];
    const ruleTo = overrideRoutingTableFinalDestinations[ruleFrom];

    const fromChoices = getFieldChoicesFromActionModel(actionModel, `rule_${ruleNumber}_from`);
    const conditionChoices = getFieldChoicesFromActionModel(actionModel, `rule_${ruleNumber}_condition`);
    const toChoices = getFieldChoicesFromActionModel(actionModel, `rule_${ruleNumber}_to`);

    const from = fromChoices.find(choice => toReactorValue(choice) === ruleFrom);
    const condition = conditionChoices.find(choice => toReactorValue(choice) === ruleCondition);
    const to = toChoices.find(choice => toReactorValue(choice) === ruleTo);

    return setRule(acc, ruleNumber, {
      from,
      condition,
      to,
    });
  }, getInitialDataModelFromActionModel(actionModel, coreState));
};

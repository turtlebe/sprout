import { getDataModelFieldValue, getDataModelValue } from '@plentyag/app-production/src/actions-modules/shared/utils';
import { DataModel } from '@plentyag/app-production/src/actions-modules/types';
import { range } from 'lodash';

import { MAX_RULES } from '../../constants';
import { Rule } from '../../types';

/**
 * Model utilities
 * All methods here should be immutable
 */
/**
 * Immutable setting for data model.
 * @param {DataModel} data
 * @param {number} ruleNumber
 * @param {Rule} values
 * @returns {DataModel}
 */
export const setRule = (data: DataModel, ruleNumber: number, values: Rule): DataModel => ({
  ...data,
  [`rule_${ruleNumber}_from`]: getDataModelFieldValue(values.from),
  [`rule_${ruleNumber}_condition`]: getDataModelFieldValue(values.condition),
  [`rule_${ruleNumber}_to`]: getDataModelFieldValue(values.to),
});

/**
 * Immutable removal of a rule set
 * @param {DataModel} data
 * @param {number} ruleNumber
 * @returns {DataModel}
 */
export const unsetRule = (data: DataModel, ruleNumber: number): DataModel =>
  setRule(data, ruleNumber, { from: null, condition: null, to: null });

/**
 * Returns a {Rule} value of the rule
 * @param {DataModel} data
 * @param {number} ruleNumber
 * @returns {Rule}
 */
export const getRule = (data: DataModel, ruleNumber: number): Rule => ({
  from: getDataModelValue(data, `rule_${ruleNumber}_from`),
  condition: getDataModelValue(data, `rule_${ruleNumber}_condition`),
  to: getDataModelValue(data, `rule_${ruleNumber}_to`),
});

/**
 * Check if the rules are empty
 * Valid Example:
 *   Empty Rule:
 *     {
 *       rule_1_from: {},
 *       rule_1_condition: {},
 *       rule_1_to: {},
 *       ...
 *     }
 * @param {DataModel} data
 * @param {number} ruleNumber
 * @returns {boolean}
 */
export const isEmptyRule = (data: DataModel, ruleNumber: number): boolean => {
  const values = Object.values(getRule(data, ruleNumber));
  return values.filter(value => Boolean(value)).length === 0;
};

/**
 * Check if All the rules are empty
 * @param {DataModel} data
 * @returns {boolean}
 */
export const areAllRulesEmpty = (data: DataModel): boolean => {
  return range(MAX_RULES).every(index => isEmptyRule(data, index + 1));
};

/**
 * Check if the rules are completedly filled out
 * Valid Example (Completed Rule):
 *     {
 *       rule_1_from: { value: "GRC-1A"},
 *       rule_1_condition: { value: "WAIT_FOR_CARRIER_EMPTY_BEFORE_MOVING" },
 *       rule_1_to: { value: "GRC-1A" },
 *       ...
 *     }
 * @param {DataModel} data
 * @param {number} ruleNumber
 * @returns {boolean}
 */
export const isCompletedRule = (data: DataModel, ruleNumber: number): boolean => {
  const values = Object.values(getRule(data, ruleNumber));
  return values.every(value => Boolean(value));
};

/**
 * It is valid if it's Empty or Completed
 * @param {DataModel} data
 * @param {number} ruleNumber
 * @returns {boolean}
 */
export const isValidRule = (data: DataModel, ruleNumber: number): boolean =>
  data && (isEmptyRule(data, ruleNumber) || isCompletedRule(data, ruleNumber));

/**
 * Restack the model
 * @param {DataModel} data
 * @returns {DataModel}
 */
export const restackRules = (data: DataModel): DataModel => {
  // create a new empty data model
  const newData = range(MAX_RULES).reduce((acc, newIndex) => unsetRule(acc, newIndex + 1), { ...data });

  // take existing dat and apply to new data
  return range(MAX_RULES).reduce(
    (acc, index) => {
      const ruleNumber = index + 1;
      const rule = getRule(data, ruleNumber);

      if (Object.values(rule).some(value => value)) {
        const newRuleNumber = acc.newIndex + 1;
        acc.newData = setRule(acc.newData, newRuleNumber, rule);
        acc.newIndex = newRuleNumber;
      }

      return acc;
    },
    {
      newIndex: 0,
      newData,
    }
  ).newData;
};

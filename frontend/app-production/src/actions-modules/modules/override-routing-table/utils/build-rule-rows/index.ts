import { DataModel } from '@plentyag/app-production/src/actions-modules/types';
import { range } from 'lodash';

import { MAX_RULES } from '../../constants';
import { getRule } from '../../utils/model-utils';

/**
 * Convert data model to an array of valid rule numbers
 * @param {DataModel} data
 * @returns {number[]}
 */
export const buildRuleRows = (data: DataModel): number[] =>
  range(MAX_RULES).reduce((acc, index) => {
    const ruleNumber = index + 1;

    const rule = getRule(data, ruleNumber);

    if (Object.values(rule).some(value => value)) {
      acc.push(ruleNumber);
    }

    return acc;
  }, []);

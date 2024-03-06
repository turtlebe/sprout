import { range } from 'lodash';
import { TestOptions } from 'yup';

import { MAX_RULES } from './constants';
import { getRuleName } from './utils/get-rule-name';
import { isValidRule } from './utils/model-utils';

export const additionalValidation: TestOptions = {
  name: 'are-all-rules-valid',
  test: function (value) {
    const { createError } = this;

    const invalidRuleIndex = range(MAX_RULES).find(index => !isValidRule(value, index + 1));

    if (invalidRuleIndex !== undefined) {
      const ruleNumber = invalidRuleIndex + 1;
      return createError({
        path: getRuleName(ruleNumber),
        message: `Rule #${ruleNumber} needs to be completely filled out (from, condition, and to)`,
      });
    }

    return true;
  },
};

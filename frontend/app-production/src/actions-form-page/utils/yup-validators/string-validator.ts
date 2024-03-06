import * as yup from 'yup';

import { getExampleAndRequiredMessages } from './get-example-and-reqd-messages';

export function getYupStringValidator(options: ProdActions.Options, isOptional: boolean, isDisabled: boolean) {
  const { exampleMessage, requiredMessage } = getExampleAndRequiredMessages(options);

  let yupStringRule = isOptional ? yup.string().optional().nullable() : yup.string().required(requiredMessage);

  if (!isDisabled && options && options.rules) {
    const stringRule = options.rules as ProdActions.StringRules;
    if (stringRule && stringRule.string) {
      if (stringRule.string.pattern) {
        yupStringRule = yupStringRule.matches(new RegExp(stringRule.string.pattern), { message: exampleMessage });
      }
      const maxLen = parseInt(stringRule.string.maxLen, 10);
      if (!isNaN(maxLen)) {
        yupStringRule = yupStringRule.max(maxLen);
      }
    }
  }

  return yupStringRule;
}

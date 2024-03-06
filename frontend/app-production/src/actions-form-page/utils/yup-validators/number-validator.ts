import * as yup from 'yup';

import { getExampleAndRequiredMessages } from './get-example-and-reqd-messages';

function isNumber(value: any) {
  return typeof value === 'number';
}

export function getYupNumberValidator(
  options: ProdActions.Options,
  type: ProdActions.FundamentalFieldTypes,
  isOptional: boolean
) {
  // handle both integer and float validation.
  if (!['TYPE_FLOAT', 'TYPE_INT32', 'TYPE_UINT32'].includes(type)) {
    return;
  }
  const { requiredMessage } = getExampleAndRequiredMessages(options);

  let yupNumberRule = isOptional ? yup.number().optional().nullable() : yup.number().required(requiredMessage);

  const isFloat = type === 'TYPE_FLOAT';
  const isInt = type === 'TYPE_INT32';
  yupNumberRule = yupNumberRule.typeError(
    isFloat
      ? 'Must be a floating point number.'
      : `Must be an integer${isInt ? '.' : ' greater than or equal to zero.'}`
  );

  if (!isFloat) {
    yupNumberRule = isInt ? yupNumberRule.integer() : yupNumberRule.integer().min(0);
  }

  if (options && options.rules) {
    const numberRules: ProdActions.NumberRules = isFloat
      ? (options.rules as ProdActions.FloatRules)?.float
      : isInt
      ? (options.rules as ProdActions.Int32Rules)?.int32
      : (options.rules as ProdActions.UInt32Rules)?.uint32;

    if (numberRules) {
      if (isNumber(numberRules.gt)) {
        yupNumberRule = yupNumberRule.moreThan(numberRules.gt);
      }
      if (isNumber(numberRules.gte)) {
        yupNumberRule = yupNumberRule.min(numberRules.gte);
      }
      if (isNumber(numberRules.lt)) {
        yupNumberRule = yupNumberRule.lessThan(numberRules.lt);
      }
      if (isNumber(numberRules.lte)) {
        yupNumberRule = yupNumberRule.max(numberRules.lte);
      }
    }
  }

  return yupNumberRule;
}

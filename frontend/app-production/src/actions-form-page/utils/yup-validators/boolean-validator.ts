import * as yup from 'yup';

import { getExampleAndRequiredMessages } from './get-example-and-reqd-messages';

export function getYupBooleanValidator(field: ProdActions.FundamentalField, isOptional: boolean) {
  if (field.type !== 'TYPE_BOOL') {
    return;
  }

  const { requiredMessage } = getExampleAndRequiredMessages(field.options);

  return isOptional ? yup.bool().optional().nullable() : yup.bool().required(requiredMessage);
}

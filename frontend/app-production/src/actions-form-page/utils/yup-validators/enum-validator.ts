import * as yup from 'yup';

import { getExampleAndRequiredMessages } from './get-example-and-reqd-messages';

export function getYupEnumValidator(field: ProdActions.EnumField, isOptional: boolean) {
  if (field.type !== 'TYPE_ENUM') {
    return;
  }
  const valueOptions = field.enumOptions.value.map(option => option.name);
  if (isOptional) {
    return yup
      .string()
      .optional()
      .nullable()
      .oneOf([...valueOptions, null]);
  } else {
    const { requiredMessage } = getExampleAndRequiredMessages(field.options);
    return yup.string().required(requiredMessage).oneOf(valueOptions);
  }
}

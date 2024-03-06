export const getFieldChoicesFromActionModel = (actionModel: ProdActions.ActionModel, fieldName: string): string[] => {
  const field = actionModel?.fields.find(fieldSet => fieldSet.name === fieldName) as
    | ProdActions.NestedField
    | ProdActions.EnumField;

  if (!field) {
    return [];
  }

  if (field.type === 'TYPE_ENUM') {
    return field.enumOptions.value.map(option => option.name) || [];
  }

  return field.fields.find(nestedField => nestedField.name === 'value').options.farmosRpc.values || [];
};

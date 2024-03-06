import { DataModel, FieldType } from '@plentyag/app-production/src/actions-modules/types';

export const isNestedField = (fieldType: FieldType) => {
  return ['TYPE_MESSAGE'].includes(fieldType);
};

export const getEmptyValue = (fieldType: FieldType = 'TYPE_MESSAGE') => (isNestedField(fieldType) ? {} : null);

export const getDataModelFieldValue = (value: string, fieldType: FieldType = 'TYPE_MESSAGE') => {
  if (isNestedField(fieldType)) {
    return value ? { value } : getEmptyValue(fieldType);
  }
  return value || getEmptyValue(fieldType);
};

export const getDataModelValue = (
  dataModel: DataModel,
  field: string,
  fieldType: FieldType = 'TYPE_MESSAGE'
): string => {
  if (!isNestedField(fieldType) || ['submitter', 'submission_method'].includes(field)) {
    return dataModel?.[field] || null;
  }
  return dataModel?.[field]?.value || null;
};

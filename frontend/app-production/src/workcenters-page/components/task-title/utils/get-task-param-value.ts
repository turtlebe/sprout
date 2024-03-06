import { get } from 'lodash';

function isPrimitiveType(value: any) {
  return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean';
}

export const unknownValue = '???';

/**
 * Gets the value for the given "fieldName" from the provided taskParams object.
 * The typeof the field should be a value type (string, number, bool).
 * If the field is not found in either the top level of the object or in sub-field
 * called "value" then the function will nreturn uknown value: ???.
 * ex: { field1: 1 } or { field1: { value: 1 } } are both valid and will return value: 1.
 */
export function getTaskParamValue(fieldName: string, taskParams: { [fieldName: string]: any }) {
  const field = get(taskParams, fieldName);
  if (isPrimitiveType(field)) {
    return field;
  }
  if (field && typeof field === 'object' && field.value && isPrimitiveType(field.value)) {
    return field.value;
  }
  return unknownValue;
}

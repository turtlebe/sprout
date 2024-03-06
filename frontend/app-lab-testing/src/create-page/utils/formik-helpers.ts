/**
 * Helper function to get formik error for a field
 * @param errors Formik form error
 * @param fieldName name of field in format: 'items.{index}.{name}' where
 * index is numeric index in formik field array and name is the field name.
 */
export const getError = (errors, fieldName: string): string => {
  const parts = fieldName.split('.');
  if (parts.length < 3) {
    return '';
  }
  const index = parts[1];
  const field = parts[2];
  return errors && errors.items && errors.items[index] && errors.items[index][field];
};

export const getFieldName = (index: number, fieldName: keyof LT.CreateItem) => {
  return `items.${index}.${fieldName}`;
};

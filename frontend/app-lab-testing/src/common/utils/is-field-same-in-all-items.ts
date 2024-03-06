/**
 * Test if given field name is the same in all items.
 * @param fieldGetter Function that should return field to compare.
 * @param items Items containing the field.
 */
export function isFieldSameInAllItems<T>(fieldGetter: (field: T) => any, items: T[]) {
  let fieldValue = '';
  for (const item of items) {
    const value = fieldGetter(item);
    if (fieldValue && value && value !== fieldValue) {
      return false;
    }
    if (value) {
      fieldValue = value;
    }
  }
  return true;
}

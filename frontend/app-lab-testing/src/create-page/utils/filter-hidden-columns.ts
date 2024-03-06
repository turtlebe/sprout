import { cloneDeep } from 'lodash';

/**
 * Returns a new array of items created by form with hidden columns removed.
 * Since the user might have entered values in some columns then maybe changed
 * so columns is now hidden, remove these values so they aren't saved to backend.
 * @param values Schema used by Create view (formik)
 */
export function filterHiddenColumns(values: LT.CreateSchema, hiddenColumns: LT.HiddenColumns): LT.CreateSchema {
  const newItems = values.items.map<LT.CreateItem>(item => {
    const newItem = cloneDeep<LT.CreateItem>(item);
    Object.keys(item).forEach(key => {
      if (hiddenColumns[key]) {
        delete newItem[key];
      }
    });
    return newItem;
  });
  return {
    items: newItems,
  };
}

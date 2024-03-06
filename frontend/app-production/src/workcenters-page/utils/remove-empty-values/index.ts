import { cloneDeep, isEmpty, isPlainObject, pullAll } from 'lodash';

function isPlainObjectOrArray(obj: Object) {
  return isPlainObject(obj) || Array.isArray(obj);
}

function recursivelyRemoveEmptyValues(obj: Object) {
  isPlainObjectOrArray(obj) &&
    Object.keys(obj).forEach(key => {
      const value = obj[key];
      if (isPlainObjectOrArray(value)) {
        recursivelyRemoveEmptyValues(value);
      }
      if (value === undefined || value === null || (isPlainObjectOrArray(value) && isEmpty(value))) {
        delete obj[key];
      }
    });
  if (Array.isArray(obj)) {
    // extra step needed for arrays, since delete above leaves undefined value(s) in the array,
    // so removes all undefined items from array here.
    pullAll(obj, [undefined]);
  }
}

/**
 * This function recursively removes values in the object that are: null, undefined, or an empty object/array.
 * For example calling with:
 *   { a:1, b: undefined, c: null, d: [ 1, undefined, null, { x: undefined } ], e: { f: undefined} }
 * would result in obj becoming:
 *   { a: 1, d: [ 1 ] }
 */
export function removeEmptyValues(obj: Object) {
  const objClone = cloneDeep(obj);
  recursivelyRemoveEmptyValues(objClone);
  return objClone;
}

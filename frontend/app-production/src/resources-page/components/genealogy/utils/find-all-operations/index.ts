import { has, isObject } from 'lodash';

/**
 * use a type guard to check if object signature matches that of an operation.
 * @param object Some object to be tested.
 * @return True if object matches signature of an operaton otherwise false.
 */
function isOperation(object: any): object is ProdResources.Operation {
  return (
    isObject(object) &&
    has(object, 'type') &&
    // has(object, 'username') &&
    has(object, 'startDt') &&
    has(object, 'endDt') &&
    // has(object, 'machine') &&
    has(object, 'stateIn') &&
    has(object, 'stateOut')
  );
}

export function findAllOperations(data: ProdResources.FocusedResource) {
  const operations: ProdResources.Operation[] = [];

  function findNestedOperations(data) {
    isObject(data) &&
      Object.keys(data).forEach(key => {
        const value = data[key];
        if (isOperation(value)) {
          operations.push(value);
        }
        findNestedOperations(value);
      });
  }

  findNestedOperations(data);

  return operations;
}

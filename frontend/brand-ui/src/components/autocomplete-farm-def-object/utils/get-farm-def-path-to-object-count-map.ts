import { isFarmDefObject } from '@plentyag/core/src/farm-def/type-guards';
import { FarmDefObject } from '@plentyag/core/src/farm-def/types';
import { isValidKind } from '@plentyag/core/src/farm-def/utils';

/**
 * Create a Map where the keys are FarmDef Paths and the values are a count of the return of a certain callback (see countObject 2nd argument)
 *
 * The count adds up to each level. For example:
 *
 * If sites/SSF2/areas/BMP has 3 direct counts and sites/SSF2 has 1 direct count, the
 * map returned will have these two pairs:
 *   - sites/SSF2 -> 4
 *   - sites/SSF2/areas/BMP -> 3
 *
 * @param farmDefObject FarmDefObject
 * @return Map of FarmDefPath to Count defined by the given passed down function.
 */
export function getFarmDefPathToObjectCountMap(
  farmDefObject: FarmDefObject,
  countObjectFn: (farmDefObject: FarmDefObject) => number
) {
  const farmDefPathToObjectCountMap = new Map<string, number>();

  function increaseFarmDefParentCount(path: string, count: number) {
    if (farmDefPathToObjectCountMap.has(path)) {
      farmDefPathToObjectCountMap.set(path, farmDefPathToObjectCountMap.get(path) + count);
    }
  }

  function updateFarmDefParentCount(farmDefObject: FarmDefObject) {
    const segments: string[] = farmDefObject.path.split('/');

    do {
      // remove itself from the path
      segments.pop();
      segments.pop();

      increaseFarmDefParentCount(segments.join('/'), countObjectFn(farmDefObject));
    } while (segments.length > 0);
  }

  function countObjectsRecursiveley(farmDefObject: FarmDefObject) {
    if (!farmDefObject || !isFarmDefObject(farmDefObject)) {
      return;
    }

    // initialize count for local object
    farmDefPathToObjectCountMap.set(farmDefObject.path, countObjectFn(farmDefObject));

    // update counts of parents
    updateFarmDefParentCount(farmDefObject);

    // count recursively for children
    Object.keys(farmDefObject).forEach(kinds => {
      if (isValidKind(kinds)) {
        Object.keys(farmDefObject[kinds]).forEach(childFarmDefObjectKey => {
          const childFarmDefObject = farmDefObject[kinds][childFarmDefObjectKey];
          if (isFarmDefObject(childFarmDefObject)) {
            countObjectsRecursiveley(childFarmDefObject);
          }
        });
      }
    });
  }
  countObjectsRecursiveley(farmDefObject);

  return farmDefPathToObjectCountMap;
}

import { isFarmDefObject } from '@plentyag/core/src/farm-def/type-guards';
import { FarmDefObject, ScheduleDefinition } from '@plentyag/core/src/farm-def/types';
import { isScheduleDefinitionCompatible } from '@plentyag/core/src/utils';

import { getAllDirectKinds } from '.';

/**
 * Returns available Schedule Definitions for a given FarmDef Object.
 *
 * It returns all the Schedule Definitions at the current level and nested
 * under children FarmDef Objects.
 *
 * @param farmDefObject a FarmDef Object
 * @return a list of Schedule Definitions
 */
export function getAvailableScheduleDefinitions(
  farmDefObject: FarmDefObject,
  compatibleScheduleDefinition?: ScheduleDefinition
) {
  const scheduleDefinitions: ScheduleDefinition[] = [];

  function getAvailableScheduleDefinitionsRecursiveley(farmDefObject: FarmDefObject) {
    if (!farmDefObject || !isFarmDefObject(farmDefObject)) {
      return;
    }

    if (farmDefObject.scheduleDefinitions) {
      Object.keys(farmDefObject.scheduleDefinitions).forEach(scheduleDefinitionKey => {
        const scheduleDefinition = farmDefObject.scheduleDefinitions[scheduleDefinitionKey];
        if (compatibleScheduleDefinition) {
          if (isScheduleDefinitionCompatible(compatibleScheduleDefinition, scheduleDefinition)) {
            scheduleDefinitions.push(scheduleDefinition);
          }
        } else {
          scheduleDefinitions.push(scheduleDefinition);
        }
      });
    }

    getAllDirectKinds(farmDefObject).forEach(attributeName => {
      Object.keys(farmDefObject[attributeName]).forEach(childFarmDefObjectKey => {
        const childFarmDefObject = farmDefObject[attributeName][childFarmDefObjectKey];
        if (isFarmDefObject(childFarmDefObject)) {
          getAvailableScheduleDefinitionsRecursiveley(childFarmDefObject);
        }
      });
    });
  }
  getAvailableScheduleDefinitionsRecursiveley(farmDefObject);

  return scheduleDefinitions;
}

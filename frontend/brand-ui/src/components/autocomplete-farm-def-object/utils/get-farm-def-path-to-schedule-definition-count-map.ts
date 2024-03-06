import { FarmDefObject, ScheduleDefinition } from '@plentyag/core/src/farm-def/types';
import { isScheduleDefinitionCompatible } from '@plentyag/core/src/utils';

import { getFarmDefPathToObjectCountMap } from '.';

/**
 * Create a Map where the keys are FarmDef Paths and the values are a count of all the Schedule Definitions.
 *
 * The Schedule Definitions adds up to each level. For example:
 *
 * If sites/SSF2/areas/BMP has 3 direct Schedule Definitions and sites/SSF2 has 1 direct Schedule Definitions, the
 * map returned will have these two pairs:
 *   - sites/SSF2 -> 4
 *   - sites/SSF2/areas/BMP -> 3
 *
 * @param farmDefObject FarmDefObject
 * @return Map of FarmDefPath to Schedule Definitions count
 */
export function getFarmDefPathToScheduleDefinitionCountMap(
  farmDefObject: FarmDefObject,
  compatibleScheduleDefinition?: ScheduleDefinition
) {
  function countScheduleDefinition(farmDefObject: FarmDefObject) {
    if (!farmDefObject.scheduleDefinitions) {
      return 0;
    }

    if (compatibleScheduleDefinition) {
      return Object.keys(farmDefObject.scheduleDefinitions).filter(scheduleDefinitionName =>
        isScheduleDefinitionCompatible(
          farmDefObject.scheduleDefinitions[scheduleDefinitionName],
          compatibleScheduleDefinition
        )
      ).length;
    }
    return Object.keys(farmDefObject.scheduleDefinitions).length;
  }

  return getFarmDefPathToObjectCountMap(farmDefObject, countScheduleDefinition);
}

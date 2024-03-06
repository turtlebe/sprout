import { isChildDeviceLocation, isDeviceLocation, isScheduleDefinition } from '@plentyag/core/src/farm-def/type-guards';
import { isSchedule } from '@plentyag/core/src/types/environment/type-guards';
import { titleCase } from 'voca';

import { AllowedObjects } from '../hooks/use-autocomplete-farm-def-object-store/state';

/**
 * Return the Autocomplete Option Group for a given FarmDef Object.
 *
 * Uses the kind attribute of the FarmDef Object and do some case cleanups if needed.
 *
 * @param object @see AllowedObjects
 * @return A string representing the group
 */
export function getGroupName(object: AllowedObjects) {
  if (isDeviceLocation(object) || isChildDeviceLocation(object)) {
    return 'Device Location';
  }

  if (isScheduleDefinition(object)) {
    return 'Schedule Definition';
  }

  if (isSchedule(object)) {
    return 'Schedule';
  }

  return titleCase(object.kind);
}

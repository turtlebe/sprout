import { ScheduleDefinition } from '@plentyag/core/src/farm-def/types';
import React from 'react';

import { useAutocompleteFarmDefObjectStore } from '..';
import {
  getFarmDefPathToDeviceLocationCountMap,
  getFarmDefPathToScheduleDefinitionCountMap,
  getSitePathFromPath,
} from '../../utils';

/**
 * When the selectedFarmDefObject is a site, calculate and store the maps containing counts of various objects.
 *
 * Currently:
 * - DeviceLocations
 * - ScheduleDefinitions
 *
 * The DeviceLocations map needs to be re-calculated everytime the deviceTypes prop changes.
 *
 * @param id @see AutocompleteFarmDefObject['id']
 * @param deviceTypes @see AutocompleteFarmDefObject['deviceTypes']
 */
export const useCountMaps = (id: string, deviceTypes: string[], compatibleScheduleDefinition?: ScheduleDefinition) => {
  const [state, actions] = useAutocompleteFarmDefObjectStore(id);

  React.useEffect(() => {
    if (!state.selectedFarmDefObject) {
      return;
    }

    const siteWithChildren = state.farmDefSitesWithChildren.find(
      site => site.path === getSitePathFromPath(state.selectedFarmDefObject.path)
    );

    if (!siteWithChildren) {
      return;
    }

    actions.addDeviceLocationCountMap(getFarmDefPathToDeviceLocationCountMap(siteWithChildren, deviceTypes));
    actions.addScheduleDefinitionCountMap(
      getFarmDefPathToScheduleDefinitionCountMap(siteWithChildren, compatibleScheduleDefinition)
    );
  }, [state.selectedFarmDefObject, state.farmDefSitesWithChildren, deviceTypes]);
};

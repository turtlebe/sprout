import { ContainerLocation, FarmDefObject, FarmDefSite, ScheduleDefinition } from '@plentyag/core/src/farm-def/types';

import { AutocompleteFarmDefObjectActions } from '../hooks';

import {
  getAllChildObjects,
  getAvailableContainerLocations,
  getAvailableDeviceLocations,
  getAvailableScheduleDefinitions,
} from '.';

export function saveFarmDefObjectsInStore(
  farmDefSite: FarmDefSite,
  actions: AutocompleteFarmDefObjectActions,
  compatibleScheduleDefinition?: ScheduleDefinition
) {
  const childObjects: FarmDefObject[] = getAllChildObjects(farmDefSite);
  const { deviceLocations, childDeviceLocations } = getAvailableDeviceLocations(farmDefSite);
  const containerLocations: ContainerLocation[] = getAvailableContainerLocations(farmDefSite);
  const scheduleDefinitions: ScheduleDefinition[] = getAvailableScheduleDefinitions(
    farmDefSite,
    compatibleScheduleDefinition
  );
  actions.addFarmDefObjects([
    ...containerLocations,
    ...deviceLocations,
    ...childDeviceLocations,
    ...scheduleDefinitions,
    ...childObjects,
  ]);
  actions.addFarmDefSiteWithChildren(farmDefSite);
}

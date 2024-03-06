import { FarmDefSite } from '@plentyag/core/src/farm-def/types';
import { Schedule } from '@plentyag/core/src/types/environment';
import { isSchedule } from '@plentyag/core/src/types/environment/type-guards';
import { TreeNodeCount } from '@plentyag/core/src/utils/observation-groups';
import { Store } from 'use-global-hook';

import { getParentFarmDefPath, getShortenedPathFromObject, isPathEquals } from '../../utils';

import {
  AllowedObjects,
  AutocompleteFarmDefObjectGlobalState,
  AutocompleteFarmDefObjectScopedState,
  initialGlobalState,
  initialScopedState,
} from './state';

export interface AutocompleteFarmDefObjectGlobalActions {
  addDeviceLocationCountMap: (id: string, deviceLocationCountMap: Map<string, number>) => void;
  addScheduleDefinitionCountMap: (id: string, scheduleDefinitionCountMap: Map<string, number>) => void;
  addFarmDefObjects: (farmDefObjects: AllowedObjects[]) => void;
  addFarmDefSiteWithChildren: (farmDefSite: FarmDefSite) => void;
  addSchedules: (schedules: Schedule[]) => void;
  goBackToParent: (id: string) => void;
  registerState: (id: string) => void;
  resetStore: () => void;
  setOptions: (id: string, options: Partial<AutocompleteFarmDefObjectScopedState['options']>) => void;
  setInputvalue: (id: string, inputValue: string) => void;
  setIsOpen: (id: string, isOpen: boolean) => void;
  setSelectedFarmDefObject: (id: string, farmDefObject: AllowedObjects) => void;
  setTreeObservationGroups: (treeObservationGroups: TreeNodeCount) => void;
  unregisterState: (id: string) => void;
}

export type AutocompleteFarmDefObjectStore = Store<
  AutocompleteFarmDefObjectGlobalState,
  AutocompleteFarmDefObjectGlobalActions
>;

export interface AutocompleteFarmDefObjectGlobalActionsBoundToStore {
  addDeviceLocationCountMap: (
    store: AutocompleteFarmDefObjectStore,
    id: string,
    deviceLocationCountMap: Map<string, number>
  ) => void;
  addScheduleDefinitionCountMap: (
    store: AutocompleteFarmDefObjectStore,
    id: string,
    scheduleDefinitionCountMap: Map<string, number>
  ) => void;
  addFarmDefObjects: (store: AutocompleteFarmDefObjectStore, farmDefObjects: AllowedObjects[]) => void;
  addFarmDefSiteWithChildren: (store: AutocompleteFarmDefObjectStore, farmDefSite: FarmDefSite) => void;
  addSchedules: (store: AutocompleteFarmDefObjectStore, schedules: Schedule[]) => void;
  goBackToParent: (store: AutocompleteFarmDefObjectStore, id: string) => void;
  registerState: (store: AutocompleteFarmDefObjectStore, id: string) => void;
  resetStore: (store: AutocompleteFarmDefObjectStore) => void;
  setOptions: (
    store: AutocompleteFarmDefObjectStore,
    id: string,
    options: Partial<AutocompleteFarmDefObjectScopedState['options']>
  ) => void;
  setInputvalue: (store: AutocompleteFarmDefObjectStore, id: string, inputValue: string) => void;
  setIsOpen: (store: AutocompleteFarmDefObjectStore, id: string, isOpen: boolean) => void;
  setSelectedFarmDefObject: (store: AutocompleteFarmDefObjectStore, id: string, farmDefObject: AllowedObjects) => void;
  setTreeObservationGroups: (store: AutocompleteFarmDefObjectStore, treeObservationGroups: TreeNodeCount) => void;
  unregisterState: (store: AutocompleteFarmDefObjectStore, id: string) => void;
}

export interface AutocompleteFarmDefObjectActions {
  addDeviceLocationCountMap: (deviceLocationCountMap: Map<string, number>) => void;
  addScheduleDefinitionCountMap: (scheduleDefinitionCountMap: Map<string, number>) => void;
  addFarmDefObjects: (farmDefObjects: AllowedObjects[]) => void;
  addFarmDefSiteWithChildren: (farmDefSite: FarmDefSite) => void;
  addSchedules: (schedules: Schedule[]) => void;
  goBackToParent: () => void;
  registerState: () => void;
  resetStore: () => void;
  setInputvalue: (inputValue: string) => void;
  setOptions: (options: Partial<AutocompleteFarmDefObjectScopedState['options']>) => void;
  setIsOpen: (isOpen: boolean) => void;
  setSelectedFarmDefObject: (farmDefObject: AllowedObjects) => void;
  setTreeObservationGroups: (treeObservationGroups: TreeNodeCount) => void;
  unregisterState: () => void;
}

const buildState = (
  store: AutocompleteFarmDefObjectStore,
  id: string,
  newState: Partial<AutocompleteFarmDefObjectScopedState>
): AutocompleteFarmDefObjectGlobalState => {
  return {
    ...store.state,
    scopedStates: {
      ...store.state.scopedStates,
      [id]: {
        ...store.state.scopedStates[id],
        ...newState,
      },
    },
  };
};

const buildGlobalState = (
  store: AutocompleteFarmDefObjectStore,
  newState: Partial<AutocompleteFarmDefObjectGlobalState>
): AutocompleteFarmDefObjectGlobalState => {
  return {
    ...store.state,
    ...newState,
  };
};

export const actions: AutocompleteFarmDefObjectGlobalActionsBoundToStore = {
  addDeviceLocationCountMap: (store, id, deviceLocationCountMap) => {
    const newDeviceLocationCountMap = new Map<string, number>([
      ...store.state.scopedStates[id].deviceLocationCountMap,
      ...deviceLocationCountMap,
    ]);
    store.setState(buildState(store, id, { deviceLocationCountMap: newDeviceLocationCountMap }));
  },
  addScheduleDefinitionCountMap: (store, id, scheduleDefinitionCountMap) => {
    const newScheduleDefinitionCountMap = new Map<string, number>([
      ...store.state.scopedStates[id].scheduleDefinitionCountMap,
      ...scheduleDefinitionCountMap,
    ]);
    store.setState(buildState(store, id, { scheduleDefinitionCountMap: newScheduleDefinitionCountMap }));
  },
  addFarmDefObjects: (store, farmDefObjects: AllowedObjects[]) => {
    const newFarmDefObjects = farmDefObjects.filter(farmDefObject => !store.state.farmDefPaths.has(farmDefObject.path));
    const newFarmDefPaths = new Set([...store.state.farmDefPaths, ...newFarmDefObjects.map(object => object.path)]);

    store.setState(
      buildGlobalState(store, {
        farmDefObjects: [...store.state.farmDefObjects, ...newFarmDefObjects],
        farmDefPaths: newFarmDefPaths,
      })
    );
  },
  addFarmDefSiteWithChildren: (store, farmDefSite) => {
    store.setState(
      buildGlobalState(store, {
        farmDefSitesWithChildren: [
          ...new Set([
            ...store.state.farmDefSitesWithChildren.filter(site => site.path !== farmDefSite.path),
            farmDefSite,
          ]),
        ],
      })
    );
  },
  addSchedules: (store, schedules: Schedule[]) => {
    const scheduleIds = schedules.map(schedule => schedule.id);
    const storeObjects: AllowedObjects[] = [];
    const storeSchedules: Schedule[] = [];

    store.state.farmDefObjects.forEach(object => {
      if (isSchedule(object)) {
        if (!scheduleIds.includes(object.id)) {
          storeSchedules.push(object);
        }
      } else {
        storeObjects.push(object);
      }
    });

    const newSchedules = [...storeSchedules, ...schedules];
    const newScheduleIds = new Set([...store.state.scheduleIds, ...newSchedules.map(schedule => schedule.id)]);

    store.setState(
      buildGlobalState(store, {
        farmDefObjects: [...storeObjects, ...newSchedules],
        scheduleIds: newScheduleIds,
      })
    );
  },
  goBackToParent: (store, id) => {
    const scopedState = store.state.scopedStates[id];

    if (scopedState.selectedFarmDefObject) {
      const parent = store.state.farmDefObjects.find(
        isPathEquals(getParentFarmDefPath(scopedState.selectedFarmDefObject))
      );

      if (!parent) {
        // we are at the root
        store.setState(buildState(store, id, { selectedFarmDefObject: null, inputValue: '' }));
      } else {
        store.setState(
          buildState(store, id, { selectedFarmDefObject: parent, inputValue: getShortenedPathFromObject(parent) })
        );
      }
    }
  },
  registerState: (store, id) => {
    if (store.state.scopedStates[id]) {
      return;
    }
    store.setState(buildState(store, id, initialScopedState));
  },
  resetStore: store => {
    store.setState(initialGlobalState);
  },
  setOptions: (store, id, options) => {
    store.setState(buildState(store, id, { options: { ...store.state.scopedStates[id].options, ...options } }));
  },
  setInputvalue: (store, id, inputValue) => {
    store.setState(buildState(store, id, { inputValue }));
  },
  setIsOpen: (store, id, isOpen) => {
    store.setState(buildState(store, id, { isOpen }));
  },
  setSelectedFarmDefObject: (store, id, farmDefObject) => {
    store.setState(buildState(store, id, { selectedFarmDefObject: farmDefObject }));
  },
  setTreeObservationGroups: (store, treeObservationGroups) => {
    store.setState(buildGlobalState(store, { treeObservationGroups }));
  },
  unregisterState: (store, id) => {
    store.setState(buildState(store, id, initialScopedState));
  },
};

export const getActions = (
  id: string,
  actions: AutocompleteFarmDefObjectGlobalActions
): AutocompleteFarmDefObjectActions => ({
  addDeviceLocationCountMap: deviceLocationCountMap => actions.addDeviceLocationCountMap(id, deviceLocationCountMap),
  addScheduleDefinitionCountMap: scheduleDefinitionCountMap =>
    actions.addScheduleDefinitionCountMap(id, scheduleDefinitionCountMap),
  addFarmDefObjects: farmDefObjects => actions.addFarmDefObjects(farmDefObjects),
  addFarmDefSiteWithChildren: farmDefSite => actions.addFarmDefSiteWithChildren(farmDefSite),
  addSchedules: schedules => actions.addSchedules(schedules),
  goBackToParent: () => actions.goBackToParent(id),
  registerState: () => actions.registerState(id),
  resetStore: () => actions.resetStore(),
  setOptions: options => actions.setOptions(id, options),
  setInputvalue: inputValue => actions.setInputvalue(id, inputValue),
  setIsOpen: isOpen => actions.setIsOpen(id, isOpen),
  setSelectedFarmDefObject: farmDefObject => actions.setSelectedFarmDefObject(id, farmDefObject),
  setTreeObservationGroups: treeObservationGroups => actions.setTreeObservationGroups(treeObservationGroups),
  unregisterState: () => actions.unregisterState(id),
});

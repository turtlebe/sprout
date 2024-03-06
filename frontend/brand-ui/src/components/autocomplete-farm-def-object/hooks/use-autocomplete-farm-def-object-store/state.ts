import {
  ChildDeviceLocation,
  ContainerLocation,
  DeviceLocation,
  FarmDefObject,
  FarmDefSite,
  ScheduleDefinition,
} from '@plentyag/core/src/farm-def/types';
import { Schedule } from '@plentyag/core/src/types/environment';
import { TreeNodeCount } from '@plentyag/core/src/utils/observation-groups';

export type AllowedObjects =
  | FarmDefObject
  | DeviceLocation
  | ChildDeviceLocation
  | ContainerLocation
  | ScheduleDefinition
  | Schedule;

export interface AutocompleteFarmDefObjectScopedState {
  inputValue: string;
  isOpen: boolean;
  selectedFarmDefObject: AllowedObjects;
  deviceLocationCountMap: Map<string, number>;
  scheduleDefinitionCountMap: Map<string, number>;
  options: {
    showContainerLocations: boolean;
    showDeviceLocations: boolean;
    showScheduleDefinitions: boolean;
    showScheduleDefinitionParents: boolean;
    deviceTypes: string[];
    showObservationStats: boolean;
    compatibleScheduleDefinition: ScheduleDefinition;
    resolveScheduleDefinition: boolean;
  };
}

export type AutocompleteFarmDefObjectState = AutocompleteFarmDefObjectScopedState &
  Omit<AutocompleteFarmDefObjectGlobalState, 'scopedStates'>;

export interface AutocompleteFarmDefObjectGlobalState {
  farmDefPaths: Set<string>;
  farmDefObjects: AllowedObjects[];
  scheduleIds: Set<string>;
  farmDefSitesWithChildren: FarmDefSite[];
  treeObservationGroups: TreeNodeCount;
  scopedStates: {
    [id: string]: AutocompleteFarmDefObjectScopedState;
  };
}

export const initialGlobalState: AutocompleteFarmDefObjectGlobalState = {
  farmDefPaths: new Set<string>(),
  farmDefObjects: [],
  scheduleIds: new Set<string>(),
  farmDefSitesWithChildren: [],
  treeObservationGroups: { count: 0, children: {} },
  scopedStates: {},
};

export const initialScopedState: AutocompleteFarmDefObjectScopedState = {
  inputValue: '',
  isOpen: false,
  selectedFarmDefObject: null,
  deviceLocationCountMap: new Map<string, number>(),
  scheduleDefinitionCountMap: new Map<string, number>(),
  options: {
    showContainerLocations: false,
    showDeviceLocations: false,
    showScheduleDefinitions: false,
    showScheduleDefinitionParents: false,
    deviceTypes: undefined,
    showObservationStats: false,
    compatibleScheduleDefinition: undefined,
    resolveScheduleDefinition: false,
  },
};

import { ContainerLocation } from '@plentyag/core/src/farm-def/types';
import { getKindFromPath } from '@plentyag/core/src/farm-def/utils';
import { uuidv4 } from '@plentyag/core/src/utils';

export interface BuildLAX1ContainerLocation {
  containerType: 'GermTray' | 'PropTray' | 'GermTable' | 'PropTable' | 'Tower';
  lineIndex?: number;
  machineIndex?: number;
  containerIndex?: number;
}

export function buildLAX1ContainerLocation({
  containerType,
  lineIndex = 1,
  machineIndex = 1,
  containerIndex = 1,
}: BuildLAX1ContainerLocation): ContainerLocation {
  const parentId = uuidv4();
  switch (containerType) {
    case 'GermTray':
      return {
        class: 'TrayLoader',
        containerTypes: ['Tray'],
        index: containerIndex,
        kind: 'containerLocation',
        name: `Slot${containerIndex}`,
        parentId,
        parentPath: 'sites/LAX1/areas/TableAutomation/lines/TrayLoad/machines/TrayLoader',
        path: 'sites/LAX1/areas/TableAutomation/lines/TrayLoad/machines/TrayLoader/containerLocations/TrayLoaderPickup',
        properties: {},
        ref: `${parentId}:containerLocation-Slot${containerIndex}`,
      };
    case 'PropTray':
      return {
        class: 'TrayLoader',
        containerTypes: ['Tray'],
        index: containerIndex,
        kind: 'containerLocation',
        name: `Slot${containerIndex}`,
        parentId,
        parentPath: 'sites/LAX1/areas/TableAutomation/lines/TrayLoad/machines/TrayLoader',
        path: 'sites/LAX1/areas/TableAutomation/lines/TrayLoad/machines/TrayLoader/containerLocations/TrayLoaderPickup',
        properties: {},
        ref: `${parentId}:containerLocation-Slot${containerIndex}`,
      };
    case 'GermTable':
      return {
        class: 'TableIndex',
        containerTypes: ['Table'],
        index: containerIndex,
        kind: 'containerLocation',
        name: `Slot${containerIndex}`,
        parentId,
        parentPath: `sites/LAX1/areas/Germination/lines/GerminationLine/machines/GermStack${machineIndex}`,
        path: `sites/LAX1/areas/Germination/lines/GerminationLine/machines/GermStack${machineIndex}/containerLocations/Slot${containerIndex}`,
        properties: {},
        ref: `${parentId}:containerLocation-Slot${containerIndex}`,
      };
    case 'PropTable':
      return {
        class: 'PropBay',
        containerTypes: ['Table'],
        index: containerIndex,
        kind: 'containerLocation',
        name: `Bay${containerIndex}`,
        parentId,
        parentPath: `sites/LAX1/areas/Propagation/lines/PropagationRack${lineIndex}/machines/PropLevel${machineIndex}`,
        path: `sites/LAX1/areas/Propagation/lines/PropagationRack${lineIndex}/machines/PropLevel${machineIndex}/containerLocations/Bay${containerIndex}`,
        properties: {},
        ref: `${parentId}:containerLocation-Bay${containerIndex}`,
      };
    case 'Tower':
      return {
        class: 'TowerIndex',
        containerTypes: ['Tower'],
        index: containerIndex,
        kind: 'containerLocation',
        name: `A${containerIndex}`,
        parentId,
        parentPath: `sites/LAX1/areas/VerticalGrow/lines/GrowRoom${lineIndex}/machines/GrowLine${machineIndex}`,
        path: `sites/LAX1/areas/VerticalGrow/lines/GrowRoom${lineIndex}/machines/GrowLine${machineIndex}/containerLocations/A${containerIndex}`,
        properties: {
          lane: 'A',
        },
        ref: `${parentId}:containerLocation-A${containerIndex}`,
      };
    default:
      return null;
  }
}

export interface BuildMaterialObject {
  id?: string;
  lotName?: string;
  materialType?: ProdResources.ResourceState['materialObj']['materialType'];
}

export function buildMaterialObject({
  id = uuidv4(),
  lotName = uuidv4(),
  materialType = 'LOADED_TABLE',
}: BuildMaterialObject): ProdResources.ResourceState['materialObj'] {
  const now = new Date().toISOString();

  return {
    createdAt: now,
    id,
    lotName,
    materialType,
    product: 'UNKNOWN_CROP',
    properties: {},
    updatedAt: now,
  };
}

export interface BuildResourceState {
  containerLocation?: ContainerLocation;
  materialObj?: ProdResources.ResourceState['materialObj'];
  materialAttributes?: any;
}

export function buildResourceState({
  materialObj = buildMaterialObject({}),
  containerLocation = buildLAX1ContainerLocation({ containerType: 'PropTable' }),
  materialAttributes = {},
}: BuildResourceState): ProdResources.ResourceState {
  const containerId = uuidv4();
  const materialId = materialObj?.id ?? null;
  const materialStatus = materialObj ? 'IN_USE' : null;
  const traceabilityMachineId = uuidv4();
  const now = new Date().toISOString();

  const containerType =
    containerLocation.containerTypes[0].toUpperCase() as ProdResources.ResourceState['containerObj']['containerType'];
  const serialType = containerType === 'TRAY' ? 'TRY' : containerType === 'TABLE' ? 'TBL' : 'TOW';

  return {
    childResourceStateIds: [],
    containerAttributes: {},
    containerId,
    containerLabels: [],
    containerObj: {
      containerType,
      createdAt: now,
      id: containerId,
      properties: {},
      serial: `800-99999999:${serialType}:999-995-005`,
      updatedAt: now,
    },
    containerStatus: 'IN_USE',
    id: uuidv4(),
    isLatest: true,
    location: {
      containerLocation: {
        farmDefPath: containerLocation.path,
        farmdefContainerLocationRef: containerLocation.ref,
        index: 1,
        traceabilityContainerLocationId: uuidv4(),
        traceabilityMachineId,
      },
      machine: {
        areaName: getKindFromPath(containerLocation.parentPath, 'areas'),
        farmdefMachineId: uuidv4(),
        lineName: getKindFromPath(containerLocation.parentPath, 'lines'),
        siteName: getKindFromPath(containerLocation.parentPath, 'sites'),
        traceabilityMachineId,
      },
    },
    materialAttributes,
    materialId,
    materialLabels: [],
    materialObj,
    materialStatus,
    parentResourceStateId: null,
    positionInParent: null,
    quantity: 0,
    units: 'NOT_SPECIFIED',
    updatedAt: now,
  };
}

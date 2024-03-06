declare namespace ProdResources {
  interface Location {
    containerLocation?: {
      index: number;
      farmDefPath?: string;
      farmdefContainerLocationRef: string;
      traceabilityMachineId: string;
      traceabilityContainerLocationId: string;
    };
    machine: Machine;
  }

  export interface Machine {
    siteName: string;
    areaName: string;
    lineName: string;
    machineName?: string;
    farmdefMachineId: string;
    traceabilityMachineId: string;
  }

  type LabelTypes = import('@plentyag/core/src/types').LabelTypes;
  type ContainerTypes = import('@plentyag/core/src/types').ContainerTypes;
  type MaterialTypes = import('@plentyag/core/src/types').MaterialTypes;
  type ResourceTypes = ContainerTypes | MaterialTypes;

  type ContainerStatus = 'IN_USE' | 'CLEAN' | 'DIRTY' | 'TRASHED' | 'UNINITIALIZED';
  type MaterialStatus = 'AVAILABLE' | 'IN_USE' | 'USED' | 'SCRAPPED';

  type ResourceId = string;
  type StateId = string;

  interface ResourceProperties {
    [key: string]: any;
  }

  interface MaterialAttributes {
    loadedInGermAt?: string;
    loadedInPropAt?: string;
    loadedInGrowAt?: string;
  }

  // result will return container or material
  interface ResourceState {
    id: StateId;
    isLatest: boolean; // returns false if this is a historic state, other true indicating this is the latest state

    parentResourceStateId?: StateId;
    childResourceStateIds: StateId[];
    positionInParent?: string | number; // should be string with alphanumeric coordinates, but support number for backwards compatibility

    location: Location;

    updatedAt: string;

    // if containerId is null, then no other container info below is available.
    containerId?: ResourceId;
    containerLabels?: string[];
    containerStatus?: ContainerStatus;
    containerAttributes?: ResourceProperties;
    containerObj?: {
      createdAt: string;
      updatedAt?: string;
      id: ResourceId;
      serial: string;
      containerType: ContainerTypes;
      properties: ResourceProperties;
    };

    // if materialId is null, then no other container info below is available.
    materialId?: ResourceId;
    materialLabels?: string[];
    materialStatus?: MaterialStatus;
    materialObj?: {
      id: ResourceId;
      createdAt?: string;
      updatedAt?: string;
      lotName: string;
      materialType: MaterialTypes;
      product: string;
      properties: ResourceProperties;
    };
    materialAttributes?: MaterialAttributes;
    quantity?: number;
    units?: string;
    towerCycles?: number;
  }

  interface AddLabel extends ProdActions.Operation {
    context: {
      materialType?: MaterialTypes;
      containerType?: ContainerTypes;
      existingLabels?: string[]; // labels that already exist on the resource.
    };
  }
}

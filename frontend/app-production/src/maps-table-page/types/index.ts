interface Resource {
  containerId: ProdResources.ResourceId;
  containerLabels: string[];
  containerType: ProdResources.ContainerTypes;
  containerSerial: string;
  crop: string;
  materialId: ProdResources.ResourceId;
  materialLabels: string[];
  materialLotName: string;
  containerStatus: ProdResources.ContainerStatus;
}

interface MapData {
  containerLocationIndex?: number;
  path: string;
  ref: string;
  conflicts?: Resource[];
  resource?: Resource;
}

export type MapTable = MapData[];

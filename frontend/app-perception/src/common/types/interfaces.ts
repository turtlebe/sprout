export interface SearchFields {
  startTime: string;
  endTime: string;
  site: string;
  area: string;
  line: string;
  machine: string;
  owner: string;
  containerID: string;
  deviceSerial: string;
  tags: string;
  labels: string;
  trialNumber: string;
  treatmentNumber: string;
  advancedSearch: string;
}

export interface ObjectTag {
  tagId: {
    name: string;
  };
}

export interface Label {
  id: number;
  label: string;
  probabilityScore?: number;
  scope: string;
  geometryPoints: number[][];
  metadata: any;
}

export interface LabelSet {
  id: number;
  name: string;
  isGroundTruth?: boolean;
  labelerType: string;
  labelerId: string;
  labels: Label[];
}

export interface SearchResult {
  uuid: string;
  s3Bucket: string;
  s3Region: string;
  s3Key: string;
  s3Url: string;
  contentType: string;
  fileSize: string;
  dtUtc: string;
  date: string;
  timezone: string;
  uploadDtUtc: string;
  modifiedDtUtc: string;
  ownerType: string;
  owner: string;
  path: string;
  site: string;
  area: string;
  line: string;
  machine: string;
  farmObjectKind: string;
  farmObjectId: string;
  containerType: string;
  containerId: string;
  materialId: string;
  isDerived: string;
  rootObjectId: string;
  derivedFrom: string;
  metadata: any;
  devices: {
    deviceSerial: string;
    deviceType: string;
    deviceClass: string;
    parentFarmObjectKind: string;
    parentFarmObjectId: string;
    parentFarmObjectPath: string;
    locationX: number;
    locationY: number;
    locationZ: number;
    locationDetail: any;
    configuration: any;
    metadata: any;
  }[];
  objectImage: {
    imageType: string;
    widthPx: number;
    heightPx: number;
    channels: [];
    primarySubjectType: string;
    primarySubjectIdType: string;
    primarySubjectId: string;
    imageSubjects: [];
    metadata: any;
  }[];
  objectTags: {
    tagId: {
      name: string;
    };
  }[];
  labelSets: LabelSet[];
  trials: {
    trialNum: number;
    treatmentNum: number;
    plotId: string;
    plantId: string;
  }[];
}

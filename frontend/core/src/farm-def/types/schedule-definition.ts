export interface ActionDefinition {
  measurementType: string;
  from?: number;
  to?: number;
  oneOf?: string[];
  defaultValue?: string;
  graphable: boolean;
}

export interface ObservationSource {
  paths: string[];
  observationNames: string[];
}

export interface ScheduleDefinition {
  ref: string;
  name: string;
  kind: 'scheduleDefinition';
  path: string;
  class: 'ScheduleDefinition';
  parentPath: string;
  description: string;
  properties: {};
  action?: {
    supportedKeys: string[];
    supportedValues: {
      from?: number;
      to?: number;
      oneOf?: string[];
    };
    measurementType: string;
  };
  actionDefinition?: ActionDefinition;
  actionDefinitions?: { [key: string]: ActionDefinition };
  observationSources: ObservationSource[];
}

import { ScheduleDefinition } from '@plentyag/core/src/farm-def/types';

export const mockScheduleDefinitions: ScheduleDefinition[] = [
  {
    ref: 'fb489ba7-8570-429e-b3ee-b477b5b6856b:schedule-ThermalHumidity',
    name: 'ThermalHumidity',
    kind: 'scheduleDefinition',
    path: 'sites/LAX1/areas/Germination/lines/GerminationLine/machines/ThermalSystem/scheduleDefinitions/ThermalHumidity',
    class: 'ScheduleDefinition',
    parentPath: 'sites/LAX1/areas/Germination/lines/GerminationLine/machines/ThermalSystem',
    description: 'Controls the humdity',
    properties: {},
    action: {
      supportedKeys: [],
      supportedValues: {
        from: 0,
        to: 100,
      },
      measurementType: 'RELATIVE_HUMIDITY',
    },
    observationSources: [],
  },
  {
    ref: 'fb489ba7-8570-429e-b3ee-b477b5b6856b:schedule-ThermalTemperature',
    name: 'ThermalTemperature',
    kind: 'scheduleDefinition',
    path: 'sites/LAX1/areas/Germination/lines/GerminationLine/machines/ThermalSystem/scheduleDefinitions/ThermalTemperature',
    class: 'ScheduleDefinition',
    parentPath: 'sites/LAX1/areas/Germination/lines/GerminationLine/machines/ThermalSystem',
    description: 'Controls the temperature',
    properties: {},
    action: {
      supportedKeys: [],
      supportedValues: {
        from: 0,
        to: 100,
      },
      measurementType: 'TEMPERATURE',
    },
    observationSources: [],
  },
  {
    ref: 'b12345:scheduleDefinition-SetLights',
    name: 'SetLights',
    kind: 'scheduleDefinition',
    path: 'sites/TEST/areas/GERM/lines/GermLine/scheduleDefinitions/SetLights',
    class: 'ScheduleDefinition',
    parentPath: 'sites/TEST/areas/GERM/lines/GermLine',
    description: 'Mock Schedule to control if ligts are on or off',
    properties: {},
    action: {
      supportedKeys: [],
      supportedValues: {
        oneOf: ['on', 'off'],
      },
      measurementType: 'BINARY_STATE',
    },
    observationSources: [],
  },
  {
    ref: 'b12345:scheduleDefinition-SetLightIntensity',
    name: 'SetLightIntensity',
    kind: 'scheduleDefinition',
    path: 'sites/TEST/areas/GERM/lines/GermLine/scheduleDefinitions/SetLightIntensity',
    class: 'ScheduleDefinition',
    parentPath: 'sites/TEST/areas/GERM/lines/GermLine',
    description: 'Mock Schedule to control the light intensity',
    properties: {},
    action: {
      supportedKeys: ['zone1', 'zone2'],
      supportedValues: {
        oneOf: ['20', '40', '60', '80'],
      },
      measurementType: 'PERCENTAGE',
    },
    observationSources: [],
  },
  {
    ref: 'a12345:scheduleDefinition-SetIrrigationSingleValue',
    name: 'SetIrrigationSingleValue',
    kind: 'scheduleDefinition',
    path: 'sites/TEST/areas/SEED/lines/SeederLine/scheduleDefinitions/SetIrrigationSingleValue',
    class: 'ScheduleDefinition',
    parentPath: 'sites/TEST/areas/SEED/lines/SeederLine',
    description: 'Mock Schedule to demonstrate single action based schedules',
    properties: {},
    actionDefinition: {
      oneOf: ['on', 'off'],
      measurementType: 'BINARY_STATE',
      graphable: true,
    },
    observationSources: [],
  },
  {
    ref: 'a12345:scheduleDefinition-SetIrrigationMultipleValue',
    name: 'SetIrrigationMultipleValue',
    kind: 'scheduleDefinition',
    path: 'sites/TEST/areas/SEED/lines/SeederLine/scheduleDefinitions/SetIrrigationMultipleValue',
    class: 'ScheduleDefinition',
    parentPath: 'sites/TEST/areas/SEED/lines/SeederLine',
    description: 'Mock Schedule to demonstrate multiple action based schedules',
    properties: {},
    actionDefinitions: {
      drain: {
        from: 0,
        to: 100,
        measurementType: 'UNKNOWN_MEASUREMENT_TYPE',
        graphable: false,
      },
      duration: {
        from: 0,
        to: 100,
        measurementType: 'UNKNOWN_MEASUREMENT_TYPE',
        graphable: false,
      },
      frequency: {
        from: 0,
        to: 100,
        measurementType: 'UNKNOWN_MEASUREMENT_TYPE',
        graphable: false,
      },
      irrigation: {
        oneOf: ['on', 'off'],
        measurementType: 'BINARY_STATE',
        graphable: true,
      },
    },
    observationSources: [],
  },
];

export interface BuildScheduleDefinition {
  path?: string;
  name?: string;
  action?: ScheduleDefinition['action'];
  actionDefinition?: ScheduleDefinition['actionDefinition'];
  actionDefinitions?: ScheduleDefinition['actionDefinitions'];
}

export function buildScheduleDefinition({
  path,
  name = 'SetTemperature',
  action,
  actionDefinition,
  actionDefinitions,
}: BuildScheduleDefinition): ScheduleDefinition {
  if (!action && !actionDefinition && !actionDefinitions) {
    throw new Error('Cannot build a Schedule Definition without at least one ActionDefinition');
  }
  return {
    ref: `fb489ba7-8570-429e-b3ee-b477b5b6856b:schedule-${name}`,
    name,
    kind: 'scheduleDefinition',
    path: path ?? `sites/LAX1/areas/VerticalGrow/scheduleDefinitions/${name}`,
    class: 'ScheduleDefinition',
    parentPath: 'sites/LAX1/areas/VerticalGrow',
    description: 'Controls the temperature',
    properties: {},
    observationSources: [],
    action,
    actionDefinition,
    actionDefinitions,
  };
}

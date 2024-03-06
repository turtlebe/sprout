import { InterpolationType, Schedule, ScheduleType } from '@plentyag/core/src/types/environment';
import { uniqueId } from 'lodash';

export const mockSchedules: Schedule[] = [
  {
    id: '57d6e4f9-dc78-4006-af3c-56ad98648004',
    createdAt: '2021-12-15T16:57:13.856472Z',
    updatedAt: '2021-12-15T16:57:13.856472Z',
    createdBy: 'gdebeaupuis',
    updatedBy: 'gdebeaupuis',
    path: 'sites/SSF2/areas/Seeding/scheduleDefinitions/ThermalHumidity',
    scheduleType: ScheduleType.CONTINUOUS,
    description: 'schedule SSF2',
    startsAt: '2020-10-27T00:00:00.000Z',
    endsAt: null,
    activatesAt: '2020-10-27T00:00:00.000Z',
    repeatInterval: 86400,
    priority: 1,
    actions: [
      { time: 3600, value: '100', valueType: 'SINGLE_VALUE' },
      { time: 7200, value: '15', valueType: 'SINGLE_VALUE' },
    ],
  },
  {
    id: '70932b1e-8387-4748-8dbf-8f930178ff0b',
    createdAt: '2022-02-15T21:03:40.831142Z',
    updatedAt: '2022-02-16T17:14:39.068782Z',
    createdBy: 'gdebeaupuis',
    updatedBy: 'gdebeaupuis',
    path: 'sites/TEST/areas/GERM/lines/GermLine/scheduleDefinitions/SetLights',
    scheduleType: ScheduleType.CONTINUOUS,
    description: null,
    startsAt: '2022-02-15T13:00:00Z',
    endsAt: null,
    activatesAt: '2022-02-15T13:00:00Z',
    repeatInterval: 86400,
    priority: 1,
    actions: [
      { valueType: 'SINGLE_VALUE', time: 3600, value: 'on' },
      { valueType: 'SINGLE_VALUE', time: 10800, value: 'off' },
    ],
  },
  {
    id: 'fa105502-9c2c-423b-8332-0250a98e8abd',
    createdAt: '2022-02-17T16:42:40.982391Z',
    updatedAt: '2022-02-17T16:43:58.080427Z',
    createdBy: 'gdebeaupuis',
    updatedBy: 'gdebeaupuis',
    path: 'sites/TEST/areas/GERM/lines/GermLine/scheduleDefinitions/SetLightIntensity',
    scheduleType: ScheduleType.CONTINUOUS,
    description: 'Test OneOf Schedule',
    startsAt: '2022-02-01T13:00:00Z',
    endsAt: null,
    activatesAt: '2022-02-01T13:00:00Z',
    repeatInterval: 86400,
    priority: 1,
    actions: [
      { valueType: 'MULTIPLE_VALUE', time: 3600, values: { zone1: '80', zone2: '20' } },
      { valueType: 'MULTIPLE_VALUE', time: 7200, values: { zone1: '60', zone2: '40' } },
    ],
  },
];

export interface BuildSchedule {
  path?: Schedule['path'];
  actions?: Schedule['actions'];
  priority?: Schedule['priority'];
  startsAt?: Schedule['startsAt'];
  activatesAt?: Schedule['activatesAt'];
  interpolationType?: Schedule['interpolationType'];
}

export const buildSchedule = ({
  path = 'sites/TEST/areas/GERM/lines/GermLine/scheduleDefinitions/SetLightIntensity',
  actions = [
    { valueType: 'MULTIPLE_VALUE', time: 3600, values: { zone1: '80', zone2: '20' } },
    { valueType: 'MULTIPLE_VALUE', time: 7200, values: { zone1: '60', zone2: '40' } },
  ],
  priority = 1,
  startsAt = '2022-02-01T13:00:00Z',
  activatesAt = '2022-02-01T13:00:00Z',
  interpolationType = InterpolationType.none,
}: BuildSchedule): Schedule => {
  return {
    id: uniqueId(),
    createdAt: '2022-02-17T16:42:40.982391Z',
    updatedAt: '2022-02-17T16:43:58.080427Z',
    createdBy: 'gdebeaupuis',
    updatedBy: 'gdebeaupuis',
    path,
    scheduleType: ScheduleType.CONTINUOUS,
    interpolationType,
    description: 'Test OneOf Schedule',
    startsAt,
    endsAt: null,
    activatesAt,
    repeatInterval: 86400,
    priority,
    actions,
  };
};

import { mockSchedules } from '@plentyag/core/src/test-helpers/mocks';
import * as d3 from 'd3';

import { Metric, Schedule, ScheduleType } from '.';

import { isMetric, isScaleLinear, isSchedule } from './type-guards';

describe('isScaleLinear', () => {
  it('returns true', () => {
    expect(isScaleLinear(d3.scaleLinear())).toBe(true);
  });

  it('returns false', () => {
    expect(isScaleLinear(d3.scalePoint())).toBe(false);
  });
});

const metric: Metric = {
  path: 'path',
  measurementType: 'measurementType',
  observationName: 'observationName',
  unitConfig: {
    min: 0,
    max: 1,
  },
  alertRules: [],
  id: 'id',
  createdAt: '',
  createdBy: '',
  updatedAt: '',
  updatedBy: '',
};

describe('isMetric', () => {
  it('returns true', () => {
    expect(isMetric(metric)).toBe(true);
  });

  it('returns false', () => {
    const schedule: Schedule = {
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
      actions: [],
    };

    expect(isMetric(schedule)).toBe(false);
  });
});

describe('isSchedule', () => {
  const [schedule] = mockSchedules;

  it('returns true', () => {
    expect(isSchedule(schedule)).toBe(true);
  });

  it('returns false', () => {
    expect(isSchedule(null)).toBe(false);
    expect(isSchedule(undefined)).toBe(false);
    expect(isSchedule(metric)).toBe(false);
  });
});

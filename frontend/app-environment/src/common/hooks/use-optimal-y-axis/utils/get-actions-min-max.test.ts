import { buildSchedule, buildScheduleDefinition } from '@plentyag/app-environment/src/common/test-helpers';

import { getActionsMinMax } from './get-actions-min-max';

describe('getActionsMinMax', () => {
  it('returns NaN-NaN', () => {
    expect(getActionsMinMax([], [])).toEqual({ min: NaN, max: NaN });
    expect(getActionsMinMax([null], [null])).toEqual({ min: NaN, max: NaN });
  });

  it('returns the min/max of the actions (single values)', () => {
    const schedules = [
      buildSchedule({
        actions: [
          { time: 0, value: '-20', valueType: 'SINGLE_VALUE' },
          { time: 1, value: '20', valueType: 'SINGLE_VALUE' },
        ],
      }),
    ];
    const scheduleDefinitions = [
      buildScheduleDefinition({
        actionDefinition: { graphable: true, measurementType: 'TEMPERATURE', from: -100, to: 100 },
      }),
    ];

    expect(getActionsMinMax(schedules, scheduleDefinitions)).toEqual({ min: -20, max: 20 });
  });

  it('returns the min/max of the actions (multiple values)', () => {
    const schedules = [
      buildSchedule({
        actions: [
          { time: 0, values: { zone1: '0', zone2: '30' }, valueType: 'MULTIPLE_VALUE' },
          { time: 1, values: { zone1: '-30', zone2: '0' }, valueType: 'MULTIPLE_VALUE' },
        ],
      }),
    ];
    const scheduleDefinitions = [
      buildScheduleDefinition({
        actionDefinitions: {
          zone1: { graphable: true, measurementType: 'TEMPERATURE', from: -100, to: 100 },
          zone2: { graphable: true, measurementType: 'TEMPERATURE', from: -100, to: 100 },
        },
      }),
    ];

    expect(getActionsMinMax(schedules, scheduleDefinitions)).toEqual({ min: -30, max: 30 });
  });
});

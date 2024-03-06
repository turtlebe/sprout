import { buildScheduleDefinition } from '@plentyag/app-environment/src/common/test-helpers';

import { getScheduleDefinitionsMinMax } from './get-schedule-definitions-min-max';

describe('getScheduleDefinitionsMinMax', () => {
  it('returns NaN-NaN', () => {
    expect(getScheduleDefinitionsMinMax([])).toEqual({ min: NaN, max: NaN });
    expect(getScheduleDefinitionsMinMax([null])).toEqual({ min: NaN, max: NaN });
  });

  it('returns NaN-NaN when no actionDefinition are graphable', () => {
    const scheduleDefinitions = [
      buildScheduleDefinition({
        actionDefinition: { graphable: false, measurementType: 'TEMPERATURE', from: 0, to: 10 },
      }),
      buildScheduleDefinition({
        actionDefinitions: {
          zone1: { graphable: false, measurementType: 'TEMPERATURE', from: -10, to: 10 },
          zone2: { graphable: false, measurementType: 'TEMPERATURE', from: 0, to: 5 },
        },
      }),
    ];

    expect(getScheduleDefinitionsMinMax(scheduleDefinitions)).toEqual({ min: NaN, max: NaN });
  });

  it('returns the min/max for the schedule definitions (single values)', () => {
    const scheduleDefinitions = [
      buildScheduleDefinition({
        actionDefinition: { graphable: true, measurementType: 'TEMPERATURE', from: 0, to: 10 },
      }),
      buildScheduleDefinition({
        actionDefinition: { graphable: true, measurementType: 'TEMPERATURE', from: -10, to: 5 },
      }),
    ];
    expect(getScheduleDefinitionsMinMax(scheduleDefinitions)).toEqual({ min: -10, max: 10 });
  });

  it('returns the min/max for the schedule definitions (multiple values)', () => {
    const scheduleDefinitions = [
      buildScheduleDefinition({
        actionDefinitions: {
          zone1: { graphable: true, measurementType: 'TEMPERATURE', from: -10, to: 10 },
          zone2: { graphable: true, measurementType: 'TEMPERATURE', from: 0, to: 5 },
        },
      }),
      buildScheduleDefinition({
        actionDefinitions: {
          zone3: { graphable: true, measurementType: 'TEMPERATURE', from: 2, to: 8 },
          zone4: { graphable: true, measurementType: 'TEMPERATURE', from: 5, to: 30 },
        },
      }),
    ];
    expect(getScheduleDefinitionsMinMax(scheduleDefinitions)).toEqual({ min: -10, max: 30 });
  });
});

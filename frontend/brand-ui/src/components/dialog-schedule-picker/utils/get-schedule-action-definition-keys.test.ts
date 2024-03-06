import { buildSchedule } from '@plentyag/core/src/test-helpers/mocks';

import {
  getScheduleActionDefinitionKeys,
  getSchedulesActionDefinitionKeysWhenEqual,
} from './get-schedule-action-definition-keys';

describe('getScheduleActionDefinitionKeys', () => {
  it('returns an empty array', () => {
    expect(getScheduleActionDefinitionKeys(undefined)).toEqual([]);
    expect(getScheduleActionDefinitionKeys(buildSchedule({ actions: [] }))).toEqual([]);
    expect(getScheduleActionDefinitionKeys(buildSchedule({ actions: [] }))).toEqual([]);
  });

  it('returns the ActionDefinition keys', () => {
    expect(
      getScheduleActionDefinitionKeys(
        buildSchedule({ actions: [{ time: 0, valueType: 'MULTIPLE_VALUE', values: { mode: 'on', frequency: '20' } }] })
      )
    ).toEqual(['frequency', 'mode']);
  });
});

describe('getSchedulesActionDefinitionKeysWhenEqual', () => {
  it('returns an empty array', () => {
    expect(getSchedulesActionDefinitionKeysWhenEqual(undefined)).toEqual([]);
    expect(
      getSchedulesActionDefinitionKeysWhenEqual([
        buildSchedule({ actions: [{ time: 0, valueType: 'SINGLE_VALUE', value: 'on' }] }),
        buildSchedule({ actions: [{ time: 0, valueType: 'SINGLE_VALUE', value: 'off' }] }),
      ])
    ).toEqual([]);
    expect(
      getSchedulesActionDefinitionKeysWhenEqual([buildSchedule({ actions: [] }), buildSchedule({ actions: [] })])
    ).toEqual([]);
    expect(
      getSchedulesActionDefinitionKeysWhenEqual([
        buildSchedule({ actions: [{ time: 0, valueType: 'MULTIPLE_VALUE', values: { mode: 'on', frequency: '20' } }] }),
        buildSchedule({
          actions: [{ time: 0, valueType: 'MULTIPLE_VALUE', values: { mode: 'off', duration: '10' } }],
        }),
      ])
    ).toEqual([]);
  });

  it('returns the ActionDefinition keys common to all the schedules', () => {
    expect(
      getSchedulesActionDefinitionKeysWhenEqual([
        buildSchedule({ actions: [{ time: 0, valueType: 'MULTIPLE_VALUE', values: { mode: 'on', frequency: '20' } }] }),
        buildSchedule({
          actions: [{ time: 0, valueType: 'MULTIPLE_VALUE', values: { mode: 'off', frequency: '10' } }],
        }),
      ])
    ).toEqual(['frequency', 'mode']);
  });
});

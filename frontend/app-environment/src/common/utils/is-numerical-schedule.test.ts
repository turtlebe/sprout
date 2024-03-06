import { mockScheduleDefinitions } from '@plentyag/app-environment/src/common/test-helpers';

import { isNumericalSchedule } from './is-numerical-schedule';

describe('isNumericalSchedule', () => {
  it('returns true, with action that has measurementType RELATIVE_HUMIDITY', () => {
    expect(isNumericalSchedule(mockScheduleDefinitions[0])).toBe(true);
  });

  it('returns true, with action that has measurementType TEMPERATURE', () => {
    expect(isNumericalSchedule(mockScheduleDefinitions[1])).toBe(true);
  });

  it('returns false, with action that has measurementType BINARY_STATE', () => {
    expect(isNumericalSchedule(mockScheduleDefinitions[2])).toBe(false);
  });

  it('returns true, with action that has measurementType PERCENTAGE', () => {
    expect(isNumericalSchedule(mockScheduleDefinitions[3])).toBe(true);
  });

  it('returns false, with actionDefinition that has measurementType BINARY_STATE', () => {
    expect(isNumericalSchedule(mockScheduleDefinitions[4])).toBe(false);
  });

  it('returns false, with actionDefinitions that have measurementType UNKNOWN_MEASUREMENT_TYPE', () => {
    expect(isNumericalSchedule(mockScheduleDefinitions[5])).toBe(false);
  });
});

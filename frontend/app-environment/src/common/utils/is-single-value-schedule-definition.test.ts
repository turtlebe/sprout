import { mockScheduleDefinitions } from '../test-helpers';

import { isSingleValueScheduleDefinition } from './is-single-value-schedule-definition';

describe('isSingleValueScheduleDefinition', () => {
  it('returns true for a legacy single value schedule definition', () => {
    const scheduleDefinition = mockScheduleDefinitions.find(sd => sd.action?.supportedKeys?.length === 0);

    expect(scheduleDefinition).toBeDefined();
    expect(isSingleValueScheduleDefinition(scheduleDefinition)).toBe(true);
  });

  it('returns true for a single value schedule definition', () => {
    const scheduleDefinition = mockScheduleDefinitions.find(sd => sd.actionDefinition);

    expect(scheduleDefinition).toBeDefined();
    expect(isSingleValueScheduleDefinition(scheduleDefinition)).toBe(true);
  });

  it('returns false for a legacy multiple value schedule definition', () => {
    const scheduleDefinition = mockScheduleDefinitions.find(sd => sd.action?.supportedKeys?.length > 0);

    expect(scheduleDefinition).toBeDefined();
    expect(isSingleValueScheduleDefinition(scheduleDefinition)).toBe(false);
  });

  it('returns false for a multiple value schedule definition', () => {
    const scheduleDefinition = mockScheduleDefinitions.find(sd => sd.actionDefinitions);

    expect(scheduleDefinition).toBeDefined();
    expect(isSingleValueScheduleDefinition(scheduleDefinition)).toBe(false);
  });
});

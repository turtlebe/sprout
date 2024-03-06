import { mockScheduleDefinitions } from '../test-helpers';

import { getGraphableActionDefinition } from './get-graphable-action-definition';

describe('getGraphableActionDefinition', () => {
  it('returns the ActionDefiniton (legacy single value schedule definition)', () => {
    const scheduleDefinition = mockScheduleDefinitions.find(sd => sd.action?.supportedKeys?.length === 0);

    expect(getGraphableActionDefinition(scheduleDefinition)).toEqual({
      key: undefined,
      actionDefinition: {
        measurementType: scheduleDefinition.action.measurementType,
        graphable: true,
        defaultValue: undefined,
        ...scheduleDefinition.action.supportedValues,
      },
    });
  });

  it('returns the ActionDefiniton (legacy multiple value schedule definition)', () => {
    const scheduleDefinition = mockScheduleDefinitions.find(sd => sd.action?.supportedKeys?.length > 0);

    expect(getGraphableActionDefinition(scheduleDefinition)).toEqual({
      key: scheduleDefinition.action.supportedKeys[0],
      actionDefinition: {
        measurementType: scheduleDefinition.action.measurementType,
        graphable: true,
        defaultValue: undefined,
        ...scheduleDefinition.action.supportedValues,
      },
    });
  });

  it('returns the ActionDefiniton (single value schedule definition)', () => {
    const scheduleDefinition = mockScheduleDefinitions.find(sd => sd.actionDefinition);

    expect(getGraphableActionDefinition(scheduleDefinition)).toEqual({
      key: undefined,
      actionDefinition: scheduleDefinition.actionDefinition,
    });
  });

  it('returns the ActionDefiniton (multiple value schedule definition)', () => {
    const scheduleDefinition = mockScheduleDefinitions.find(sd => sd.actionDefinitions);
    const [key, actionDefinition] = Object.entries(scheduleDefinition.actionDefinitions).find(
      ([, actionDefinition]) => actionDefinition.graphable
    );

    expect(getGraphableActionDefinition(scheduleDefinition)).toEqual({ key, actionDefinition });
  });
});

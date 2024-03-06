import { mockScheduleDefinitions } from '../test-helpers';

import { getActionDefinitions } from './get-action-definitions';

describe('eachActionDefinition', () => {
  it('returns an empty array', () => {
    expect(getActionDefinitions(null)).toEqual([]);
    expect(getActionDefinitions(undefined)).toEqual([]);
  });

  it('returns an array of object containing the key and the action definition (single value legacy)', () => {
    const scheduleDefinition = mockScheduleDefinitions.find(sd => sd.action?.supportedKeys?.length === 0);

    expect(getActionDefinitions(scheduleDefinition)).toEqual([
      {
        key: undefined,
        actionDefinition: {
          measurementType: scheduleDefinition.action.measurementType,
          defaultValue: undefined,
          graphable: true,
          from: scheduleDefinition.action.supportedValues.from,
          to: scheduleDefinition.action.supportedValues.to,
          oneOf: scheduleDefinition.action.supportedValues.oneOf,
        },
      },
    ]);
  });

  it('returns an array of object containing the key and the action definition (single value)', () => {
    const scheduleDefinition = mockScheduleDefinitions.find(sd => sd.actionDefinition);

    expect(getActionDefinitions(scheduleDefinition)).toEqual([
      { key: undefined, actionDefinition: scheduleDefinition.actionDefinition },
    ]);
  });

  it('returns an array of object containing the key and the action definition (multiple value legacy)', () => {
    const scheduleDefinition = mockScheduleDefinitions.find(sd => sd.action?.supportedKeys?.length > 0);

    expect(getActionDefinitions(scheduleDefinition)).toEqual([
      {
        key: 'zone1',
        actionDefinition: {
          measurementType: scheduleDefinition.action.measurementType,
          defaultValue: undefined,
          graphable: true,
          from: scheduleDefinition.action.supportedValues.from,
          to: scheduleDefinition.action.supportedValues.to,
          oneOf: scheduleDefinition.action.supportedValues.oneOf,
        },
      },
      {
        key: 'zone2',
        actionDefinition: {
          measurementType: scheduleDefinition.action.measurementType,
          defaultValue: undefined,
          graphable: true,
          from: scheduleDefinition.action.supportedValues.from,
          to: scheduleDefinition.action.supportedValues.to,
          oneOf: scheduleDefinition.action.supportedValues.oneOf,
        },
      },
    ]);
  });

  it('returns a sorted array of object containing the key and the action definition (multiple value)', () => {
    const scheduleDefinition = mockScheduleDefinitions.find(sd => sd.actionDefinitions);

    expect(getActionDefinitions(scheduleDefinition)).toEqual(
      Object.keys(scheduleDefinition.actionDefinitions)
        .sort(
          (a, b) =>
            Number(scheduleDefinition.actionDefinitions[b].graphable) -
            Number(scheduleDefinition.actionDefinitions[a].graphable)
        )
        .map(key => ({
          key,
          actionDefinition: scheduleDefinition.actionDefinitions[key],
        }))
    );
  });

  it('returns graphable action definitions only (multiple value)', () => {
    const scheduleDefinition = mockScheduleDefinitions.find(sd => sd.actionDefinitions);

    expect(getActionDefinitions(scheduleDefinition, { graphable: true })).toEqual(
      Object.keys(scheduleDefinition.actionDefinitions)
        .filter(key => scheduleDefinition.actionDefinitions[key].graphable)
        .map(key => ({
          key,
          actionDefinition: scheduleDefinition.actionDefinitions[key],
        }))
    );
  });

  it('returns non-graphable action definitions only (multiple value)', () => {
    const scheduleDefinition = mockScheduleDefinitions.find(sd => sd.actionDefinitions);

    expect(getActionDefinitions(scheduleDefinition, { graphable: false })).toEqual(
      Object.keys(scheduleDefinition.actionDefinitions)
        .filter(key => scheduleDefinition.actionDefinitions[key].graphable === false)
        .map(key => ({
          key,
          actionDefinition: scheduleDefinition.actionDefinitions[key],
        }))
    );
  });
});

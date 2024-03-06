import { buildScheduleDefinition } from '@plentyag/core/src/test-helpers/mocks/environment';

import { isScheduleDefinitionCompatible } from './is-schedule-definition-compatible';

describe('isScheduleDefinitionCompatible', () => {
  it('returns true for legacy single value definition', () => {
    const definitionA = buildScheduleDefinition({
      action: { supportedKeys: [], supportedValues: { from: 0, to: 100 }, measurementType: 'TEMPERATURE' },
    });
    const definitionB = buildScheduleDefinition({
      action: { supportedKeys: [], supportedValues: { from: 0, to: 100 }, measurementType: 'TEMPERATURE' },
    });

    expect(isScheduleDefinitionCompatible(definitionA, definitionB)).toBe(true);
  });

  it('returns true for legacy multiple value definition', () => {
    const definitionA = buildScheduleDefinition({
      action: {
        supportedKeys: ['zone1', 'zone2'],
        supportedValues: { from: 0, to: 100 },
        measurementType: 'TEMPERATURE',
      },
    });
    const definitionB = buildScheduleDefinition({
      action: {
        supportedKeys: ['zone1', 'zone2'],
        supportedValues: { from: 0, to: 100 },
        measurementType: 'TEMPERATURE',
      },
    });

    expect(isScheduleDefinitionCompatible(definitionA, definitionB)).toBe(true);
  });

  it('returns true for single value definition', () => {
    const definitionA = buildScheduleDefinition({
      actionDefinition: { oneOf: ['10', '20'], measurementType: 'TEMPERATURE', graphable: true },
    });
    const definitionB = buildScheduleDefinition({
      actionDefinition: { oneOf: ['10', '20'], measurementType: 'TEMPERATURE', graphable: true },
    });

    expect(isScheduleDefinitionCompatible(definitionA, definitionB)).toBe(true);
  });

  it('returns true for multiple value definition', () => {
    const definitionA = buildScheduleDefinition({
      actionDefinitions: {
        zone1: { oneOf: ['10', '20'], measurementType: 'TEMPERATURE', graphable: true },
        zone2: { oneOf: ['10', '20'], measurementType: 'TEMPERATURE', graphable: true },
      },
    });
    const definitionB = buildScheduleDefinition({
      actionDefinitions: {
        zone1: { oneOf: ['10', '20'], measurementType: 'TEMPERATURE', graphable: true },
        zone2: { oneOf: ['10', '20'], measurementType: 'TEMPERATURE', graphable: true },
      },
    });

    expect(isScheduleDefinitionCompatible(definitionA, definitionB)).toBe(true);
  });

  it("returns false when the definition don't match", () => {
    const definitionA = buildScheduleDefinition({
      actionDefinition: { from: 0, to: 100, measurementType: 'TEMPERATURE', graphable: true },
    });
    const definitionB = buildScheduleDefinition({
      actionDefinition: { oneOf: ['10', '20'], measurementType: 'TEMPERATURE', graphable: true },
    });

    expect(isScheduleDefinitionCompatible(definitionA, definitionB)).toBe(false);
  });
});

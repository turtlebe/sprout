import { ActionDefinition } from '@plentyag/core/src/farm-def/types';

import { getActionInitialValue } from './get-action-initial-value';

const measurementType = 'UNKNOWN_MEASUREMENT_TYPE';
const graphable = true;

describe('getActionInitialValue', () => {
  it('returns undefined', () => {
    expect(getActionInitialValue(null)).toBeUndefined();
    expect(getActionInitialValue(undefined)).toBeUndefined();
  });

  it('returns the from attribute', () => {
    const actionDefinition1: ActionDefinition = { measurementType, graphable, from: 0, to: 100 };

    expect(getActionInitialValue(actionDefinition1)).toBe('0');

    const actionDefinition2: ActionDefinition = { measurementType, graphable, from: 20, to: 100 };

    expect(getActionInitialValue(actionDefinition2)).toBe('20');
  });

  it('ignore the from attribute and returns a default value', () => {
    const actionDefinition: ActionDefinition = { measurementType, graphable, from: 0, to: 100, defaultValue: '20' };

    expect(getActionInitialValue(actionDefinition)).toBe('20');
  });

  it('returns the first item in oneOf', () => {
    const actionDefinition1: ActionDefinition = { measurementType, graphable, oneOf: ['a', 'b'] };

    expect(getActionInitialValue(actionDefinition1)).toBe('a');

    const actionDefinition2: ActionDefinition = { measurementType, graphable, oneOf: ['c', 'd'] };

    expect(getActionInitialValue(actionDefinition2)).toBe('c');
  });

  it('ignores the first item in oneOf and returns the defaultValue', () => {
    const actionDefinition: ActionDefinition = { measurementType, graphable, oneOf: ['a', 'b'], defaultValue: 'b' };

    expect(getActionInitialValue(actionDefinition)).toBe('b');
  });
});

import { buildScheduleDefinition } from '@plentyag/app-environment/src/common/test-helpers';
import { mockUseFetchMeasurementTypes } from '@plentyag/core/src/hooks/use-fetch-measurement-types/test-helpers';
import { renderHook } from '@testing-library/react-hooks';

import { useScale } from './use-scale';

const startDateTime = new Date();
const endDateTime = new Date();
const width = 1000;

describe('useScale', () => {
  beforeEach(() => {
    mockUseFetchMeasurementTypes();
  });

  it('takes the min/max values of from/to', () => {
    const scheduleDefinitions = [
      buildScheduleDefinition({
        actionDefinition: { from: 0, to: 50, measurementType: 'TEMPERATURE', graphable: true },
      }),
      buildScheduleDefinition({
        actionDefinition: { from: 50, to: 100, measurementType: 'TEMPERATURE', graphable: true },
      }),
    ];

    const { result } = renderHook(() => useScale({ scheduleDefinitions, width, startDateTime, endDateTime }));

    expect(result.current.y.domain()).toEqual([100, 0]);
  });

  it('takes the min/max values of the prop', () => {
    const scheduleDefinitions = [
      buildScheduleDefinition({
        actionDefinition: { from: 0, to: 50, measurementType: 'TEMPERATURE', graphable: true },
      }),
      buildScheduleDefinition({
        actionDefinition: { from: 50, to: 100, measurementType: 'TEMPERATURE', graphable: true },
      }),
    ];

    const { result } = renderHook(() =>
      useScale({ minY: -200, maxY: 200, scheduleDefinitions, width, startDateTime, endDateTime })
    );

    expect(result.current.y.domain()).toEqual([200, -200]);
  });

  it('aggregates all the oneOf values', () => {
    const scheduleDefinitions = [
      buildScheduleDefinition({
        actionDefinition: { oneOf: ['a', 'b'], measurementType: 'CATEGORICAL_STATE', graphable: true },
      }),
      buildScheduleDefinition({
        actionDefinition: { oneOf: ['c', 'd'], measurementType: 'CATEGORICAL_STATE', graphable: true },
      }),
    ];

    const { result } = renderHook(() => useScale({ scheduleDefinitions, width, startDateTime, endDateTime }));

    expect(result.current.y.domain()).toEqual(['a', 'b', 'c', 'd']);
  });

  it('decides on the type of scale based on the first graphable measurement type', () => {
    const scheduleDefinitions = [
      buildScheduleDefinition({
        actionDefinition: { oneOf: ['a', 'b'], measurementType: 'CATEGORICAL_STATE', graphable: true },
      }),
      buildScheduleDefinition({
        actionDefinition: { from: 0, to: 100, measurementType: 'TEMPERATURE', graphable: true },
      }),
    ];

    const { result } = renderHook(() => useScale({ scheduleDefinitions, width, startDateTime, endDateTime }));

    expect(result.current.y.domain()).toEqual(['a', 'b']);
  });

  it('ignores non graphable action definitions', () => {
    const scheduleDefinitions = [
      buildScheduleDefinition({
        actionDefinitions: {
          SetMode: { oneOf: ['a', 'b'], measurementType: 'CATEGORICAL_STATE', graphable: true },
          SetFrequency: { oneOf: ['c', 'd'], measurementType: 'CATEGORICAL_STATE', graphable: false },
        },
      }),
      buildScheduleDefinition({
        actionDefinitions: {
          SetMode: { oneOf: ['e', 'f'], measurementType: 'CATEGORICAL_STATE', graphable: true },
          SetFrequency: { oneOf: ['g', 'h'], measurementType: 'CATEGORICAL_STATE', graphable: false },
        },
      }),
    ];

    const { result } = renderHook(() => useScale({ scheduleDefinitions, width, startDateTime, endDateTime }));

    expect(result.current.y.domain()).toEqual(['a', 'b', 'e', 'f']);
  });
});

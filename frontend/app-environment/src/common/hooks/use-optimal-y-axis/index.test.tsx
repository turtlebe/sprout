import { TimeSummarization } from '@plentyag/core/src/types/environment';
import { renderHook } from '@testing-library/react-hooks';

import {
  buildAlertRule,
  buildMetric,
  buildRolledUpByTimeObservation,
  buildSchedule,
  buildScheduleDefinition,
} from '../../test-helpers';

import { useOptimalYAxis } from '.';

describe('useOptimalYAxis', () => {
  it('returns 0-100 by default', () => {
    const { result } = renderHook(() => useOptimalYAxis({}));

    expect(result.current).toEqual({ min: 0, max: 100 });
  });

  it('returns 0-100 when the Schedule Definition is non numerical', () => {
    const scheduleDefinitions = [
      buildScheduleDefinition({
        actionDefinition: { graphable: true, measurementType: 'BINARY_STATE', oneOf: ['true', 'false'] },
      }),
    ];

    const { result } = renderHook(() => useOptimalYAxis({ buffer: 0, scheduleDefinitions }));

    expect(result.current).toEqual({ min: 0, max: 100 });
  });

  it('returns 0-100 when the Schedule Definition is non graphable', () => {
    const scheduleDefinitions = [
      buildScheduleDefinition({
        actionDefinition: { graphable: false, measurementType: 'BINARY_STATE', oneOf: ['true', 'false'] },
      }),
    ];

    const { result } = renderHook(() => useOptimalYAxis({ buffer: 0, scheduleDefinitions }));

    expect(result.current).toEqual({ min: 0, max: 100 });
  });

  it("returns a min/max based on metrics's unit config when there are no alert rule, no schedule and no observations", () => {
    const metrics = [
      buildMetric({ unitConfig: { min: 0, max: 10 } }),
      buildMetric({ unitConfig: { min: -10, max: 5 } }),
    ];

    const { result } = renderHook(() => useOptimalYAxis({ buffer: 0, metrics }));

    expect(result.current).toEqual({ min: -10, max: 10 });
  });

  it("returns a min/max based on metrics's unit config when there are no alert rule, no schedule and no observations with a buffer", () => {
    const metrics = [
      buildMetric({ unitConfig: { min: 0, max: 10 } }),
      buildMetric({ unitConfig: { min: -10, max: 5 } }),
    ];

    const { result } = renderHook(() => useOptimalYAxis({ buffer: 0.1, metrics }));

    expect(result.current).toEqual({ min: -12, max: 12 });
  });

  it('returns a min/max based on schedule definitions when there are no actions, no metrics, no alert rules and no observations', () => {
    const scheduleDefinitions = [
      buildScheduleDefinition({
        actionDefinition: { graphable: true, measurementType: 'TEMPERATURE', from: 0, to: 10 },
      }),
      buildScheduleDefinition({
        actionDefinition: { graphable: true, measurementType: 'TEMPERATURE', from: -10, to: 5 },
      }),
    ];

    const { result } = renderHook(() => useOptimalYAxis({ buffer: 0, scheduleDefinitions }));

    expect(result.current).toEqual({ min: -10, max: 10 });
  });

  describe('given observationStreams, rules and actions', () => {
    function getProps() {
      const alertRules = [buildAlertRule({ rules: [{ time: 0, gte: 0, lte: 0 }] })];
      const metrics = [buildMetric({ alertRules })];
      const observationStreams = [
        [buildRolledUpByTimeObservation({ mean: 0, median: 0, min: 0, max: 0, rolledUpAt: '2023-01-01T00:00:00Z' })],
      ];
      const schedules = [buildSchedule({ actions: [{ time: 0, value: '0', valueType: 'SINGLE_VALUE' }] })];
      const scheduleDefinitions = [
        buildScheduleDefinition({
          actionDefinition: { graphable: true, measurementType: 'TEMPERATURE', from: -100, to: 100 },
        }),
      ];
      const timeSummarization = TimeSummarization.median;

      return {
        metrics,
        alertRules,
        observationStreams,
        schedules,
        scheduleDefinitions,
        timeSummarization,
        buffer: 0,
      };
    }

    it('returns min/max based on rules', () => {
      const alertRules = [buildAlertRule({ rules: [{ time: 0, gte: -10, lte: 10 }] })];

      const { result } = renderHook(() => useOptimalYAxis({ ...getProps(), alertRules }));

      expect(result.current).toEqual({ min: -10, max: 10 });
    });

    it('returns min/max based on actions (single values)', () => {
      const schedules = [
        buildSchedule({
          actions: [
            { time: 0, value: '-20', valueType: 'SINGLE_VALUE' },
            { time: 1, value: '20', valueType: 'SINGLE_VALUE' },
          ],
        }),
      ];

      const { result } = renderHook(() => useOptimalYAxis({ ...getProps(), schedules }));

      expect(result.current).toEqual({ min: -20, max: 20 });
    });

    it('returns min/max based on actions (multiple values)', () => {
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

      const { result } = renderHook(() => useOptimalYAxis({ ...getProps(), schedules, scheduleDefinitions }));

      expect(result.current).toEqual({ min: -30, max: 30 });
    });

    it('returns min/max based on observations and time summarization (median)', () => {
      const observationStreams = [
        [buildRolledUpByTimeObservation({ mean: 0, median: -40, min: 0, max: 0, rolledUpAt: '2023-01-01T00:00:00Z' })],
        [buildRolledUpByTimeObservation({ mean: 0, median: 40, min: 0, max: 0, rolledUpAt: '2023-01-01T00:00:00Z' })],
      ];

      const { result } = renderHook(() => useOptimalYAxis({ ...getProps(), observationStreams }));

      expect(result.current).toEqual({ min: -40, max: 40 });
    });

    it('returns min/max based on observations and time summarization (mean)', () => {
      const observationStreams = [
        [buildRolledUpByTimeObservation({ mean: -50, median: 0, min: 0, max: 0, rolledUpAt: '2023-01-01T00:00:00Z' })],
        [buildRolledUpByTimeObservation({ mean: 50, median: 0, min: 0, max: 0, rolledUpAt: '2023-01-01T00:00:00Z' })],
      ];
      const timeSummarization = TimeSummarization.mean;

      const { result } = renderHook(() => useOptimalYAxis({ ...getProps(), observationStreams, timeSummarization }));

      expect(result.current).toEqual({ min: -50, max: 50 });
    });

    it('returns min/max based on observations and time summarization (value)', () => {
      const attrs = { mean: 0, median: 0, min: 0, max: 0 };
      const observationStreams = [
        [
          buildRolledUpByTimeObservation({ ...attrs, value: 'A', valueCount: 30, rolledUpAt: '2023-01-01T00:00:00Z' }),
          buildRolledUpByTimeObservation({ ...attrs, value: 'B', valueCount: 50, rolledUpAt: '2023-01-01T00:00:00Z' }),
          buildRolledUpByTimeObservation({ ...attrs, value: 'A', valueCount: 10, rolledUpAt: '2023-01-01T01:00:00Z' }),
          buildRolledUpByTimeObservation({ ...attrs, value: 'B', valueCount: 20, rolledUpAt: '2023-01-01T02:00:00Z' }),
        ],
      ];
      const timeSummarization = TimeSummarization.value;

      const { result } = renderHook(() => useOptimalYAxis({ ...getProps(), observationStreams, timeSummarization }));

      // we have 30 + 50 at the same rolledUpAt = 80
      expect(result.current).toEqual({ min: 0, max: 80 });
    });
  });
});

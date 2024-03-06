import { mockMetrics } from '@plentyag/app-environment/src/common/test-helpers';
import { DEFAULT_TIME_SUMMARIZATION } from '@plentyag/app-environment/src/common/utils/constants';
import { TimeSummarization } from '@plentyag/core/src/types/environment';
import { act, renderHook } from '@testing-library/react-hooks';

import { DEFAULT_METRIC_STATE, useMetricsGraphState } from '.';

const [metricIdA, metricIdB] = mockMetrics.map(metric => metric.id);

describe('useMetricsGraphState', () => {
  it('returns an initial state', () => {
    const { result } = renderHook(() => useMetricsGraphState({ metrics: mockMetrics }));

    expect(result.current.state).toEqual({
      timeSummarization: DEFAULT_TIME_SUMMARIZATION,
      metrics: {
        [metricIdA]: DEFAULT_METRIC_STATE,
        [metricIdB]: DEFAULT_METRIC_STATE,
      },
    });
    expect(DEFAULT_METRIC_STATE.showData).toBe(true);
    expect(DEFAULT_METRIC_STATE.showSpecLimit).toBe(false);
    expect(DEFAULT_METRIC_STATE.showControlLimit).toBe(false);
  });

  it('updates the initial state when the metric changes an', () => {
    const { result, rerender } = renderHook(({ metrics }) => useMetricsGraphState({ metrics }), {
      initialProps: { metrics: [] },
    });

    expect(result.current.state).toEqual({
      timeSummarization: DEFAULT_TIME_SUMMARIZATION,
      metrics: {},
    });

    rerender({ metrics: mockMetrics });

    expect(result.current.state).toEqual({
      timeSummarization: DEFAULT_TIME_SUMMARIZATION,
      metrics: {
        [metricIdA]: DEFAULT_METRIC_STATE,
        [metricIdB]: DEFAULT_METRIC_STATE,
      },
    });
  });

  it('changes the time summarization', () => {
    const { result } = renderHook(() => useMetricsGraphState({ metrics: mockMetrics }));

    expect(result.current.state.timeSummarization).toBe(DEFAULT_TIME_SUMMARIZATION);

    act(() => result.current.setTimeSummarization(TimeSummarization.mean));

    expect(result.current.state.timeSummarization).toBe(TimeSummarization.mean);
  });

  it('hides/shows data for a given metric', () => {
    const { result } = renderHook(() => useMetricsGraphState({ metrics: mockMetrics }));

    expect(result.current.state.metrics[metricIdA].showData).toBe(DEFAULT_METRIC_STATE.showData);
    expect(result.current.state.metrics[metricIdB].showData).toBe(DEFAULT_METRIC_STATE.showData);

    act(() => result.current.setShowData(metricIdA, false));

    expect(result.current.state.metrics[metricIdA].showData).toBe(false);
    expect(result.current.state.metrics[metricIdB].showData).toBe(DEFAULT_METRIC_STATE.showData);

    act(() => result.current.setShowData(metricIdA, true));

    expect(result.current.state.metrics[metricIdA].showData).toBe(DEFAULT_METRIC_STATE.showData);
    expect(result.current.state.metrics[metricIdB].showData).toBe(DEFAULT_METRIC_STATE.showData);
  });

  it('hides/shows spec limit for a given metric', () => {
    const { result } = renderHook(() => useMetricsGraphState({ metrics: mockMetrics }));

    expect(result.current.state.metrics[metricIdA].showSpecLimit).toBe(DEFAULT_METRIC_STATE.showSpecLimit);
    expect(result.current.state.metrics[metricIdB].showSpecLimit).toBe(DEFAULT_METRIC_STATE.showSpecLimit);

    act(() => result.current.setShowSpecLimit(metricIdA, true));

    expect(result.current.state.metrics[metricIdA].showSpecLimit).toBe(true);
    expect(result.current.state.metrics[metricIdB].showSpecLimit).toBe(DEFAULT_METRIC_STATE.showSpecLimit);

    act(() => result.current.setShowSpecLimit(metricIdA, false));

    expect(result.current.state.metrics[metricIdA].showSpecLimit).toBe(DEFAULT_METRIC_STATE.showSpecLimit);
    expect(result.current.state.metrics[metricIdB].showSpecLimit).toBe(DEFAULT_METRIC_STATE.showSpecLimit);
  });

  it('hides/shows control limit for a given metric', () => {
    const { result } = renderHook(() => useMetricsGraphState({ metrics: mockMetrics }));

    expect(result.current.state.metrics[metricIdA].showControlLimit).toBe(DEFAULT_METRIC_STATE.showControlLimit);
    expect(result.current.state.metrics[metricIdB].showControlLimit).toBe(DEFAULT_METRIC_STATE.showControlLimit);

    act(() => result.current.setShowControlLimit(metricIdA, true));

    expect(result.current.state.metrics[metricIdA].showControlLimit).toBe(true);
    expect(result.current.state.metrics[metricIdB].showControlLimit).toBe(DEFAULT_METRIC_STATE.showControlLimit);

    act(() => result.current.setShowControlLimit(metricIdA, false));

    expect(result.current.state.metrics[metricIdA].showControlLimit).toBe(DEFAULT_METRIC_STATE.showControlLimit);
    expect(result.current.state.metrics[metricIdB].showControlLimit).toBe(DEFAULT_METRIC_STATE.showControlLimit);
  });

  it('hides/shows all data for all metrics', () => {
    const { result } = renderHook(() => useMetricsGraphState({ metrics: mockMetrics }));

    expect(result.current.state.metrics[metricIdA].showData).toBe(DEFAULT_METRIC_STATE.showData);
    expect(result.current.state.metrics[metricIdB].showData).toBe(DEFAULT_METRIC_STATE.showData);

    act(() => result.current.setShowAllData(false));

    expect(result.current.state.metrics[metricIdA].showData).toBe(false);
    expect(result.current.state.metrics[metricIdB].showData).toBe(false);

    act(() => result.current.setShowAllData(true));

    expect(result.current.state.metrics[metricIdA].showData).toBe(DEFAULT_METRIC_STATE.showData);
    expect(result.current.state.metrics[metricIdB].showData).toBe(DEFAULT_METRIC_STATE.showData);
  });

  it('hides/shows all spec limits for all metrics', () => {
    const { result } = renderHook(() => useMetricsGraphState({ metrics: mockMetrics }));

    expect(result.current.state.metrics[metricIdA].showSpecLimit).toBe(DEFAULT_METRIC_STATE.showSpecLimit);
    expect(result.current.state.metrics[metricIdB].showSpecLimit).toBe(DEFAULT_METRIC_STATE.showSpecLimit);

    act(() => result.current.setShowAllSpecLimits(true));

    expect(result.current.state.metrics[metricIdA].showSpecLimit).toBe(true);
    expect(result.current.state.metrics[metricIdB].showSpecLimit).toBe(true);

    act(() => result.current.setShowAllSpecLimits(false));

    expect(result.current.state.metrics[metricIdA].showSpecLimit).toBe(DEFAULT_METRIC_STATE.showSpecLimit);
    expect(result.current.state.metrics[metricIdB].showSpecLimit).toBe(DEFAULT_METRIC_STATE.showSpecLimit);
  });

  it('hides/shows all control limits for all metrics', () => {
    const { result } = renderHook(() => useMetricsGraphState({ metrics: mockMetrics }));

    expect(result.current.state.metrics[metricIdA].showControlLimit).toBe(DEFAULT_METRIC_STATE.showControlLimit);
    expect(result.current.state.metrics[metricIdB].showControlLimit).toBe(DEFAULT_METRIC_STATE.showControlLimit);

    act(() => result.current.setShowAllControlLimits(true));

    expect(result.current.state.metrics[metricIdA].showControlLimit).toBe(true);
    expect(result.current.state.metrics[metricIdB].showControlLimit).toBe(true);

    act(() => result.current.setShowAllControlLimits(false));

    expect(result.current.state.metrics[metricIdA].showControlLimit).toBe(DEFAULT_METRIC_STATE.showControlLimit);
    expect(result.current.state.metrics[metricIdB].showControlLimit).toBe(DEFAULT_METRIC_STATE.showControlLimit);
  });
});

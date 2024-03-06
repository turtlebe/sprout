import { clearLocalStorageTimeSummarization } from '@plentyag/app-environment/src/common/hooks/use-local-storage-time-summarization/test-helpers';
import { buildMetric, mockDashboards } from '@plentyag/app-environment/src/common/test-helpers';
import { DEFAULT_TIME_SUMMARIZATION } from '@plentyag/app-environment/src/common/utils/constants';
import { TimeSummarization } from '@plentyag/core/src/types/environment';
import { act, renderHook } from '@testing-library/react-hooks';

import { DEFAULT_METRIC_STATE, useDashboardGraphState } from '.';

import {
  clearDashboardGraphStateLocalStorage,
  getDashboardGraphStateLocalStorage,
  setDashboardGraphStateLocalStorage,
} from './test-helpers';

const [dashboard] = mockDashboards;
const metrics = [
  buildMetric({ measurementType: 'TEMPERATURE' }),
  buildMetric({ measurementType: 'TEMPERATURE' }),
  buildMetric({ measurementType: 'FLOW_RATE' }),
  buildMetric({ measurementType: 'FLOW_RATE' }),
];
const [metricIdA, metricIdB, metricIdC, metricIdD] = metrics.map(metric => metric.id);

describe('useDashboardGraphState', () => {
  beforeEach(() => {
    clearDashboardGraphStateLocalStorage();
    clearLocalStorageTimeSummarization();
  });

  it('returns an initial state', () => {
    const { result } = renderHook(() => useDashboardGraphState({ dashboard, metrics, measurementType: 'TEMPERATURE' }));

    const { state } = result.current;
    expect(state.timeSummarization).toBe(DEFAULT_TIME_SUMMARIZATION);

    expect(Object.keys(state.metrics)).toEqual(
      metrics.filter(metric => metric.measurementType === 'TEMPERATURE').map(metric => metric.id)
    );
    expect(state.metrics[metricIdA]).toEqual({
      showData: true,
      showSpecLimit: true,
      showControlLimit: true,
    });

    expect(getDashboardGraphStateLocalStorage()).toEqual(
      expect.objectContaining({ [dashboard.id]: expect.objectContaining({ TEMPERATURE: state }) })
    );
  });

  it('saves the state in local storage', () => {
    const { result } = renderHook(() => useDashboardGraphState({ dashboard, metrics, measurementType: 'TEMPERATURE' }));

    act(() => result.current.setTimeSummarization(TimeSummarization.mean));

    expect(result.current.state.timeSummarization).toBe(TimeSummarization.mean);
    expect(getDashboardGraphStateLocalStorage()).toEqual(
      expect.objectContaining({ [dashboard.id]: expect.objectContaining({ TEMPERATURE: result.current.state }) })
    );
  });

  it('loads the state from local storage', () => {
    const savedState = {
      timeSummarization: DEFAULT_TIME_SUMMARIZATION,

      metrics: {
        [metricIdA]: { showData: false, showSpecLimit: true, showControlLimit: false },
        [metricIdB]: { showData: false, showSpecLimit: true, showControlLimit: false },
      },
    };

    setDashboardGraphStateLocalStorage({ [dashboard.id]: { TEMPERATURE: savedState } });

    const { result } = renderHook(() => useDashboardGraphState({ dashboard, metrics, measurementType: 'TEMPERATURE' }));

    expect(result.current.state).toEqual(savedState);

    expect(getDashboardGraphStateLocalStorage()).toEqual(
      expect.objectContaining({ [dashboard.id]: expect.objectContaining({ TEMPERATURE: result.current.state }) })
    );
  });

  it('adds a new dashboard to the localStorage', () => {
    const dashboardAId = 'dashboard-a-id';
    const dashboardAState = {
      timeSummarization: TimeSummarization.mean,
      metrics: {
        [metricIdA]: { showData: false, showSpecLimit: true, showControlLimit: false },
        [metricIdB]: { showData: false, showSpecLimit: true, showControlLimit: false },
      },
    };
    const dashboardBState = {
      timeSummarization: TimeSummarization.median,
      metrics: {
        [metricIdA]: { showData: true, showSpecLimit: true, showControlLimit: true },
        [metricIdB]: { showData: true, showSpecLimit: true, showControlLimit: true },
      },
    };

    setDashboardGraphStateLocalStorage({ [dashboardAId]: { TEMPERATURE: dashboardAState } });

    const { result } = renderHook(() => useDashboardGraphState({ dashboard, metrics, measurementType: 'TEMPERATURE' }));

    expect(result.current.state).toEqual(dashboardBState);

    expect(getDashboardGraphStateLocalStorage()).toEqual(
      expect.objectContaining({
        [dashboardAId]: expect.objectContaining({ TEMPERATURE: dashboardAState }),
        [dashboard.id]: expect.objectContaining({ TEMPERATURE: dashboardBState }),
      })
    );
  });

  it('adds a new measurement type to the localStorage', () => {
    const dashboardAState = {
      timeSummarization: TimeSummarization.mean,
      metrics: {
        [metricIdA]: { showData: false, showSpecLimit: true, showControlLimit: false },
        [metricIdB]: { showData: false, showSpecLimit: true, showControlLimit: false },
      },
    };
    const dashboardBState = {
      timeSummarization: TimeSummarization.median,
      metrics: {
        [metricIdC]: { showData: true, showSpecLimit: true, showControlLimit: true },
        [metricIdD]: { showData: true, showSpecLimit: true, showControlLimit: true },
      },
    };

    setDashboardGraphStateLocalStorage({ [dashboard.id]: { TEMPERATURE: dashboardAState } });

    const { result } = renderHook(() => useDashboardGraphState({ dashboard, metrics, measurementType: 'FLOW_RATE' }));

    expect(result.current.state).toEqual(dashboardBState);

    expect(getDashboardGraphStateLocalStorage()).toEqual(
      expect.objectContaining({
        [dashboard.id]: expect.objectContaining({ TEMPERATURE: dashboardAState, FLOW_RATE: dashboardBState }),
      })
    );
  });

  it('adds a new metric to an existing dashboard', () => {
    const dashboardAState = {
      timeSummarization: TimeSummarization.mean,
      metrics: {
        [metricIdA]: { showData: false, showSpecLimit: true, showControlLimit: false },
      },
    };
    const dashboardBState = {
      timeSummarization: DEFAULT_TIME_SUMMARIZATION,
      metrics: {
        [metricIdA]: DEFAULT_METRIC_STATE,
        [metricIdB]: DEFAULT_METRIC_STATE,
      },
    };

    setDashboardGraphStateLocalStorage({ [dashboard.id]: { TEMPERATURE: dashboardAState } });

    const { result } = renderHook(() => useDashboardGraphState({ dashboard, metrics, measurementType: 'TEMPERATURE' }));

    expect(result.current.state).toEqual(dashboardBState);

    expect(getDashboardGraphStateLocalStorage()).toEqual(
      expect.objectContaining({
        [dashboard.id]: expect.objectContaining({ TEMPERATURE: dashboardBState }),
      })
    );
  });

  it('changes the time summarization', () => {
    const { result } = renderHook(() => useDashboardGraphState({ dashboard, metrics, measurementType: 'TEMPERATURE' }));

    expect(result.current.state.timeSummarization).toBe(DEFAULT_TIME_SUMMARIZATION);

    act(() => result.current.setTimeSummarization(TimeSummarization.mean));

    expect(result.current.state.timeSummarization).toBe(TimeSummarization.mean);
  });

  it('hides/shows data for a given metric', () => {
    const { result } = renderHook(() => useDashboardGraphState({ dashboard, metrics, measurementType: 'TEMPERATURE' }));

    expect(result.current.state.metrics[metricIdA].showData).toBe(true);
    expect(result.current.state.metrics[metricIdB].showData).toBe(true);

    act(() => result.current.setShowData(metricIdA, false));

    expect(result.current.state.metrics[metricIdA].showData).toBe(false);
    expect(result.current.state.metrics[metricIdB].showData).toBe(true);

    act(() => result.current.setShowData(metricIdA, true));

    expect(result.current.state.metrics[metricIdA].showData).toBe(true);
    expect(result.current.state.metrics[metricIdB].showData).toBe(true);
  });

  it('hides/shows spec limit for a given metric', () => {
    const { result } = renderHook(() => useDashboardGraphState({ dashboard, metrics, measurementType: 'TEMPERATURE' }));

    expect(result.current.state.metrics[metricIdA].showSpecLimit).toBe(true);
    expect(result.current.state.metrics[metricIdB].showSpecLimit).toBe(true);

    act(() => result.current.setShowSpecLimit(metricIdA, false));

    expect(result.current.state.metrics[metricIdA].showSpecLimit).toBe(false);
    expect(result.current.state.metrics[metricIdB].showSpecLimit).toBe(true);

    act(() => result.current.setShowSpecLimit(metricIdA, true));

    expect(result.current.state.metrics[metricIdA].showSpecLimit).toBe(true);
    expect(result.current.state.metrics[metricIdB].showSpecLimit).toBe(true);
  });

  it('hides/shows control limit for a given metric', () => {
    const { result } = renderHook(() => useDashboardGraphState({ dashboard, metrics, measurementType: 'TEMPERATURE' }));

    expect(result.current.state.metrics[metricIdA].showControlLimit).toBe(true);
    expect(result.current.state.metrics[metricIdB].showControlLimit).toBe(true);

    act(() => result.current.setShowControlLimit(metricIdA, false));

    expect(result.current.state.metrics[metricIdA].showControlLimit).toBe(false);
    expect(result.current.state.metrics[metricIdB].showControlLimit).toBe(true);

    act(() => result.current.setShowControlLimit(metricIdA, true));

    expect(result.current.state.metrics[metricIdA].showControlLimit).toBe(true);
    expect(result.current.state.metrics[metricIdB].showControlLimit).toBe(true);
  });

  it('hides/shows all data for all metrics', () => {
    const { result } = renderHook(() => useDashboardGraphState({ dashboard, metrics, measurementType: 'TEMPERATURE' }));

    expect(result.current.state.metrics[metricIdA].showData).toBe(true);
    expect(result.current.state.metrics[metricIdB].showData).toBe(true);

    act(() => result.current.setShowAllData(false));

    expect(result.current.state.metrics[metricIdA].showData).toBe(false);
    expect(result.current.state.metrics[metricIdB].showData).toBe(false);

    act(() => result.current.setShowAllData(true));

    expect(result.current.state.metrics[metricIdA].showData).toBe(true);
    expect(result.current.state.metrics[metricIdB].showData).toBe(true);
  });

  it('hides/shows all spec limits for all metrics', () => {
    const { result } = renderHook(() => useDashboardGraphState({ dashboard, metrics, measurementType: 'TEMPERATURE' }));

    expect(result.current.state.metrics[metricIdA].showSpecLimit).toBe(true);
    expect(result.current.state.metrics[metricIdB].showSpecLimit).toBe(true);

    act(() => result.current.setShowAllSpecLimits(false));

    expect(result.current.state.metrics[metricIdA].showSpecLimit).toBe(false);
    expect(result.current.state.metrics[metricIdB].showSpecLimit).toBe(false);

    act(() => result.current.setShowAllSpecLimits(true));

    expect(result.current.state.metrics[metricIdA].showSpecLimit).toBe(true);
    expect(result.current.state.metrics[metricIdB].showSpecLimit).toBe(true);
  });

  it('hides/shows all control limits for all metrics', () => {
    const { result } = renderHook(() => useDashboardGraphState({ dashboard, metrics, measurementType: 'TEMPERATURE' }));

    expect(result.current.state.metrics[metricIdA].showControlLimit).toBe(true);
    expect(result.current.state.metrics[metricIdB].showControlLimit).toBe(true);

    act(() => result.current.setShowAllControlLimits(false));

    expect(result.current.state.metrics[metricIdA].showControlLimit).toBe(false);
    expect(result.current.state.metrics[metricIdB].showControlLimit).toBe(false);

    act(() => result.current.setShowAllControlLimits(true));

    expect(result.current.state.metrics[metricIdA].showControlLimit).toBe(true);
    expect(result.current.state.metrics[metricIdB].showControlLimit).toBe(true);
  });
});

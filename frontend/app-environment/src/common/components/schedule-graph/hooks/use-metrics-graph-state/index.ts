import { useLocalStorageTimeSummarization } from '@plentyag/app-environment/src/common/hooks';
import { Metric, TimeSummarization } from '@plentyag/core/src/types/environment';
import React from 'react';

export const DEFAULT_METRIC_STATE = { showSpecLimit: false, showControlLimit: false, showData: true };

/**
 * State for a given metric
 *
 * - Show/Hide the Spec Limit
 * - Show/Hide the Control Limit
 * - Show/Hide the Data
 */
export interface GraphMetricState {
  showSpecLimit: boolean;
  showControlLimit: boolean;
  showData: boolean;
}

/**
 * State for a given <ScheduleGraph />.
 *
 * It contains a GraphMetricState per Metric + timeSummarization
 */
export interface GraphState {
  timeSummarization: TimeSummarization;
  metrics: {
    [metricId: string]: GraphMetricState;
  };
}

export interface UseMetricsGraphState {
  metrics: Metric[];
}

export interface UseMetricsGraphStateReturn {
  state: GraphState;
  setTimeSummarization: (timeSummarization: TimeSummarization) => void;
  setShowData: (metricId: string, show: boolean) => void;
  setShowSpecLimit: (metricId: string, show: boolean) => void;
  setShowControlLimit: (metricId: string, show: boolean) => void;
  setShowAllData: (show: boolean) => void;
  setShowAllSpecLimits: (show: boolean) => void;
  setShowAllControlLimits: (show: boolean) => void;
}

/**
 * Hook storing the state of what the user would like to see on a <ScheduleGraph />.
 *
 * This allows the user to hide/show observations and or alert rules per metrics.
 *
 * The state is NOT persisted in localStorage.
 */
export const useMetricsGraphState = ({ metrics = [] }: UseMetricsGraphState): UseMetricsGraphStateReturn => {
  const [timeSummarization, setLocalTimeSummarization] = useLocalStorageTimeSummarization();

  // Default state
  const [state, setState] = React.useState<GraphState>({
    timeSummarization,
    metrics: metrics.reduce<GraphState['metrics']>((result, metric) => {
      result[metric.id] = DEFAULT_METRIC_STATE;

      return result;
    }, {}),
  });

  React.useEffect(() => {
    if (!Object.keys(state.metrics).length && metrics.length > 0) {
      setState({
        ...state,
        metrics: metrics.reduce<GraphState['metrics']>((result, metric) => {
          result[metric.id] = DEFAULT_METRIC_STATE;

          return result;
        }, {}),
      });
    }
  }, [metrics]);

  const setMetricState = React.useCallback(
    (metricId: string, attributeName: keyof GraphMetricState, show: boolean) => {
      setState({
        ...state,
        metrics: {
          ...state.metrics,
          [metricId]: { ...state.metrics[metricId], [attributeName]: show },
        },
      });
    },
    [state]
  );

  const setAllMetricsState = React.useCallback(
    (attributeName: keyof GraphMetricState, show: boolean) => {
      setState({
        ...state,
        metrics: metrics.reduce<GraphState['metrics']>((result, metric) => {
          result[metric.id] = {
            ...state.metrics[metric.id],
            [attributeName]: show,
          };

          return result;
        }, {}),
      });
    },
    [state]
  );

  const setTimeSummarization: UseMetricsGraphStateReturn['setTimeSummarization'] = timeSummarization => {
    setLocalTimeSummarization(timeSummarization);
    setState({ ...state, timeSummarization });
  };

  const setShowData: UseMetricsGraphStateReturn['setShowData'] = (metricId, show) => {
    setMetricState(metricId, 'showData', show);
  };

  const setShowSpecLimit: UseMetricsGraphStateReturn['setShowSpecLimit'] = (metricId, show) => {
    setMetricState(metricId, 'showSpecLimit', show);
  };

  const setShowControlLimit: UseMetricsGraphStateReturn['setShowControlLimit'] = (metricId, show) => {
    setMetricState(metricId, 'showControlLimit', show);
  };

  const setShowAllData: UseMetricsGraphStateReturn['setShowAllData'] = show => {
    setAllMetricsState('showData', show);
  };

  const setShowAllSpecLimits: UseMetricsGraphStateReturn['setShowAllSpecLimits'] = show => {
    setAllMetricsState('showSpecLimit', show);
  };

  const setShowAllControlLimits: UseMetricsGraphStateReturn['setShowAllControlLimits'] = show => {
    setAllMetricsState('showControlLimit', show);
  };

  return {
    state,
    setTimeSummarization,
    setShowData,
    setShowSpecLimit,
    setShowControlLimit,
    setShowAllData,
    setShowAllSpecLimits,
    setShowAllControlLimits,
  };
};

import { useLocalStorageTimeSummarization } from '@plentyag/app-environment/src/common/hooks';
import { Dashboard, Metric, TimeSummarization } from '@plentyag/core/src/types/environment';
import { isEqual } from 'lodash';
import React from 'react';
import { useLocalStorage } from 'react-use';

export const LOCAL_STORAGE_KEY = 'environment-v2-dashboards-graph-states';
export const DEFAULT_METRIC_STATE = { showSpecLimit: true, showControlLimit: true, showData: true };

const filterByMeasurementType = (measurementType: string) => (metric: Metric) =>
  metric.measurementType === measurementType;

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
 * State for a given <DashboardGraph/>.
 *
 * It contains a GraphMetricState per Metric + timeSummarization
 */
export interface GraphState {
  timeSummarization: TimeSummarization;
  metrics: {
    [metricId: string]: GraphMetricState;
  };
}

/**
 * Type of the full state saved in local storage. Each GraphState is scoped by Dashboard and MeasurementType.
 */
export interface LocalStorageState {
  [dashboardId: string]: {
    [measurementType: string]: GraphState;
  };
}

export interface UseDashboardGraphState {
  dashboard: Dashboard;
  metrics: Metric[];
  measurementType: string;
}

export interface UseDashboardGraphStateReturn {
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
 * Hook storing the state of what the user would like to see on a <DashboardGraph />.
 *
 * This allows the user to hide/show observations and or alert rules per metrics.
 *
 * The state is persisted in localStorage to remember the users' choice.
 *
 */
export const useDashboardGraphState = ({
  dashboard,
  metrics = [],
  measurementType,
}: UseDashboardGraphState): UseDashboardGraphStateReturn => {
  const [timeSummarization, setLocalStorageTimeSummarization] = useLocalStorageTimeSummarization();
  const byMeasurementType = filterByMeasurementType(measurementType);

  // Default scoped state for a given dashboard + measurement type
  const [state, setState] = React.useState<GraphState>({
    timeSummarization,
    metrics: metrics.filter(byMeasurementType).reduce<GraphState['metrics']>((result, metric) => {
      result[metric.id] = DEFAULT_METRIC_STATE;

      return result;
    }, {}),
  });

  // When localStore is empty, initialize it with the scoped state
  const [localStorage, setLocalStorage] = useLocalStorage<LocalStorageState>(LOCAL_STORAGE_KEY, {
    [dashboard.id]: { [measurementType]: state },
  });

  React.useEffect(() => {
    if (
      !localStorage[dashboard.id] ||
      !localStorage[dashboard.id][measurementType] ||
      !isEqual(Object.keys(localStorage[dashboard.id][measurementType].metrics), Object.keys(state.metrics))
    ) {
      // If the dashboard and/or measurement type does not exist in the localStorage,
      // Then add the default scoped state to it.
      setLocalStorage({ ...localStorage, [dashboard.id]: { ...localStorage[dashboard.id], [measurementType]: state } });
    } else {
      // Otherwise update the scoped state with the state from the localStorage.
      setState({ ...localStorage[dashboard.id][measurementType], timeSummarization });
    }
  }, [localStorage, dashboard.id, measurementType]);

  const setMetricState = React.useCallback(
    (metricId: string, attributeName: keyof GraphMetricState, show: boolean) => {
      setLocalStorage({
        ...localStorage,
        [dashboard.id]: {
          ...localStorage[dashboard.id],
          [measurementType]: {
            ...localStorage[dashboard.id][measurementType],
            metrics: {
              ...localStorage[dashboard.id][measurementType].metrics,
              [metricId]: { ...localStorage[dashboard.id][measurementType].metrics[metricId], [attributeName]: show },
            },
          },
        },
      });
    },
    [localStorage]
  );

  const setAllMetricsState = React.useCallback(
    (attributeName: keyof GraphMetricState, show: boolean) => {
      setLocalStorage({
        ...localStorage,
        [dashboard.id]: {
          ...localStorage[dashboard.id],
          [measurementType]: {
            ...localStorage[dashboard.id][measurementType],
            metrics: {
              ...metrics.filter(byMeasurementType).reduce((result, metric) => {
                result[metric.id] = {
                  ...localStorage[dashboard.id][measurementType].metrics[metric.id],
                  [attributeName]: show,
                };

                return result;
              }, {}),
            },
          },
        },
      });
    },
    [localStorage]
  );

  const setTimeSummarization: UseDashboardGraphStateReturn['setTimeSummarization'] = timeSummarization => {
    setLocalStorageTimeSummarization(timeSummarization);
    setLocalStorage({
      ...localStorage,
      [dashboard.id]: {
        ...localStorage[dashboard.id],
        [measurementType]: {
          ...localStorage[dashboard.id][measurementType],
          timeSummarization,
        },
      },
    });
  };

  const setShowData: UseDashboardGraphStateReturn['setShowData'] = (metricId, show) => {
    setMetricState(metricId, 'showData', show);
  };

  const setShowSpecLimit: UseDashboardGraphStateReturn['setShowSpecLimit'] = (metricId, show) => {
    setMetricState(metricId, 'showSpecLimit', show);
  };

  const setShowControlLimit: UseDashboardGraphStateReturn['setShowControlLimit'] = (metricId, show) => {
    setMetricState(metricId, 'showControlLimit', show);
  };

  const setShowAllData: UseDashboardGraphStateReturn['setShowAllData'] = show => {
    setAllMetricsState('showData', show);
  };

  const setShowAllSpecLimits: UseDashboardGraphStateReturn['setShowAllSpecLimits'] = show => {
    setAllMetricsState('showSpecLimit', show);
  };

  const setShowAllControlLimits: UseDashboardGraphStateReturn['setShowAllControlLimits'] = show => {
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

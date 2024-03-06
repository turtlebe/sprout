import {
  AlertRule,
  AlertRuleType,
  DataInterpolation,
  DataInterpolationType,
  Metric,
  Schedule,
  TimeGranularity,
  TimeSummarization,
} from '@plentyag/core/src/types/environment';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';

export const COLORS = {
  controlLimit: 'rgba(46, 154, 72, 0.5)',
  controlLimitStroke: '#006648',
  data: '#0275d8',
  dataNonNumerical: '#7aa8e8',
  schedule: '#54478c',
  specLimit: 'rgba(254, 217, 32, 0.5)',
  specLimitDevices: 'rgba(255,175,54,0.5)',
  specLimitDevicesStroke: '#DB995A',
  specLimitStroke: '#dda906',
  today: '#004085',
  liveMetricRange: '#636363',
  liveMetricRangeBackground: '#adadad',
};

const days = (n: number): number => 24 * 60 * n;

export const timeGranularities: TimeGranularity[] = [
  { label: '1 minute', value: 1, maxDurationWindow: days(2) },
  { label: '5 minutes', value: 5, default: true, maxDurationWindow: days(3) },
  { label: '15 minutes', value: 15, maxDurationWindow: days(4) },
  { label: '30 minutes', value: 30, maxDurationWindow: days(4) },
  { label: '1 hour', value: 60 },
  { label: '3 hours', value: 60 * 3 },
  { label: '6 hours', value: 60 * 6 },
];

export const timeGranularitiesNonNumerical: TimeGranularity[] = [
  { label: '5 minutes', value: 5, default: true },
  { label: '15 minutes', value: 15 },
  { label: '30 minutes', value: 30 },
  { label: '1 hour', value: 60 },
  { label: '1/2 day', value: 60 * 12 },
  { label: '1 day', value: 60 * 24 },
];

export const dataInterpolations: DataInterpolation[] = [
  { label: 'Default', value: DataInterpolationType.default },
  { label: 'Step', value: DataInterpolationType.step },
];

export const WIDTH = 1000;
export const HEIGHT = 480;
export const PADDING_X = 64;
export const PADDING_Y = 32;
export const DEFAULT_TIME_GRANULARITY = timeGranularities.find(timeGranularity => timeGranularity.default);
export const DEFAULT_TIME_GRANULARITY_NON_NUMERICAL = timeGranularitiesNonNumerical.find(
  timeGranularity => timeGranularity.default
);
export const DEFAULT_TIME_SUMMARIZATION = TimeSummarization.median;
export const DEFAULT_DATA_INTERPOLATION = dataInterpolations.find(
  dataInterpolation => dataInterpolation.value === DataInterpolationType.default
);

// 24 hours in seconds
export const ONE_DAY = 86400;

export const PATTERNS_DATA = [
  {
    name: AlertRuleType.specLimit,
    width: 8,
    rotate: 0,
    color: COLORS.specLimit,
  },
  {
    name: AlertRuleType.specLimitDevices,
    width: 8,
    rotate: 45,
    color: COLORS.specLimitDevices,
  },
  {
    name: AlertRuleType.controlLimit,
    width: 4,
    rotate: 90,
    color: COLORS.controlLimit,
  },
];

export const RADIUSES = {
  sm: 4,
  md: 8,
  lg: 12,
};

export const OPACITIES = {
  faded: 0.2,
  default: 1,
};

export const HANDLER_INFO = {
  top: 16,
  left: 16,
};

export const MOUSE_OVER_EFFECT = {
  mouseOutOpacity: 0,
  mouseOverOpacity: 0.8,
  circleRadius: 3,
  container: 'mouse-over',
  circles: {
    observations: 'observations',
    metrics: (metric: Metric) => `metrics-${metric.id}`,
    alertRuleMin: (alertRule: AlertRule) => `alert-rule-min-${alertRule.id}`,
    alertRuleMax: (alertRule: AlertRule) => `alert-rule-max-${alertRule.id}`,
    schedule: (schedule: Schedule, key: string) => `schedule-${schedule.id}-${key}`,
  },
};

export const dataTestIdsGraphTooltip = getScopedDataTestIds(
  {
    time: 'time',
    alertRule: (alertRule: AlertRule) => `alert-rule-${alertRule.id}`,
    metricWithObservations: (metric: Metric) => `metric-with-observations-${metric.id}`,
    observation: 'observation',
    scheduleHeader: (schedule: Schedule) => `schedule-${schedule.id}`,
    scheduleWithKey: (schedule: Schedule, key: string) => `schedule-${schedule.id}-${key ?? ''}`,
  },
  'graph-tooltip'
);

export type DataTestIdsGraphTooltip = typeof dataTestIdsGraphTooltip;

export const d3Classes = {
  frame: 'frame',
  handleFrame: 'handle-frame',
  handleFrameInfo: 'handle-frame-info',
  handleInfo: 'handle-info',
  alertRuleArea: 'alert-rule-area',
};

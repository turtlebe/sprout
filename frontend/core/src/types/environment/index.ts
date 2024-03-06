import { Observation, RolledUpByTimeObservation, XAxisScaleType, YAxisScaleType } from '@plentyag/core/src/types';

export type { XAxisScaleType, YAxisScaleType };

export interface Point<T = number> {
  time: T;

  /**
   * Simple boolean flag that should be used when creating extra points.
   *
   * This helps filter points later on to draw handles.
   */
  isVirtual?: boolean;
}

export interface DefaultModel {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface UnitConfig {
  min: number;
  max: number;
}

export interface Metric extends DefaultModel {
  path: string;
  measurementType: string;
  observationName: string;
  unitConfig: UnitConfig;
  alertRules: AlertRule[];
}

export interface UsersMetric extends DefaultModel {
  metricId: string;
  username;
  metric?: Metric;
}

export enum AlertRuleType {
  specLimit = 'SPEC_LIMIT',
  specLimitDevices = 'SPEC_LIMIT_DEVICES',
  controlLimit = 'CONTROL_LIMIT',
  nonNumerical = 'NON_NUMERICAL',
}

export enum AlertStatusType {
  on = 'On',
  off = 'Off',
  snoozed = 'Snoozed',
}

export enum InterpolationType {
  none = 'NONE',
  linear = 'LINEAR',
}

export interface Rule<T = number> extends Point<T> {
  gte?: number;
  lte?: number;
  gt?: number;
  lt?: number;
  eq?: string;
  neq?: string;
  _in?: string[];
  nin?: string[];
  contains?: string;
  ncontains?: string;
}

export enum LiveStatus {
  outOfRange = 'OUT_OF_RANGE',
  inRange = 'IN_RANGE',
  noData = 'NO_DATA',
}

export enum AlertEventStatus {
  triggered = 'TRIGGERED',
  resolved = 'RESOLVED',
  noDataTriggered = 'NO_DATA_TRIGGERED',
  noDataResolved = 'NO_DATA_RESOLVED',
}

export interface NotificationEvent extends DefaultModel {
  alertEventIds: string[];
  alertRuleId: string;
  generatedAt: string;
  status: AlertEventStatus;
  subscriptionId: string;
  metricId: string;
}

export interface AlertEvent extends DefaultModel {
  generatedAt: string;
  status: AlertEventStatus;
  observationId: string;
  observationData?: Observation[];
  alertRuleId: string;
  alertRule?: AlertRule;
}

export interface AlertRule extends DefaultModel {
  alertRuleType: AlertRuleType;
  description?: string;
  endsAt?: string;
  isEnabled: boolean;
  metricId: string;
  metric?: Metric;
  subscriptions?: Subscription[];
  priority: number;
  rules: Rule[];
  repeatInterval: number;
  interpolationType: InterpolationType;
  noDataTimeout: number;
  durationWindowSize: number;
  durationWindowSizeResolve: number;
  snoozedUntil?: string;
  startsAt: string;
  tags?: string[];
  isStateless?: boolean;
}

export interface AlertRuleWithLiveStatus extends AlertRule {
  status: LiveStatus;
}

export enum AlertState {
  on = 'Alerts ON',
  off = 'Alerts OFF',
  snoozed = 'Alerts Snoozed',
}

export enum TabType {
  alertRule = 'alert-rule',
  schedule = 'schedule',
  alertEvents = 'alert-events',
  data = 'data',
}

export interface Action<T = number> extends Point<T> {
  valueType: 'SINGLE_VALUE' | 'MULTIPLE_VALUE';
  value?: string;
  values?: { [key: string]: string };
}

export enum ScheduleType {
  CONTINUOUS = 'CONTINUOUS',
  EVENT = 'EVENT',
}

export interface Schedule extends DefaultModel {
  path: string;
  scheduleType: ScheduleType;
  description: string;
  startsAt: string;
  endsAt?: string;
  activatesAt: string;
  repeatInterval: number;
  interpolationType?: InterpolationType;
  priority: number;
  actions: Action[];
}

export enum SubscriptionMethod {
  opsGenie = 'OPS_GENIE',
  slack = 'SLACK',
}

export enum SubscriptionNotificationType {
  default = 'DEFAULT',
  noData = 'NO_DATA',
}

export enum SubscriptionMethodDisplay {
  OPS_GENIE = 'Opsgenie',
  SLACK = 'Slack',
}

export enum SubscriptionPriority {
  p1 = 'P1',
  p2 = 'P2',
  p3 = 'P3',
  p4 = 'P4',
  p5 = 'P5',
}

export interface Subscription extends DefaultModel {
  notificationType: SubscriptionNotificationType;
  method: SubscriptionMethod;
  to: string;
  priority?: SubscriptionPriority;
  description?: string;
  subscribableId?: string;
  subscribableType?: string;
  notificationDuration?: number;
  notificationThreshold?: number;
  notificationDistinctSource?: boolean;
  renotifyPeriod?: number;
  tags?: string[];
}

export interface Dashboard extends DefaultModel {
  name: string;
}

export interface ReferableItem {
  itemType: 'METRIC' | 'SCHEDULE';
  itemId: string;
  metric?: Metric;
  schedule?: Schedule;
}

export enum WidgetType {
  historical = 'HISTORICAL',
  liveMetric = 'LIVE_METRIC',
  liveGroup = 'LIVE_GROUP',
}

export interface Widget extends DefaultModel {
  dashboardId: string;
  widgetType: WidgetType;
  name: string;
  rowStart: number;
  colStart: number;
  rowEnd: number;
  colEnd: number;
  items: WidgetItem[];
}

export interface WidgetItem extends DefaultModel, ReferableItem {
  widgetId: string;
  options: { [key: string]: string };
}

export interface GridEmptySlot {
  id?: string;
  rowStart: number;
  colStart: number;
  rowEnd: number;
  colEnd: number;
}

export interface GridWidgetItemProps {
  widget: Widget;
  onDeleted: () => void;
  startDateTime?: Date;
  endDateTime?: Date;
}

export interface UsersDashboard extends DefaultModel {
  dashboardId: string;
  username;
  dashboard?: Dashboard;
}

/**
 * Type of the Schedules' setpoints values or AlertRules's min/max range.
 */
export type YAxisValueType = number | string;

export type ConvertUnitFunction<T> = (conversionFn: (value: YAxisValueType) => number) => (model: T) => T;

/**
 * Type of the RedisJsonObject for the BulkApply Workflow.
 */
export interface BulkApplyWorkflow {
  metricIds: string[];
}

/**
 * The different type of sources reporting for a given Metric.
 */
export enum SourceType {
  ignition = 'ignition',
  device = 'device',
  derived = 'derived',
  other = 'other',
}

/**
 * The different Time Summarization to view the data.
 */
export enum TimeSummarization {
  median = 'median',
  mean = 'mean',
  min = 'min',
  max = 'max',
  value = 'value',
}

/**
 * Time Granularity to view the data.
 *
 * All the units number in this type are in minutes.
 */
export interface TimeGranularity {
  label: string;
  value: number;
  default?: boolean;
  maxDurationWindow?: number;
}

export interface ObservationsByTime {
  rolledUpAt: string;
  observations: RolledUpByTimeObservation[];
}

export enum DataInterpolationType {
  default = 'default',
  step = 'step',
}

export interface DataInterpolation {
  label: string;
  value: DataInterpolationType;
}

export enum TooltipPositioning {
  default = 'DEFAULT',
  grid = 'GRID',
}

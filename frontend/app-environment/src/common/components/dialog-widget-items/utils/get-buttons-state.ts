import { isNumericalMeasurementType } from '@plentyag/app-environment/src/common/utils';
import { WidgetItem } from '@plentyag/core/src/types/environment';

export interface GetButtonsState {
  items: WidgetItem[];
  scheduleLimit?: number;
  metricLimit?: number;
  nonNumericalMetricLimit?: number;
  scheduleOrAlertRuleOnly?: boolean;
}

export interface GetButtonsStateReturn {
  isAddMetricDisabled: boolean;
  isAddScheduleDisabled: boolean;
}

export function getButtonsState({
  items,
  scheduleLimit,
  metricLimit,
  nonNumericalMetricLimit,
  scheduleOrAlertRuleOnly,
}: GetButtonsState): GetButtonsStateReturn {
  let metricCount = 0;
  let nonNumericalMetricCount = 0;
  let scheduleCount = 0;

  items.forEach(item => {
    if (item.itemType === 'METRIC') {
      metricCount += 1;
      if (!isNumericalMeasurementType(item.metric.measurementType)) {
        nonNumericalMetricCount += 1;
      }
    }

    if (item.itemType === 'SCHEDULE') {
      scheduleCount += 1;
    }
  });

  const isAddScheduleDisabled = scheduleLimit ? scheduleLimit <= scheduleCount : false;
  let isAddMetricDisabled = false;

  if (nonNumericalMetricLimit) {
    isAddMetricDisabled = nonNumericalMetricLimit <= nonNumericalMetricCount;
  } else if (metricLimit) {
    isAddMetricDisabled = metricLimit <= metricCount;
  }

  if (scheduleOrAlertRuleOnly) {
    if (metricCount > 0) {
      return { isAddScheduleDisabled: true, isAddMetricDisabled };
    }

    if (scheduleCount > 0) {
      return { isAddScheduleDisabled, isAddMetricDisabled: true };
    }
  }

  return {
    isAddScheduleDisabled,
    isAddMetricDisabled,
  };
}

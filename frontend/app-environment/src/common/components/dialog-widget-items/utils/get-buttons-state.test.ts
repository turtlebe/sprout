import { buildMetric, buildSchedule, buildWidgetItem } from '@plentyag/app-environment/src/common/test-helpers';

import { getButtonsState } from './get-buttons-state';

describe('getButtonsState', () => {
  it('returns false by default', () => {
    expect(getButtonsState({ items: [] })).toEqual({ isAddMetricDisabled: false, isAddScheduleDisabled: false });
  });

  it('limits numerical metrics', () => {
    const items = [buildWidgetItem(buildMetric({ measurementType: 'TEMPERATURE' }))];
    const items2 = [buildWidgetItem(buildMetric({ measurementType: 'BINARY_STATE' }))];

    expect(getButtonsState({ items })).toEqual({ isAddMetricDisabled: false, isAddScheduleDisabled: false });
    expect(getButtonsState({ items, metricLimit: 1 })).toEqual({
      isAddMetricDisabled: true,
      isAddScheduleDisabled: false,
    });
    expect(getButtonsState({ items: items2, metricLimit: 1 })).toEqual({
      isAddMetricDisabled: true,
      isAddScheduleDisabled: false,
    });
  });

  it('limits non numerical metrics', () => {
    const items = [buildWidgetItem(buildMetric({ measurementType: 'TEMPERATURE' }))];
    const items2 = [buildWidgetItem(buildMetric({ measurementType: 'BINARY_STATE' }))];

    expect(getButtonsState({ items })).toEqual({ isAddMetricDisabled: false, isAddScheduleDisabled: false });
    expect(getButtonsState({ items, nonNumericalMetricLimit: 1 })).toEqual({
      isAddMetricDisabled: false,
      isAddScheduleDisabled: false,
    });
    expect(getButtonsState({ items: items2, nonNumericalMetricLimit: 1 })).toEqual({
      isAddMetricDisabled: true,
      isAddScheduleDisabled: false,
    });
  });

  it('limits schedules', () => {
    const items = [buildWidgetItem(buildSchedule({}))];

    expect(getButtonsState({ items })).toEqual({ isAddMetricDisabled: false, isAddScheduleDisabled: false });
    expect(getButtonsState({ items, scheduleLimit: 1 })).toEqual({
      isAddMetricDisabled: false,
      isAddScheduleDisabled: true,
    });
  });

  it('allows only metrics', () => {
    const items = [buildWidgetItem(buildMetric({}))];

    expect(getButtonsState({ items })).toEqual({ isAddMetricDisabled: false, isAddScheduleDisabled: false });
    expect(getButtonsState({ items, scheduleOrAlertRuleOnly: true })).toEqual({
      isAddMetricDisabled: false,
      isAddScheduleDisabled: true,
    });
  });

  it('allows only schedules', () => {
    const items = [buildWidgetItem(buildSchedule({}))];

    expect(getButtonsState({ items })).toEqual({ isAddMetricDisabled: false, isAddScheduleDisabled: false });
    expect(getButtonsState({ items, scheduleOrAlertRuleOnly: true })).toEqual({
      isAddMetricDisabled: true,
      isAddScheduleDisabled: false,
    });
  });

  it('allows either one schedule, one non-numerical metric, or many metrics', () => {
    const spec = { scheduleLimit: 1, nonNumericalMetricLimit: 1, scheduleOrAlertRuleOnly: true };

    expect(getButtonsState({ items: [], ...spec })).toEqual({
      isAddMetricDisabled: false,
      isAddScheduleDisabled: false,
    });
    expect(getButtonsState({ items: [buildWidgetItem(buildSchedule({}))], ...spec })).toEqual({
      isAddMetricDisabled: true,
      isAddScheduleDisabled: true,
    });
    expect(
      getButtonsState({ items: [buildWidgetItem(buildMetric({ measurementType: 'BINARY_STATE' }))], ...spec })
    ).toEqual({
      isAddMetricDisabled: true,
      isAddScheduleDisabled: true,
    });
    expect(
      getButtonsState({ items: [buildWidgetItem(buildMetric({ measurementType: 'TEMPERATURE' }))], ...spec })
    ).toEqual({
      isAddMetricDisabled: false,
      isAddScheduleDisabled: true,
    });
  });
});

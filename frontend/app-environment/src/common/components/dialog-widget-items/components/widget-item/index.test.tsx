import {
  buildAlertRule,
  buildMetric,
  buildSchedule,
  buildWidgetItem,
} from '@plentyag/app-environment/src/common/test-helpers';
import { getAlertRuleTypeLabel, getMeasurementTypeLabel } from '@plentyag/app-environment/src/common/utils';
import { Metric, Schedule, WidgetItem as WidgetItemType } from '@plentyag/core/src/types/environment';
import { getShortenedPath } from '@plentyag/core/src/utils';
import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsWidgetItem as dataTestIds, WidgetItem } from '.';

const onDelete = jest.fn();
const onEdit = jest.fn();

function renderWidgetItem({ item, disabled }: Partial<WidgetItem>) {
  return render(<WidgetItem item={item} onDelete={onDelete} onEdit={onEdit} disabled={disabled} />);
}

function getWidgetItem(metricOrSchedule: Metric | Schedule, options?: {}): WidgetItemType {
  return { ...buildWidgetItem(metricOrSchedule), options };
}

describe('WidgetItem', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renders a Metric', () => {
    const item = getWidgetItem(buildMetric({}));

    const { container } = renderWidgetItem({ item });

    expect(container).toHaveTextContent('Metric');
    expect(container).toHaveTextContent(getShortenedPath(item.metric.path));
    expect(container).toHaveTextContent(getMeasurementTypeLabel(item.metric.measurementType));
    expect(container).toHaveTextContent(item.metric.observationName);
  });

  it('renders a Metric with a Schedule', () => {
    const alertRule = buildAlertRule({});
    const item = getWidgetItem(buildMetric({ alertRules: [alertRule] }), { alertRuleId: alertRule.id });

    const { container } = renderWidgetItem({ item });

    expect(container).toHaveTextContent(getAlertRuleTypeLabel(alertRule.alertRuleType));
    expect(container).toHaveTextContent(alertRule.description);
  });

  it('renders a Schedule', () => {
    const item = getWidgetItem(buildSchedule({}));

    const { container } = renderWidgetItem({ item });

    expect(container).toHaveTextContent('Schedule');
    expect(container).toHaveTextContent(getShortenedPath(item.schedule.path));
  });

  it('calls "onDelete"', () => {
    const item = getWidgetItem(buildMetric({}));

    const { queryByTestId } = renderWidgetItem({ item });

    expect(queryByTestId(dataTestIds.delete)).not.toBeInTheDocument();

    queryByTestId(dataTestIds.dropdown).click();

    expect(queryByTestId(dataTestIds.delete)).toBeInTheDocument();
    expect(onDelete).not.toHaveBeenCalled();

    queryByTestId(dataTestIds.delete).click();

    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith(item);
  });

  it('calls "onEdit"', () => {
    const item = getWidgetItem(buildMetric({}));

    const { queryByTestId } = renderWidgetItem({ item });

    expect(queryByTestId(dataTestIds.edit)).not.toBeInTheDocument();

    queryByTestId(dataTestIds.dropdown).click();

    expect(queryByTestId(dataTestIds.edit)).toBeInTheDocument();
    expect(onEdit).not.toHaveBeenCalled();

    queryByTestId(dataTestIds.edit).click();

    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onEdit).toHaveBeenCalledWith(item);
  });

  it('renders with a disabled state', () => {
    const item = getWidgetItem(buildMetric({}));

    const { queryByTestId } = renderWidgetItem({ item, disabled: true });

    expect(queryByTestId(dataTestIds.dropdown)).toBeDisabled();
  });
});

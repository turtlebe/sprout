import { DialogWidgetItems, LiveMetric } from '@plentyag/app-environment/src/common/components';
import { buildMetric, buildWidget, buildWidgetItem } from '@plentyag/app-environment/src/common/test-helpers';
import { Metric } from '@plentyag/core/src/types/environment';
import { render } from '@testing-library/react';
import React from 'react';

import { DashboardGridContext } from '../../hooks';

import { dataTestIdsWidgetLiveMetric as dataTestIds, WidgetLiveMetric } from '.';

jest.mock('@plentyag/app-environment/src/common/components/live-metric');
jest.mock('@plentyag/app-environment/src/common/components/dialog-widget-items');

const widget = buildWidget({});
const onDeleted = jest.fn();
const MockLiveMetric = LiveMetric as jest.Mock;
const MockDialogWidgetItems = DialogWidgetItems as jest.Mock;

function renderWidgetLiveMetric(metric?: Metric) {
  return render(
    <DashboardGridContext.Provider value={{ canDrag: false, dashboard: null, startDateTime: null, endDateTime: null }}>
      <WidgetLiveMetric widget={{ ...widget, items: metric ? [buildWidgetItem(metric)] : [] }} onDeleted={onDeleted} />
    </DashboardGridContext.Provider>
  );
}

describe('WidgetLiveMetric', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    MockLiveMetric.mockImplementation(() => <div />);
    MockDialogWidgetItems.mockImplementation(() => <div />);
  });

  it('renders a placeholder to edit widget items', () => {
    const { queryByTestId } = renderWidgetLiveMetric();

    expect(queryByTestId(dataTestIds.editWidget)).toBeInTheDocument();
    expect(MockDialogWidgetItems).toHaveBeenCalledWith(expect.objectContaining({ open: false }), {});

    queryByTestId(dataTestIds.editWidget).click();

    expect(MockDialogWidgetItems).toHaveBeenCalledWith(expect.objectContaining({ open: true }), {});
    expect(MockLiveMetric).not.toHaveBeenCalled();
  });

  it('renders a metric', () => {
    const metric = buildMetric({});
    const { queryByTestId } = renderWidgetLiveMetric(metric);

    expect(queryByTestId(dataTestIds.editWidget)).not.toBeInTheDocument();
    expect(MockLiveMetric).toHaveBeenCalledWith(expect.objectContaining({ metric }), {});
  });
});

import { mockAlertRules, mockMetrics } from '@plentyag/app-environment/src/common/test-helpers';
import { DialogBaseForm } from '@plentyag/brand-ui/src/components';
import { Metric, TabType } from '@plentyag/core/src/types/environment';
import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Router } from 'react-router-dom';

import { dataTestIdsDropdownMetricActions as dataTestIds, DropdownMetricActions } from '.';

jest.mock('@plentyag/brand-ui/src/components/dialog-base-form');

const MockDialogBaseForm = DialogBaseForm as jest.Mock;
const onMetricUpdated = jest.fn();
const onEditAlertRule = jest.fn();
const classDisabled = 'Mui-disabled';
const [metric] = mockMetrics;

function renderDropdownMetricActions(metric: Metric, tabType: TabType = TabType.alertRule) {
  const history = createMemoryHistory({ initialEntries: ['/'] });
  const rendered = render(
    <Router history={history}>
      <DropdownMetricActions
        metric={metric}
        tabType={tabType}
        tabId="id"
        onMetricUpdated={onMetricUpdated}
        onEditAlertRule={onEditAlertRule}
      />
      ,
    </Router>
  );
  return { history, ...rendered };
}

describe('DropdownMetricActions', () => {
  beforeEach(() => {
    MockDialogBaseForm.mockImplementation(({ onSuccess }) => (
      <div data-testid={dataTestIds.dialogEditMetric} onClick={() => onSuccess()} />
    ));
    onMetricUpdated.mockRestore();
    onEditAlertRule.mockRestore();
  });

  it('shows actions in a dropdown', () => {
    const { queryByTestId } = renderDropdownMetricActions(metric);

    expect(queryByTestId(dataTestIds.editRules)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.editMetric)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.viewSubscriptions)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.viewSources)).not.toBeInTheDocument();

    queryByTestId(dataTestIds.root).click();

    expect(queryByTestId(dataTestIds.editRules)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.editMetric)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.viewSubscriptions)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.viewSources)).toBeInTheDocument();
  });

  it('disables editing rules and viewing subscriptions when the metric does not have alert rules', () => {
    const { queryByTestId } = renderDropdownMetricActions(metric);

    queryByTestId(dataTestIds.root).click();

    expect(queryByTestId(dataTestIds.editRules)).toHaveClass(classDisabled);
    expect(queryByTestId(dataTestIds.editMetric)).not.toHaveClass(classDisabled);
    expect(queryByTestId(dataTestIds.viewSubscriptions)).toHaveClass(classDisabled);
    expect(queryByTestId(dataTestIds.viewSources)).not.toHaveClass(classDisabled);
  });

  it('enables editing rules and viewing subscriptions when the metric has alert rules', () => {
    const { queryByTestId } = renderDropdownMetricActions({ ...metric, alertRules: mockAlertRules });

    queryByTestId(dataTestIds.root).click();

    expect(queryByTestId(dataTestIds.editRules)).not.toHaveClass(classDisabled);
    expect(queryByTestId(dataTestIds.editMetric)).not.toHaveClass(classDisabled);
    expect(queryByTestId(dataTestIds.viewSubscriptions)).not.toHaveClass(classDisabled);
    expect(queryByTestId(dataTestIds.viewSources)).not.toHaveClass(classDisabled);
  });

  it('calls onEditAlertRUle', () => {
    const { queryByTestId } = renderDropdownMetricActions({ ...metric, alertRules: mockAlertRules });

    expect(onEditAlertRule).not.toHaveBeenCalled();

    queryByTestId(dataTestIds.root).click();
    queryByTestId(dataTestIds.editRules).click();

    expect(onEditAlertRule).toHaveBeenCalled();
  });

  it('calls onMetricUpdated', () => {
    const { queryByTestId } = renderDropdownMetricActions(metric);

    expect(onMetricUpdated).not.toHaveBeenCalled();

    queryByTestId(dataTestIds.root).click();
    queryByTestId(dataTestIds.editMetric).click();
    queryByTestId(dataTestIds.dialogEditMetric).click();

    expect(onMetricUpdated).toHaveBeenCalled();
  });

  it('redirects to the first alert rule when viewing subscription from the Schedule Tab', () => {
    const { queryByTestId, history } = renderDropdownMetricActions(
      { ...metric, alertRules: mockAlertRules },
      TabType.schedule
    );

    expect(history.entries.map(e => e.pathname)).toEqual(['/']);

    queryByTestId(dataTestIds.root).click();
    queryByTestId(dataTestIds.viewSubscriptions).click();

    expect(history.entries.map(e => e.pathname)).toEqual([
      '/',
      `/environment-v2/metrics/${metric.id}/subscriptions/alert-rule/${mockAlertRules[0].id}`,
    ]);
  });

  it('disables viewing subscriptions from the Data tab', () => {
    const { queryByTestId } = renderDropdownMetricActions({ ...metric, alertRules: mockAlertRules }, TabType.data);

    queryByTestId(dataTestIds.root).click();

    expect(queryByTestId(dataTestIds.viewSubscriptions)).toHaveClass(classDisabled);
  });
});

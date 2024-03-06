import { mockAlertRules, mockMetrics } from '@plentyag/app-environment/src/common/test-helpers';
import { EVS_URLS } from '@plentyag/app-environment/src/common/utils';
import { mockGlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar/test-helper';
import {
  changeTextFieldDateTime,
  expectErrorOn,
  expectNoErrorOn,
  getInputByName,
  getSubmitButton,
} from '@plentyag/brand-ui/src/test-helpers';
import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { usePostRequest, usePutRequest, useRedisJsonObjectApi } from '@plentyag/core/src/hooks';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { Metric } from '@plentyag/core/src/types/environment';
import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { DateTime } from 'luxon';
import React from 'react';
import { Router } from 'react-router-dom';

import { DialogExportAsDashboard } from '../dialog-export-as-dashboard';

import { dataTestIdsDropdownMetricsActions as dataTestIds, DropdownMetricsActions } from '.';

jest.mock('@plentyag/core/src/hooks/use-redis-json-object-api');
jest.mock('@plentyag/core/src/hooks/use-axios');
jest.mock('@plentyag/app-environment/src/metrics-page/components/dialog-export-as-dashboard');

const MockDialogExportAsDashboard = DialogExportAsDashboard as jest.Mock;
const mockUseRedisJsonObjectApi = useRedisJsonObjectApi as jest.Mock;
const createRedisJsonObject = jest.fn();
const mockUsePostRequest = usePostRequest as jest.Mock;
const mockUsePutRequest = usePutRequest as jest.Mock;
const mockOnSuccess = jest.fn();
const makeRequest = jest.fn();
const metricsWithAlertRules = [
  { ...mockMetrics[0], alertRules: mockAlertRules },
  { ...mockMetrics[1], alertRules: mockAlertRules },
];

function renderDropdownMetricsActions(metrics: Metric[]) {
  const history = createMemoryHistory({ initialEntries: ['/'] });

  const rendered = render(
    <Router history={history}>
      <DropdownMetricsActions onSuccess={mockOnSuccess} metrics={metrics} />
    </Router>
  );

  return { ...rendered, historyPush: jest.spyOn(history, 'push') };
}

mockGlobalSnackbar();

describe('DropdownMetricsActions', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockCurrentUser({ permissions: { HYP_ENVIRONMENT_V2: 'EDIT' } });

    MockDialogExportAsDashboard.mockImplementation(() => <div />);
    mockUseRedisJsonObjectApi.mockReturnValue({ createRedisJsonObject });
    mockUsePutRequest.mockReturnValue({ makeRequest, isLoading: false });
  });

  it('does not render with insufficient permissions', () => {
    mockCurrentUser({ permissions: { HYP_ENVIRONMENT_V2: 'READ_AND_LIST' } });

    const { container } = renderDropdownMetricsActions([]);

    expect(container).toBeEmptyDOMElement();
  });

  it('disables the bulk apply action when no metrics are selected', () => {
    const { queryByTestId, historyPush } = renderDropdownMetricsActions([]);

    queryByTestId(dataTestIds.root).click();

    expect(queryByTestId(dataTestIds.bulkApply)).toHaveClass('Mui-disabled');
    expect(queryByTestId(dataTestIds.bulkApplyIconDisabled)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.bulkApplyIcon)).not.toBeInTheDocument();
    expect(createRedisJsonObject).not.toHaveBeenCalled();
    expect(historyPush).not.toHaveBeenCalled();
  });

  it('disables the bulk apply action when only one metric is selected', () => {
    const { queryByTestId, historyPush } = renderDropdownMetricsActions([mockMetrics[0]]);

    queryByTestId(dataTestIds.root).click();

    expect(queryByTestId(dataTestIds.bulkApply)).toHaveClass('Mui-disabled');
    expect(queryByTestId(dataTestIds.bulkApplyIconDisabled)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.bulkApplyIcon)).not.toBeInTheDocument();
    expect(createRedisJsonObject).not.toHaveBeenCalled();
    expect(historyPush).not.toHaveBeenCalled();
  });

  it('disables the bulk apply action when metrics do no have the same measurement types', () => {
    const { queryByTestId, historyPush } = renderDropdownMetricsActions([
      ...mockMetrics,
      { ...mockMetrics[0], measurementType: 'FLOW_RATE' },
    ]);

    queryByTestId(dataTestIds.root).click();

    expect(queryByTestId(dataTestIds.bulkApply)).toHaveClass('Mui-disabled');
    expect(queryByTestId(dataTestIds.bulkApplyIconDisabled)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.bulkApplyIcon)).not.toBeInTheDocument();
    expect(createRedisJsonObject).not.toHaveBeenCalled();
    expect(historyPush).not.toHaveBeenCalled();
  });

  it('triggers the bulk apply workflow', () => {
    createRedisJsonObject.mockImplementation(({ onSuccess }) => onSuccess({ id: 'mock-id' }));
    const { queryByTestId, historyPush } = renderDropdownMetricsActions(mockMetrics);

    queryByTestId(dataTestIds.root).click();

    expect(queryByTestId(dataTestIds.bulkApply)).not.toHaveClass('Mui-disabled');
    expect(queryByTestId(dataTestIds.bulkApplyIconDisabled)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.bulkApplyIcon)).toBeInTheDocument();

    queryByTestId(dataTestIds.bulkApply).click();

    expect(createRedisJsonObject).toHaveBeenCalledWith(
      expect.objectContaining({ value: { metricIds: mockMetrics.map(metric => metric.id) } })
    );
    expect(historyPush).toHaveBeenCalledWith(expect.stringContaining('/mock-id'));
  });

  it('disables the alert turn on/off/snooze actions when no metrics are selected', () => {
    const { queryByTestId, historyPush } = renderDropdownMetricsActions([]);

    queryByTestId(dataTestIds.root).click();

    expect(queryByTestId(dataTestIds.turnOnAlertRules)).toHaveClass('Mui-disabled');
    expect(queryByTestId(dataTestIds.turnOnAlertRulesIconDisabled)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.turnOnAlertRulesIcon)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.turnOffAlertRules)).toHaveClass('Mui-disabled');
    expect(queryByTestId(dataTestIds.turnOffAlertRulesIconDisabled)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.turnOffAlertRulesIcon)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.snoozeAlertRules)).toHaveClass('Mui-disabled');
    expect(queryByTestId(dataTestIds.snoozeAlertRulesIconDisabled)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.snoozeAlertRulesIcon)).not.toBeInTheDocument();
    expect(createRedisJsonObject).not.toHaveBeenCalled();
    expect(historyPush).not.toHaveBeenCalled();
  });

  it('disables the alert turn on/off/snooze actions when only one metric is selected', () => {
    const { queryByTestId, historyPush } = renderDropdownMetricsActions([mockMetrics[0]]);

    queryByTestId(dataTestIds.root).click();

    expect(queryByTestId(dataTestIds.turnOnAlertRules)).toHaveClass('Mui-disabled');
    expect(queryByTestId(dataTestIds.turnOnAlertRulesIconDisabled)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.turnOnAlertRulesIcon)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.turnOffAlertRules)).toHaveClass('Mui-disabled');
    expect(queryByTestId(dataTestIds.turnOffAlertRulesIconDisabled)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.turnOffAlertRulesIcon)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.snoozeAlertRules)).toHaveClass('Mui-disabled');
    expect(queryByTestId(dataTestIds.snoozeAlertRulesIconDisabled)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.snoozeAlertRulesIcon)).not.toBeInTheDocument();
    expect(createRedisJsonObject).not.toHaveBeenCalled();
    expect(historyPush).not.toHaveBeenCalled();
  });

  it('disables the alert turn on/off/snooze actions when all metrics have no alerts', () => {
    const { queryByTestId, historyPush } = renderDropdownMetricsActions([...mockMetrics]);

    queryByTestId(dataTestIds.root).click();
    expect(queryByTestId(dataTestIds.turnOnAlertRules)).toHaveClass('Mui-disabled');
    expect(queryByTestId(dataTestIds.turnOnAlertRulesIconDisabled)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.turnOnAlertRulesIcon)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.turnOffAlertRules)).toHaveClass('Mui-disabled');
    expect(queryByTestId(dataTestIds.turnOffAlertRulesIconDisabled)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.turnOffAlertRulesIcon)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.snoozeAlertRules)).toHaveClass('Mui-disabled');
    expect(queryByTestId(dataTestIds.snoozeAlertRulesIconDisabled)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.snoozeAlertRulesIcon)).not.toBeInTheDocument();
    expect(createRedisJsonObject).not.toHaveBeenCalled();
    expect(historyPush).not.toHaveBeenCalled();
  });

  it('enables the alert turn on/off/snooze actions when two metrics with alerts are selected', () => {
    const { queryByTestId, historyPush } = renderDropdownMetricsActions(metricsWithAlertRules);

    queryByTestId(dataTestIds.root).click();
    expect(queryByTestId(dataTestIds.turnOnAlertRules)).not.toHaveClass('Mui-disabled');
    expect(queryByTestId(dataTestIds.turnOnAlertRulesIconDisabled)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.turnOnAlertRulesIcon)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.turnOffAlertRules)).not.toHaveClass('Mui-disabled');
    expect(queryByTestId(dataTestIds.turnOffAlertRulesIconDisabled)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.turnOffAlertRulesIcon)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.snoozeAlertRules)).not.toHaveClass('Mui-disabled');
    expect(queryByTestId(dataTestIds.snoozeAlertRulesIconDisabled)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.snoozeAlertRulesIcon)).toBeInTheDocument();
    expect(createRedisJsonObject).not.toHaveBeenCalled();
    expect(historyPush).not.toHaveBeenCalled();
  });

  it('turns on alert rules for the selected metrics', async () => {
    const makeRequest = jest.fn().mockImplementation(({ onSuccess }) => {
      onSuccess();
    });

    mockUsePutRequest.mockReturnValue({ makeRequest, isLoading: false });
    mockUsePostRequest.mockReturnValue({ makeRequest, isLoading: false });

    const { queryByTestId } = renderDropdownMetricsActions(metricsWithAlertRules);

    queryByTestId(dataTestIds.root).click();

    expect(queryByTestId(dataTestIds.turnOnAlertRules)).not.toHaveClass('Mui-disabled');

    await actAndAwait(() => expect(queryByTestId(`${dataTestIds.dialogAlertRulesOn}-root`)).not.toBeInTheDocument());

    await actAndAwait(() => queryByTestId(dataTestIds.turnOnAlertRules).click());

    expect(queryByTestId(dataTestIds.dialogAlertRulesOn.title)).toHaveTextContent('Do you want to turn on Alert Rules');
    expect(queryByTestId(dataTestIds.dialogAlertRulesOn.confirm)).toHaveTextContent('I understand');
    expect(queryByTestId(dataTestIds.dialogAlertRulesOn.cancel)).toHaveTextContent('Cancel');

    expect(mockOnSuccess).not.toHaveBeenCalled();

    await actAndAwait(() => queryByTestId(dataTestIds.dialogAlertRulesOn.confirm).click());

    expect(makeRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          requests: metricsWithAlertRules.flatMap(metric => [
            ...metric.alertRules.map(alertRule => {
              return { ...alertRule, isEnabled: true, updatedBy: 'olittle' };
            }),
          ]),
        },
      })
    );

    expect(mockOnSuccess).toHaveBeenCalled();
  });

  it('turns off alert rules for the selected metrics', async () => {
    mockUsePostRequest.mockReturnValue({ makeRequest, isLoading: false });

    const { queryByTestId } = renderDropdownMetricsActions(metricsWithAlertRules);

    queryByTestId(dataTestIds.root).click();

    expect(queryByTestId(dataTestIds.turnOffAlertRules)).not.toHaveClass('Mui-disabled');

    await actAndAwait(() => expect(queryByTestId(`${dataTestIds.dialogAlertRulesOff}-root`)).not.toBeInTheDocument());

    await actAndAwait(() => queryByTestId(dataTestIds.turnOffAlertRules).click());

    expect(queryByTestId(dataTestIds.dialogAlertRulesOff.title)).toHaveTextContent(
      'Do you want to turn off Alert Rules'
    );
    expect(queryByTestId(dataTestIds.dialogAlertRulesOff.confirm)).toHaveTextContent('I understand');
    expect(queryByTestId(dataTestIds.dialogAlertRulesOff.cancel)).toHaveTextContent('Cancel');
    queryByTestId(dataTestIds.dialogAlertRulesOff.confirm).click();

    expect(makeRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          requests: metricsWithAlertRules.flatMap(metric => [
            ...metric.alertRules.map(alertRule => {
              return { ...alertRule, isEnabled: false, updatedBy: 'olittle' };
            }),
          ]),
        },
      })
    );
  });

  it('snoozes the alert rules for the selected metrics', async () => {
    mockUsePostRequest.mockReturnValue({ makeRequest, isLoading: false });

    const { queryByTestId } = renderDropdownMetricsActions(metricsWithAlertRules);

    queryByTestId(dataTestIds.root).click();

    expect(queryByTestId(dataTestIds.snoozeAlertRules)).not.toHaveClass('Mui-disabled');
    expect(queryByTestId(dataTestIds.dialogAlertRulesSnooze)).not.toBeInTheDocument();

    queryByTestId(dataTestIds.snoozeAlertRules).click();

    expect(queryByTestId(dataTestIds.dialogAlertRulesSnooze)).toBeInTheDocument();

    expect(getInputByName('snoozedUntil')).toHaveValue('');
    expectNoErrorOn('snoozedUntil');

    // -> Trigger validations
    await actAndAwait(() => queryByTestId(getSubmitButton()).click());

    expectErrorOn('snoozedUntil');

    const selectedDate = DateTime.fromISO('2030-12-01T00:00:00Z').toISO();
    // -> Enter a Date
    await actAndAwait(() => changeTextFieldDateTime('snoozedUntil', selectedDate));

    expectNoErrorOn('snoozedUntil');

    // -> Re-submit
    await actAndAwait(() => queryByTestId(getSubmitButton()).click());

    expect(makeRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        url: EVS_URLS.alertRules.bulkUpdateUrl(),
        data: {
          requests: metricsWithAlertRules.flatMap(metric => [
            ...metric.alertRules.map(alertRule => {
              return { ...alertRule, snoozedUntil: selectedDate, updatedBy: 'olittle' };
            }),
          ]),
        },
      })
    );
  });

  it('triggers a workflow to export metrics as Dashboard', () => {
    const { queryByTestId } = renderDropdownMetricsActions(metricsWithAlertRules);

    queryByTestId(dataTestIds.root).click();

    expect(queryByTestId(dataTestIds.exportAsDashboard)).not.toHaveClass('Mui-disabled');
    expect(queryByTestId(dataTestIds.exportAsDashboardIcon)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.exportAsDashboardIconIconDisabled)).not.toBeInTheDocument();

    expect(MockDialogExportAsDashboard).toHaveBeenCalledTimes(1);
    expect(MockDialogExportAsDashboard).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ open: false, metrics: metricsWithAlertRules }),
      {}
    );

    queryByTestId(dataTestIds.exportAsDashboard).click();

    expect(MockDialogExportAsDashboard).toHaveBeenCalledTimes(2);
    expect(MockDialogExportAsDashboard).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ open: true, metrics: metricsWithAlertRules }),
      {}
    );
  });
});

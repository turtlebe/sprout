import { mockGlobalSnackbar, successSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar/test-helper';
import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { usePutRequest } from '@plentyag/core/src/hooks';
import { Widget } from '@plentyag/core/src/types/environment';
import { render } from '@testing-library/react';
import React from 'react';

import { buildAlertRule, buildMetric, buildWidget, buildWidgetItem } from '../../test-helpers';
import { getDropdownAlertsDataTestIds } from '../dropdown-alerts';

import { dataTestIdsDialogDashboardAlertRules as dataTestIds, DialogDashboardAlertRules } from '.';

import { dataTestIdsDashboardAlertRuleHeader as dataTestIdsHeader } from './components/';

jest.mock('@plentyag/core/src/core-store');
jest.mock('@plentyag/core/src/hooks/use-axios');

const onClose = jest.fn();
const onDashboardUpdated = jest.fn();
const makeRequest = jest.fn();
const mockUsePutRequest = usePutRequest as jest.Mock;
const widgetWithMetricsAndNoAlertRules: Widget = buildWidget({
  items: [buildWidgetItem(buildMetric({ alertRules: [] })), buildWidgetItem(buildMetric({ alertRules: [] }))],
});

const widgetWithMetricsAndAlertRules: Widget = buildWidget({
  items: [
    buildWidgetItem(
      buildMetric({ alertRules: [buildAlertRule({ isEnabled: true }), buildAlertRule({ isEnabled: true })] })
    ),
    buildWidgetItem(
      buildMetric({ alertRules: [buildAlertRule({ isEnabled: true }), buildAlertRule({ isEnabled: true })] })
    ),
  ],
});

function renderDialogDashboardAlertRules(widgets) {
  return render(
    <DialogDashboardAlertRules widgets={widgets} onClose={onClose} onDashboardUpdated={onDashboardUpdated} open />
  );
}

describe('DialogDashboardAlertRules', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockCurrentUser();
    mockGlobalSnackbar();
    successSnackbar.mockRestore();
    makeRequest.mockImplementation(({ onSuccess }) => onSuccess());
    mockUsePutRequest.mockReturnValue({ makeRequest });
  });

  it('calls "onClose"', () => {
    const { queryByTestId } = renderDialogDashboardAlertRules([widgetWithMetricsAndNoAlertRules]);

    expect(onClose).not.toHaveBeenCalled();

    queryByTestId(dataTestIds.close).click();

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders no alert rules header when widget has no metrics', () => {
    const { queryByTestId } = renderDialogDashboardAlertRules([buildWidget({})]);

    expect(onDashboardUpdated).not.toHaveBeenCalled();
    expect(queryByTestId(dataTestIds.save)).toHaveClass('Mui-disabled');
    expect(queryByTestId(dataTestIds.content)).toBeInTheDocument();
    expect(queryByTestId(dataTestIdsHeader.headerNoAlertRules)).toBeInTheDocument();

    queryByTestId(dataTestIds.save).click();

    expect(makeRequest).toHaveBeenCalledTimes(0);
    expect(onDashboardUpdated).toHaveBeenCalledTimes(0);
    expect(queryByTestId(dataTestIds.save)).toHaveClass('Mui-disabled');
  });

  it('renders no alert rules header when dashboard has metrics with no alert rules', () => {
    const { queryByTestId } = renderDialogDashboardAlertRules([widgetWithMetricsAndNoAlertRules]);

    expect(onDashboardUpdated).not.toHaveBeenCalled();
    expect(queryByTestId(dataTestIds.save)).toHaveClass('Mui-disabled');
    expect(queryByTestId(dataTestIds.content)).toBeInTheDocument();
    expect(queryByTestId(dataTestIdsHeader.headerNoAlertRules)).toBeInTheDocument();

    queryByTestId(dataTestIds.save).click();

    expect(makeRequest).toHaveBeenCalledTimes(0);
    expect(onDashboardUpdated).toHaveBeenCalledTimes(0);
    expect(queryByTestId(dataTestIds.save)).toHaveClass('Mui-disabled');
  });

  it('updates all metric alert rules in dashboard with header dropdown', () => {
    const { queryByTestId } = renderDialogDashboardAlertRules([widgetWithMetricsAndAlertRules]);

    expect(onDashboardUpdated).not.toHaveBeenCalled();
    expect(queryByTestId(dataTestIds.save)).toHaveClass('Mui-disabled');
    expect(queryByTestId(dataTestIds.content)).toBeInTheDocument();
    expect(queryByTestId(dataTestIdsHeader.headerAlertRules)).toBeInTheDocument();

    // Validate header dropdown in ON, since all metric alerts are ON
    expect(queryByTestId(getDropdownAlertsDataTestIds(dataTestIdsHeader.headerDropdown).root)).toHaveTextContent(
      'Alerts ON'
    );

    // Open header dropdown and turn it OFF, so all metric alerts are also turned OFF
    queryByTestId(getDropdownAlertsDataTestIds(dataTestIdsHeader.headerDropdown).root).click();
    queryByTestId(getDropdownAlertsDataTestIds(dataTestIdsHeader.headerDropdown).off).click();

    // Validate header dropdown is OFF, as well as metric alerts are also turned OFF
    expect(queryByTestId(getDropdownAlertsDataTestIds(dataTestIdsHeader.headerDropdown).root)).toHaveTextContent(
      'Alerts OFF'
    );
    expect(queryByTestId(getDropdownAlertsDataTestIds(dataTestIds.metricAlertsDropdown(0)).root)).toHaveTextContent(
      'Alerts OFF'
    );
    expect(queryByTestId(getDropdownAlertsDataTestIds(dataTestIds.metricAlertsDropdown(1)).root)).toHaveTextContent(
      'Alerts OFF'
    );

    // With change to dropdown(s), 'Save' button is enabled
    expect(queryByTestId(dataTestIds.save)).not.toHaveClass('Mui-disabled');
    queryByTestId(dataTestIds.save).click();

    // Confirm update call with all alerts to OFF
    expect(makeRequest).toHaveBeenCalledTimes(1);
    expect(makeRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          requests: widgetWithMetricsAndAlertRules.items.flatMap(item =>
            item.metric.alertRules.map(alertRule => ({
              ...alertRule,
              isEnabled: false,
              updatedBy: 'olittle',
            }))
          ),
        },
      })
    );

    // Confirm dashboard and snackbar success
    expect(onDashboardUpdated).toHaveBeenCalledTimes(1);
    expect(successSnackbar).toHaveBeenCalledTimes(1);
  });

  it('updates a single metric alert in dashboard', () => {
    const { queryByTestId } = renderDialogDashboardAlertRules([widgetWithMetricsAndAlertRules]);

    expect(onDashboardUpdated).not.toHaveBeenCalled();
    expect(queryByTestId(dataTestIds.save)).toHaveClass('Mui-disabled');
    expect(queryByTestId(dataTestIds.content)).toBeInTheDocument();
    expect(queryByTestId(dataTestIdsHeader.headerAlertRules)).toBeInTheDocument();

    // Validate header dropdown in ON, since all metric alerts are ON
    expect(queryByTestId(getDropdownAlertsDataTestIds(dataTestIdsHeader.headerDropdown).root)).toHaveTextContent(
      'Alerts ON'
    );

    // Open individual metric and turn it OFF
    queryByTestId(getDropdownAlertsDataTestIds(dataTestIds.metricAlertsDropdown(0)).root).click();
    queryByTestId(getDropdownAlertsDataTestIds(dataTestIds.metricAlertsDropdown(0)).off).click();

    // Validate metric alert change and other metric remains turned ON
    expect(queryByTestId(getDropdownAlertsDataTestIds(dataTestIds.metricAlertsDropdown(0)).root)).toHaveTextContent(
      'Alerts OFF'
    );
    expect(queryByTestId(getDropdownAlertsDataTestIds(dataTestIds.metricAlertsDropdown(1)).root)).toHaveTextContent(
      'Alerts ON'
    );
    // Validate header dropdown is blank (since all alert rule states are now different)
    expect(queryByTestId(getDropdownAlertsDataTestIds(dataTestIdsHeader.headerDropdown).root)).toHaveTextContent('');

    // With change to dropdown(s), 'Save' button is enabled
    expect(queryByTestId(dataTestIds.save)).not.toHaveClass('Mui-disabled');
    queryByTestId(dataTestIds.save).click();

    // Confirm update call made with single alert change
    expect(makeRequest).toHaveBeenCalledTimes(1);
    expect(makeRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          requests: widgetWithMetricsAndAlertRules.items[0].metric.alertRules.map(alertRule => ({
            ...alertRule,
            isEnabled: false,
            updatedBy: 'olittle',
          })),
        },
      })
    );

    // Confirm dashboard and snackbar success
    expect(onDashboardUpdated).toHaveBeenCalledTimes(1);
    expect(successSnackbar).toHaveBeenCalledTimes(1);
  });
});

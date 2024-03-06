import { ButtonMetricPicker, ButtonSchedulePicker } from '@plentyag/app-environment/src/common/components';
import { mockGlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar/test-helper';
import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { usePutRequest } from '@plentyag/core/src/hooks';
import { render } from '@testing-library/react';
import React from 'react';

import { buildWidget, mockAlertRules, mockMetrics, mockSchedules } from '../../test-helpers';

import { dataTestIdsDialogWidgetItems, DialogWidgetItems } from '.';

jest.mock('@plentyag/core/src/core-store');
jest.mock('@plentyag/core/src/hooks/use-axios');
jest.mock('@plentyag/app-environment/src/common/components/button-metric-picker');
jest.mock('@plentyag/app-environment/src/common/components/button-schedule-picker');
jest.mock('@plentyag/brand-ui/src/components/global-snackbar');
jest.mock('@plentyag/brand-ui/src/components/snackbar');

const dataTestIds = {
  ...dataTestIdsDialogWidgetItems,
  addMetric: 'add-metric',
  addMetricWithAlertRule: 'add-metric-with-alert-rule',
  addSchedule: 'add-schedule',
  addSchedules: 'add-schedules',
  addScheduleWithActionDefinitionKey: 'add-schedule-with-action-definition-key',
};
const widget = buildWidget({});
const [metric] = mockMetrics;
const [alertRule] = mockAlertRules;
const [schedule] = mockSchedules;
const schedules = mockSchedules.slice(0, 2);
const actionDefinitionKey = 'mock-action-definition-key';
const onClose = jest.fn();
const onWidgetUpdated = jest.fn();
const mockUsePutRequest = usePutRequest as jest.Mock;
const makeRequest = jest.fn();
const MockButtonSchedulePicker = ButtonSchedulePicker as jest.Mock;
const MockButtonMetricPicker = ButtonMetricPicker as jest.Mock;

function renderDialogWidgetItems(props?: Partial<DialogWidgetItems>) {
  return render(
    <DialogWidgetItems widget={widget} onClose={onClose} onWidgetUpdated={onWidgetUpdated} open {...props} />
  );
}

describe('DialogWidgetItems', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    mockCurrentUser();
    mockGlobalSnackbar();

    makeRequest.mockImplementation(({ onSuccess }) => onSuccess());
    mockUsePutRequest.mockReturnValue({ makeRequest });
    MockButtonMetricPicker.mockImplementation(({ onChange }) => (
      <>
        <div data-testid={dataTestIds.addMetric} onClick={() => onChange({ metric })} />
        <div data-testid={dataTestIds.addMetricWithAlertRule} onClick={() => onChange({ metric, alertRule })} />
      </>
    ));
    MockButtonSchedulePicker.mockImplementation(({ onChange }) => (
      <>
        <div data-testid={dataTestIds.addSchedule} onClick={() => onChange({ schedule })} />
        <div
          data-testid={dataTestIds.addScheduleWithActionDefinitionKey}
          onClick={() => onChange({ schedule, actionDefinitionKey })}
        />
        <div data-testid={dataTestIds.addSchedules} onClick={() => onChange({ schedules })} />
      </>
    ));
  });

  it('calls "onClose"', () => {
    const { queryByTestId } = renderDialogWidgetItems();

    expect(onClose).not.toHaveBeenCalled();

    queryByTestId(dataTestIds.close).click();

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('adds one metric, one metric with an alert rule, and one schedule', () => {
    const { queryByTestId } = renderDialogWidgetItems();

    expect(queryByTestId(dataTestIds.content)).toHaveTextContent('No Metric or Schedule');

    queryByTestId(dataTestIds.addMetric).click();

    queryByTestId(dataTestIds.addSchedule).click();

    expect(makeRequest).toHaveBeenCalledTimes(0);
    expect(onWidgetUpdated).toHaveBeenCalledTimes(0);

    expect(queryByTestId(dataTestIds.save)).not.toBeDisabled();
    expect(queryByTestId(dataTestIds.loader)).not.toBeInTheDocument();

    queryByTestId(dataTestIds.save).click();

    expect(makeRequest).toHaveBeenCalledTimes(1);
    expect(makeRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          ...widget,
          items: [
            expect.objectContaining({
              widgetId: widget.id,
              itemId: metric.id,
              itemType: 'METRIC',
              options: {},
            }),
            expect.objectContaining({
              widgetId: widget.id,
              itemId: schedule.id,
              itemType: 'SCHEDULE',
              options: {},
            }),
          ],
          updatedBy: 'olittle',
        }),
      })
    );
    expect(onWidgetUpdated).toHaveBeenCalledTimes(1);
  });

  it('adds one metric with an alert rule', () => {
    const { queryByTestId } = renderDialogWidgetItems({ renderAlertRule: () => <div /> });

    expect(queryByTestId(dataTestIds.content)).toHaveTextContent('No Metric or Schedule');

    queryByTestId(dataTestIds.addMetricWithAlertRule).click();
    queryByTestId(dataTestIds.save).click();

    expect(makeRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          ...widget,
          items: [
            expect.objectContaining({
              widgetId: widget.id,
              itemId: metric.id,
              itemType: 'METRIC',
              options: { alertRuleId: alertRule.id },
            }),
          ],
          updatedBy: 'olittle',
        }),
      })
    );
    expect(onWidgetUpdated).toHaveBeenCalledTimes(1);
  });

  it('adds one metric without an alert rule', () => {
    const { queryByTestId } = renderDialogWidgetItems({ renderAlertRule: () => <div /> });

    expect(queryByTestId(dataTestIds.content)).toHaveTextContent('No Metric or Schedule');

    queryByTestId(dataTestIds.addMetric).click();
    queryByTestId(dataTestIds.save).click();

    expect(makeRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          ...widget,
          items: [
            expect.objectContaining({
              widgetId: widget.id,
              itemId: metric.id,
              itemType: 'METRIC',
              options: {},
            }),
          ],
          updatedBy: 'olittle',
        }),
      })
    );
    expect(onWidgetUpdated).toHaveBeenCalledTimes(1);
  });

  it('adds one schedule with an actionDefinitionKey', () => {
    const { queryByTestId } = renderDialogWidgetItems({ chooseActionDefinitionKey: true });

    expect(queryByTestId(dataTestIds.content)).toHaveTextContent('No Metric or Schedule');

    queryByTestId(dataTestIds.addScheduleWithActionDefinitionKey).click();
    queryByTestId(dataTestIds.save).click();

    expect(makeRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          ...widget,
          items: [
            expect.objectContaining({
              widgetId: widget.id,
              itemId: schedule.id,
              itemType: 'SCHEDULE',
              options: { actionDefinitionKey },
            }),
          ],
          updatedBy: 'olittle',
        }),
      })
    );
    expect(onWidgetUpdated).toHaveBeenCalledTimes(1);
  });

  it('adds multiple schedules', () => {
    const { queryByTestId } = renderDialogWidgetItems({ multiple: true });

    expect(queryByTestId(dataTestIds.content)).toHaveTextContent('No Metric or Schedule');

    queryByTestId(dataTestIds.addSchedules).click();
    queryByTestId(dataTestIds.save).click();

    expect(makeRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          ...widget,
          items: [
            expect.objectContaining({
              widgetId: widget.id,
              itemId: schedules[0].id,
              itemType: 'SCHEDULE',
              options: {},
            }),
            expect.objectContaining({
              widgetId: widget.id,
              itemId: schedules[1].id,
              itemType: 'SCHEDULE',
              options: {},
            }),
          ],
          updatedBy: 'olittle',
        }),
      })
    );
    expect(onWidgetUpdated).toHaveBeenCalledTimes(1);
  });

  it('disables the CTA and shows a loader when saving', () => {
    makeRequest.mockImplementation(() => {}); // do nothing

    const { queryByTestId } = renderDialogWidgetItems();

    expect(queryByTestId(dataTestIds.content)).toHaveTextContent('No Metric or Schedule');
    expect(queryByTestId(dataTestIds.save)).not.toBeDisabled();
    expect(queryByTestId(dataTestIds.loader)).not.toBeInTheDocument();

    queryByTestId(dataTestIds.save).click();

    expect(queryByTestId(dataTestIds.save)).toBeDisabled();
    expect(queryByTestId(dataTestIds.loader)).toBeInTheDocument();
  });

  it('resets the state when closing the dialog', () => {
    const { queryByTestId } = renderDialogWidgetItems();

    expect(queryByTestId(dataTestIds.content)).toHaveTextContent('No Metric or Schedule');

    queryByTestId(dataTestIds.addMetric).click();
    queryByTestId(dataTestIds.addSchedule).click();

    expect(queryByTestId(dataTestIds.content)).not.toHaveTextContent('No Metric or Schedule');
    expect(makeRequest).toHaveBeenCalledTimes(0);
    expect(onWidgetUpdated).toHaveBeenCalledTimes(0);
    expect(onClose).toHaveBeenCalledTimes(0);

    queryByTestId(dataTestIds.close).click();

    expect(makeRequest).toHaveBeenCalledTimes(0);
    expect(onWidgetUpdated).toHaveBeenCalledTimes(0);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(queryByTestId(dataTestIds.content)).toHaveTextContent('No Metric or Schedule');
  });
});

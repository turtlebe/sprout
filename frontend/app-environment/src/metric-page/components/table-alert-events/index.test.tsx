import { buildAlertEvent, mockAlertEvents } from '@plentyag/app-environment/src/common/test-helpers';
import { getAlertRuleTypeLabel } from '@plentyag/app-environment/src/common/utils';
import { AlertEventStatus } from '@plentyag/core/src/types/environment';
import { render } from '@testing-library/react';
import moment from 'moment';
import React from 'react';

import { dataTestIdsTableAlertEvents as dataTestIds, TableAlertEvents } from '.';

describe('TableAlertEvents', () => {
  it('renders a loader', () => {
    const { queryByTestId } = render(<TableAlertEvents alertEvents={[]} activeAlertEvents={[]} isLoading />);

    expect(queryByTestId(dataTestIds.loader)).toBeInTheDocument();
  });

  it('renders a loader when reloading alert events', () => {
    const { queryByTestId } = render(
      <TableAlertEvents alertEvents={mockAlertEvents} activeAlertEvents={mockAlertEvents} isLoading />
    );

    expect(queryByTestId(dataTestIds.loader)).toBeInTheDocument();

    mockAlertEvents.forEach(alertEvent => {
      expect(queryByTestId(dataTestIds.tableRow(alertEvent))).not.toBeInTheDocument();
    });
  });

  it('renders a table with alert events', () => {
    const { queryByTestId } = render(
      <TableAlertEvents alertEvents={mockAlertEvents} activeAlertEvents={[]} isLoading={false} />
    );

    expect(queryByTestId(dataTestIds.loader)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.activeSwitch).querySelector('input')).not.toBeChecked();

    mockAlertEvents.forEach(alertEvent => {
      expect(queryByTestId(dataTestIds.tableRow(alertEvent))).toBeInTheDocument();
      expect(queryByTestId(dataTestIds.tableCellStatus(alertEvent))).toHaveTextContent(alertEvent.status);
      expect(queryByTestId(dataTestIds.tableCellAlertRuleType(alertEvent))).toHaveTextContent(
        getAlertRuleTypeLabel(alertEvent.alertRule.alertRuleType)
      );
      expect(queryByTestId(dataTestIds.tableCellTime(alertEvent))).toHaveTextContent(
        moment(alertEvent.generatedAt).fromNow()
      );
    });
  });

  it('renders a table with no-data alert events', () => {
    const alertEvents = [
      buildAlertEvent({
        status: AlertEventStatus.noDataResolved,
        generatedAt: '2022-01-01T00:00:00Z',
        alertRule: mockAlertEvents[0].alertRule,
      }),
      buildAlertEvent({
        status: AlertEventStatus.noDataTriggered,
        generatedAt: '2022-01-01T00:00:00Z',
        alertRule: mockAlertEvents[0].alertRule,
      }),
    ];
    const { queryByTestId } = render(
      <TableAlertEvents alertEvents={alertEvents} activeAlertEvents={[]} isLoading={false} />
    );

    expect(queryByTestId(dataTestIds.loader)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.activeSwitch).querySelector('input')).not.toBeChecked();

    alertEvents.forEach(alertEvent => {
      expect(queryByTestId(dataTestIds.tableRow(alertEvent))).toBeInTheDocument();
      expect(queryByTestId(dataTestIds.tableCellStatus(alertEvent))).toHaveTextContent(alertEvent.status);
      expect(queryByTestId(dataTestIds.tableCellAlertRuleType(alertEvent))).toHaveTextContent(
        getAlertRuleTypeLabel(alertEvent.alertRule.alertRuleType)
      );
      expect(queryByTestId(dataTestIds.tableCellTime(alertEvent))).toHaveTextContent(
        moment(alertEvent.generatedAt).fromNow()
      );
    });
  });

  it('renders a table with active alert events', () => {
    const alertEvents = [
      buildAlertEvent({
        status: AlertEventStatus.noDataResolved,
        generatedAt: '2022-01-01T00:00:00Z',
        alertRule: mockAlertEvents[0].alertRule,
      }),
      buildAlertEvent({
        status: AlertEventStatus.noDataTriggered,
        generatedAt: '2022-01-01T00:00:00Z',
        alertRule: mockAlertEvents[0].alertRule,
      }),
    ];
    const { queryByTestId } = render(
      <TableAlertEvents alertEvents={alertEvents} activeAlertEvents={alertEvents} isLoading={false} />
    );

    expect(queryByTestId(dataTestIds.loader)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.activeSwitch).querySelector('input')).toBeChecked();

    alertEvents.forEach(alertEvent => {
      expect(queryByTestId(dataTestIds.tableRow(alertEvent))).toBeInTheDocument();
      expect(queryByTestId(dataTestIds.tableCellStatus(alertEvent))).toHaveTextContent(alertEvent.status);
      expect(queryByTestId(dataTestIds.tableCellAlertRuleType(alertEvent))).toHaveTextContent(
        getAlertRuleTypeLabel(alertEvent.alertRule.alertRuleType)
      );
      expect(queryByTestId(dataTestIds.tableCellTime(alertEvent))).toHaveTextContent(
        moment(alertEvent.generatedAt).fromNow()
      );
    });
  });
});

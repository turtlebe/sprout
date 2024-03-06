import { InternalIrrigationStatus, IrrigationStatus } from '@plentyag/app-production/src/maps-interactive-page/types';
import { useFeatureFlag } from '@plentyag/brand-ui/src/components';
import { Table, TableBody } from '@plentyag/brand-ui/src/material-ui/core';
import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { DateTimeFormat } from '@plentyag/core/src/utils';
import { render } from '@testing-library/react';
import { DateTime, Settings } from 'luxon';
import React from 'react';

import { buildIrrigationTask } from '../../test-helpers/build-irrigation-task';
import { IrrigationTaskTableRowData } from '../../types';
import { getShortenedPathWithoutSiteAndArea } from '../../utils/get-shortened-path-without-site-and-area';
import { dataTestIdsIrrigationActions } from '../irrigation-actions';

import { dataTestIdsIrrigationTableRow as dataTestIds, IrrigationTableRow } from '.';

mockCurrentUser({ permissions: { HYP_PRODUCTION: 'FULL' } });

jest.mock('@plentyag/brand-ui/src/components/feature-flag/hooks/use-feature-flag');
const mockUseFeatureFlag = useFeatureFlag as jest.Mock;

describe('IrrigationTableRow', () => {
  beforeEach(() => {
    mockUseFeatureFlag.mockImplementation(() => true);
  });

  beforeAll(() => {
    jest.useFakeTimers();
    const mockNow = new Date('2023-02-01T08:00:00.000Z');
    jest.setSystemTime(mockNow);
    Settings.defaultZone = 'America/Los_Angeles';
  });

  afterAll(() => {
    jest.useRealTimers();
    Settings.defaultZone = 'system';
  });

  function renderTableRow(rowData: IrrigationTaskTableRowData) {
    const row = <IrrigationTableRow rowData={rowData} onRefreshIrrigationTasks={jest.fn()} />;
    const result = render(
      <Table>
        <TableBody>{row}</TableBody>
      </Table>
    );

    // test common fields for all status types.
    expect(result.queryByTestId(dataTestIds.status)).toHaveTextContent(rowData.status);
    expect(result.queryByTestId(dataTestIds.recipeDay)).toHaveTextContent(rowData.recipeDay.toString());
    expect(result.queryByTestId(dataTestIds.plannedVolume)).toHaveTextContent(rowData.plannedVolume.toString());
    expect(result.queryByTestId(dataTestIds.trigger)).toHaveTextContent(rowData.trigger);

    return result;
  }

  it('renders created task', () => {
    const createdTaskRowData = buildIrrigationTask();
    const { queryByTestId } = renderTableRow(buildIrrigationTask());

    // render US date format for created task
    expect(queryByTestId(dataTestIds.irrigationDate)).toHaveTextContent(
      DateTime.fromJSDate(createdTaskRowData.irrigationDate).toFormat(DateTimeFormat.US_DATE_ONLY)
    );
    // should be empty because rackPath is not shown for created task.
    expect(queryByTestId(dataTestIds.trigger)).toHaveTextContent(createdTaskRowData.trigger);
  });

  it('renders unscheduled task', () => {
    const unscheduleTaskRowData = buildIrrigationTask({ status: InternalIrrigationStatus.UNSCHEDULED });
    const { queryByTestId } = renderTableRow(unscheduleTaskRowData);

    // render US date format for unscheduled task
    expect(queryByTestId(dataTestIds.irrigationDate)).toHaveTextContent(
      DateTime.fromJSDate(unscheduleTaskRowData.irrigationDate).toFormat(DateTimeFormat.US_DATE_ONLY)
    );

    // should be empty because rackPath is not shown for unscheduled task.
    expect(queryByTestId(dataTestIds.rackPath)).toHaveTextContent('');
  });

  it('renders failed task', () => {
    const failedTaskRowData = buildIrrigationTask({ status: IrrigationStatus.FAILURE, failureReason: 'ouch' });
    const { queryByTestId } = renderTableRow(failedTaskRowData);

    // render US date and time format for failed task
    expect(queryByTestId(dataTestIds.irrigationDate)).toHaveTextContent(
      DateTime.fromJSDate(failedTaskRowData.irrigationDate).toFormat(DateTimeFormat.US_DEFAULT_WITH_SECONDS)
    );

    expect(queryByTestId(dataTestIds.rackPath)).toHaveTextContent(
      getShortenedPathWithoutSiteAndArea(failedTaskRowData.rackPath)
    );
  });

  it('renders success task', () => {
    const successTaskRowData = buildIrrigationTask({ status: IrrigationStatus.SUCCESS });
    const { queryByTestId } = renderTableRow(successTaskRowData);

    // render US date and time format for success task
    expect(queryByTestId(dataTestIds.irrigationDate)).toHaveTextContent(
      DateTime.fromJSDate(successTaskRowData.irrigationDate).toFormat(DateTimeFormat.US_DEFAULT_WITH_SECONDS)
    );

    expect(queryByTestId(dataTestIds.rackPath)).toHaveTextContent(
      getShortenedPathWithoutSiteAndArea(successTaskRowData.rackPath)
    );
  });

  it('shows expanded data when first column is clicked', () => {
    const failedTaskRowData = buildIrrigationTask({ status: IrrigationStatus.FAILURE, failureReason: 'ouch' });
    const { queryByTestId } = renderTableRow(failedTaskRowData);

    expect(queryByTestId(dataTestIds.failedReason)).not.toBeInTheDocument();

    queryByTestId(dataTestIds.expandButton).click();

    expect(queryByTestId(dataTestIds.failedReason)).toHaveTextContent(failedTaskRowData.failureReason);
  });

  it('does not show actions when feature flag is disabled', () => {
    mockUseFeatureFlag.mockImplementation(() => false);

    const createdTaskRowData = buildIrrigationTask();
    const { queryByTestId } = renderTableRow(createdTaskRowData);

    expect(queryByTestId(dataTestIdsIrrigationActions.root)).not.toBeInTheDocument();
  });

  it('shows actions when task is happening today', () => {
    const createdTaskRowData = buildIrrigationTask();
    const { queryByTestId } = renderTableRow(createdTaskRowData);

    expect(queryByTestId(dataTestIdsIrrigationActions.root)).toBeInTheDocument();
  });

  it('shows actions when task is happening in the future', () => {
    const futureIrrigationDate = DateTime.now().plus({ days: 1 }).toJSDate();
    const futureTaskRowData = buildIrrigationTask({ irrigationDate: futureIrrigationDate });
    const { queryByTestId } = renderTableRow(futureTaskRowData);

    expect(queryByTestId(dataTestIdsIrrigationActions.root)).toBeInTheDocument();
  });

  it('does not show action for tasks in the past', () => {
    const pastIrrigationDate = DateTime.now().minus({ days: 1 }).toJSDate();
    const pastTaskRowData = buildIrrigationTask({ irrigationDate: pastIrrigationDate });
    const { queryByTestId } = renderTableRow(pastTaskRowData);

    expect(queryByTestId(dataTestIdsIrrigationActions.root)).not.toBeInTheDocument();
  });
});

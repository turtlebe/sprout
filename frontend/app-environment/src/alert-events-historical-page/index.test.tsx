import { AlertEventsTable } from '@plentyag/app-environment/src/common/components';
import { DEFAULT_DATETIME_MOMENT_FORMAT } from '@plentyag/brand-ui/src/material-ui/pickers/datetime-picker';
import { changeTextField, getInputByName } from '@plentyag/brand-ui/src/test-helpers';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import moment from 'moment';
import React from 'react';
import { Route, Router } from 'react-router-dom';

import { PATHS } from '../paths';

import { AlertEventsHistoricalPage, dataTestIdsAlertEventsHistoricalPage as dataTestIds } from '.';

jest.mock('@plentyag/app-environment/src/common/components/alert-events-table');

const MockAlertEventsTable = AlertEventsTable as jest.Mock;

function renderALertEventsHistoricalPage() {
  const history = createMemoryHistory({ initialEntries: [PATHS.alertEventsHistoricalPage] });

  return render(
    <Router history={history}>
      <Route path={PATHS.alertEventsHistoricalPage} component={AlertEventsHistoricalPage} />
    </Router>
  );
}

function getDate(value) {
  return moment(value, DEFAULT_DATETIME_MOMENT_FORMAT).toDate();
}

describe('AlertEventsHistoricalPage', () => {
  beforeEach(() => {
    jest.restoreAllMocks();

    MockAlertEventsTable.mockImplementation(() => <div />);
  });

  it('renders with window datetime picker', async () => {
    const { queryByTestId } = renderALertEventsHistoricalPage();

    expect(queryByTestId(dataTestIds.windowDateTimePicker.root)).toBeInTheDocument();

    expect(MockAlertEventsTable).toHaveBeenCalledWith(
      expect.objectContaining({
        startDateTime: getDate(getInputByName(dataTestIds.windowDateTimePicker.startDateTimePicker).value),
        endDateTime: getDate(getInputByName(dataTestIds.windowDateTimePicker.endDateTimePicker).value),
      }),
      {}
    );

    await actAndAwait(() =>
      changeTextField(getInputByName(dataTestIds.windowDateTimePicker.startDateTimePicker), '12/01/2021 05:00 AM')
    );

    queryByTestId(dataTestIds.windowDateTimePicker.applyWindow).click();

    expect(MockAlertEventsTable).toHaveBeenCalledWith(
      expect.objectContaining({
        startDateTime: getDate('12/01/2021 05:00 AM'),
        endDateTime: getDate(getInputByName(dataTestIds.windowDateTimePicker.endDateTimePicker).value),
      }),
      {}
    );
  });
});

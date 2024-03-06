import { changeTextField } from '@plentyag/brand-ui/src/test-helpers';
import { DateTimeFormat } from '@plentyag/core/src/utils';
import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { DateTime } from 'luxon';
import React from 'react';
import { Router } from 'react-router-dom';

import { dataTestIdsWindowDateTimePicker as dataTestIds, WindowDateTimePicker } from '.';

const errorSelector = '.MuiFormHelperText-root.Mui-error';

describe('WindowDateTimePicker', () => {
  let onChange, history;

  beforeEach(() => {
    onChange = jest.fn();
    history = createMemoryHistory({ initialEntries: ['/'] });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  function renderWindowDateTimePicker(props) {
    return render(
      <Router history={history}>
        <WindowDateTimePicker {...props} onChange={onChange} />
      </Router>
    );
  }

  it('calls "onChange" with the updated startDateTime and endDateTime', () => {
    const startDateTime = DateTime.fromISO('2021-01-01T00:00:00Z');
    const endDateTime = DateTime.fromISO('2021-01-02T00:00:00Z');

    const { queryByTestId } = renderWindowDateTimePicker({
      startDateTime: startDateTime.toJSDate(),
      endDateTime: endDateTime.toJSDate(),
    });

    expect(queryByTestId(dataTestIds.startDateTimePicker).querySelector('input')).toHaveValue(
      startDateTime.toFormat(DateTimeFormat.US_DEFAULT)
    );
    expect(queryByTestId(dataTestIds.endDateTimePicker).querySelector('input')).toHaveValue(
      endDateTime.toFormat(DateTimeFormat.US_DEFAULT)
    );
    expect(queryByTestId(dataTestIds.applyWindow)).toBeDisabled();
    expect(history.entries).toHaveLength(1);

    changeTextField(dataTestIds.startDateTimePicker, endDateTime.toFormat(DateTimeFormat.US_DEFAULT));

    expect(queryByTestId(dataTestIds.applyWindow)).not.toBeDisabled();
    queryByTestId(dataTestIds.applyWindow).click();

    expect(onChange).toHaveBeenCalledWith(endDateTime.toJSDate(), endDateTime.toJSDate());
    expect(history.entries).toHaveLength(2);
    expect(history.entries[1].search).toBe(
      '?startDateTime=2021-01-02T00%3A00%3A00.000Z&endDateTime=2021-01-02T00%3A00%3A00.000Z'
    );
  });

  it('keeps the CTA disabled when startDateTime is invalid.', () => {
    const startDateTime = DateTime.fromISO('2021-01-01T00:00:00Z');
    const endDateTime = DateTime.fromISO('2021-01-02T00:00:00Z');

    const { queryByTestId } = renderWindowDateTimePicker({
      startDateTime: startDateTime.toJSDate(),
      endDateTime: endDateTime.toJSDate(),
    });

    expect(queryByTestId(dataTestIds.applyWindow)).toBeDisabled();
    expect(queryByTestId(dataTestIds.startDateTimePicker).querySelector(errorSelector)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.endDateTimePicker).querySelector(errorSelector)).not.toBeInTheDocument();

    changeTextField(dataTestIds.startDateTimePicker, 'invalid-date');

    expect(queryByTestId(dataTestIds.applyWindow)).toBeDisabled();
    expect(queryByTestId(dataTestIds.startDateTimePicker).querySelector(errorSelector)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.endDateTimePicker).querySelector(errorSelector)).not.toBeInTheDocument();
  });

  it('keeps the CTA disabled when endDateTime is invalid.', () => {
    const startDateTime = DateTime.fromISO('2021-01-01T00:00:00Z');
    const endDateTime = DateTime.fromISO('2021-01-02T00:00:00Z');

    const { queryByTestId } = renderWindowDateTimePicker({
      startDateTime: startDateTime.toJSDate(),
      endDateTime: endDateTime.toJSDate(),
    });

    expect(queryByTestId(dataTestIds.applyWindow)).toBeDisabled();
    expect(queryByTestId(dataTestIds.startDateTimePicker).querySelector(errorSelector)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.endDateTimePicker).querySelector(errorSelector)).not.toBeInTheDocument();

    changeTextField(dataTestIds.endDateTimePicker, 'invalid-date');

    expect(queryByTestId(dataTestIds.applyWindow)).toBeDisabled();
    expect(queryByTestId(dataTestIds.startDateTimePicker).querySelector(errorSelector)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.endDateTimePicker).querySelector(errorSelector)).toBeInTheDocument();
  });

  it('keeps the CTA disabled when a validation error happens ("From" is greater than "To").', () => {
    const startDateTime = DateTime.fromISO('2021-01-01T00:00:00Z');
    const endDateTime = DateTime.fromISO('2021-01-02T00:00:00Z');

    const { queryByTestId } = renderWindowDateTimePicker({
      startDateTime: startDateTime.toJSDate(),
      endDateTime: endDateTime.toJSDate(),
    });

    expect(queryByTestId(dataTestIds.applyWindow)).toBeDisabled();
    expect(queryByTestId(dataTestIds.startDateTimePicker).querySelector(errorSelector)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.endDateTimePicker).querySelector(errorSelector)).not.toBeInTheDocument();

    changeTextField(
      dataTestIds.startDateTimePicker,
      DateTime.fromISO('2022-01-01T00:00:00Z').toFormat(DateTimeFormat.US_DEFAULT)
    );

    expect(queryByTestId(dataTestIds.applyWindow)).toBeDisabled();
    expect(queryByTestId(dataTestIds.startDateTimePicker).querySelector(errorSelector)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.endDateTimePicker).querySelector(errorSelector)).toBeInTheDocument();
  });

  it('opens KeyboardDateTimePicker when picker button is clicked', () => {
    const startDateTime = DateTime.fromISO('2021-01-01T00:00:00Z');
    const endDateTime = DateTime.fromISO('2021-01-02T00:00:00Z');

    const { queryByTestId } = renderWindowDateTimePicker({
      startDateTime: startDateTime.toJSDate(),
      endDateTime: endDateTime.toJSDate(),
    });

    queryByTestId(dataTestIds.endDateTimePicker).querySelector('button').click();

    expect(document.querySelector('.MuiPickerDTToolbar-toolbar')).toBeInTheDocument();
    expect(document.querySelector('.MuiPickerDTTabs-tabs')).toBeInTheDocument();
    expect(document.querySelector('.MuiPickersDatePickerRoot-toolbar')).not.toBeInTheDocument(); // class only in KeyboardDatePicker
  });

  it('opens KeyboardDatePicker (without hour/minutes) when picker button is clicked if "disableTime" is set', () => {
    const startDate = DateTime.fromISO('2021-01-01');
    const endDate = DateTime.fromISO('2021-01-02');

    const { queryByTestId } = renderWindowDateTimePicker({
      startDateTime: startDate.toJSDate(),
      endDateTime: endDate.toJSDate(),
      disableTime: true,
    });

    queryByTestId(dataTestIds.endDateTimePicker).querySelector('button').click();

    expect(document.querySelector('.MuiPickerDTToolbar-toolbar')).not.toBeInTheDocument(); // class only in KeyboardDateTimePicker
    expect(document.querySelector('.MuiPickerDTTabs-tabs')).not.toBeInTheDocument(); // class only in KeyboardDateTimePicker
    expect(document.querySelector('.MuiPickersDatePickerRoot-toolbar')).toBeInTheDocument();
  });

  it('uses the date format given when set', () => {
    const startDateTime = DateTime.fromISO('2021-01-01T00:00:00Z');
    const endDateTime = DateTime.fromISO('2021-01-02T00:00:00Z');

    const dateFormat = 'MM/dd/yyyy';

    const { queryByTestId } = renderWindowDateTimePicker({
      startDateTime: startDateTime.toJSDate(),
      endDateTime: endDateTime.toJSDate(),
      disableTime: true,
      format: dateFormat,
    });

    expect(queryByTestId(dataTestIds.startDateTimePicker).querySelector('input')).toHaveValue(
      startDateTime.toFormat(dateFormat)
    );
  });
});

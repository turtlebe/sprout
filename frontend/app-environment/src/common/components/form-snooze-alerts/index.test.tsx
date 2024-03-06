import { DEFAULT_DATETIME_MOMENT_FORMAT as FORMAT } from '@plentyag/brand-ui/src/material-ui/pickers/datetime-picker';
import { changeTextField } from '@plentyag/brand-ui/src/test-helpers';
import { render } from '@testing-library/react';
import moment from 'moment';
import React from 'react';

import { dataTestIdsFormSnoozeAlerts as dataTestIds, FormSnoozeAlerts } from '.';

const onSubmit = jest.fn();
const onCancel = jest.fn();

describe('FormSnoozeAlerts', () => {
  beforeEach(() => {
    onSubmit.mockRestore();
    onCancel.mockRestore();
  });

  it('calls onSubmit with the date entered', () => {
    const { queryByTestId } = render(<FormSnoozeAlerts onSubmit={onSubmit} onCancel={onCancel} />);
    const date = moment('2021-01-01T00:00:00Z');

    expect(queryByTestId(dataTestIds.submit)).toBeDisabled();

    changeTextField(dataTestIds.keyboardDateTimePicker, date.format(FORMAT));

    expect(queryByTestId(dataTestIds.submit)).not.toBeDisabled();
    queryByTestId(dataTestIds.submit).click();

    expect(onSubmit).toHaveBeenCalledWith(date.toDate());
  });

  it('keeps the CTA disabled when the date is invalid', () => {
    const errorSelector = '.MuiFormHelperText-root.Mui-error';

    const { queryByTestId } = render(<FormSnoozeAlerts onSubmit={onSubmit} onCancel={onCancel} />);

    expect(queryByTestId(dataTestIds.submit)).toBeDisabled();
    expect(queryByTestId(dataTestIds.keyboardDateTimePicker).querySelector(errorSelector)).not.toBeInTheDocument();

    changeTextField(dataTestIds.keyboardDateTimePicker, 'invalid-date');

    expect(queryByTestId(dataTestIds.submit)).toBeDisabled();
    expect(queryByTestId(dataTestIds.keyboardDateTimePicker).querySelector(errorSelector)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('calls the `onCancel` callback', () => {
    const { queryByTestId } = render(<FormSnoozeAlerts onSubmit={onSubmit} onCancel={onCancel} />);

    expect(queryByTestId(dataTestIds.submit)).toBeDisabled();

    queryByTestId(dataTestIds.cancel).click();

    expect(onSubmit).not.toHaveBeenCalled();
    expect(onCancel).toHaveBeenCalled();
  });

  it('uses a defaultSnoozeDate value', () => {
    const defaultDate = moment('2022-01-01T00:00:00Z');
    const { queryByTestId } = render(
      <FormSnoozeAlerts onSubmit={onSubmit} onCancel={onCancel} defaultSnoozeDate={defaultDate.toDate()} />
    );

    expect(queryByTestId(dataTestIds.keyboardDateTimePicker).querySelector('input').value).toEqual(
      defaultDate.format(FORMAT)
    );

    expect(queryByTestId(dataTestIds.submit)).not.toBeDisabled();
    queryByTestId(dataTestIds.submit).click();

    expect(onSubmit).toHaveBeenCalled();
    expect(onCancel).not.toHaveBeenCalled();
  });
});

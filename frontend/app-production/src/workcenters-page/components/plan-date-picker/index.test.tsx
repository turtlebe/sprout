import { changeTextField } from '@plentyag/brand-ui/src/test-helpers';
import { DateTimeFormat } from '@plentyag/core/src/utils';
import { render } from '@testing-library/react';
import { DateTime } from 'luxon';
import React from 'react';

import { dataTestIdsPlanDatePicker as dataTestIds, PlanDatePicker } from '.';

describe('PlanDatePicker', () => {
  it('invokes callback when date is valid and greater than today', () => {
    const mockOnDateChange = jest.fn();
    const now = DateTime.now();
    const today = now.toJSDate();
    const { queryByTestId } = render(<PlanDatePicker planDate={today} onDateChange={mockOnDateChange} />);

    const input = queryByTestId(dataTestIds.root).querySelector('input');

    const tomorrow = now.plus({ days: 1 }).toFormat(DateTimeFormat.US_DATE_ONLY);
    changeTextField(input, tomorrow);

    expect(mockOnDateChange).toHaveBeenCalledWith(new Date(tomorrow));
  });

  it('does not invoke callback when data is invalid', () => {
    const mockOnDateChange = jest.fn();
    const today = DateTime.now().toJSDate();
    const { queryByTestId } = render(<PlanDatePicker planDate={today} onDateChange={mockOnDateChange} />);

    const input = queryByTestId(dataTestIds.root).querySelector('input');

    changeTextField(input, '01/03/20'); // invalid date
    expect(mockOnDateChange).not.toHaveBeenCalled();
  });
});

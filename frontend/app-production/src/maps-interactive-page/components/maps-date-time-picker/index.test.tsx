import { useMapsInteractiveRouting } from '@plentyag/app-production/src/maps-interactive-page/hooks/use-maps-interactive-routing';
import { useQueryParameter } from '@plentyag/app-production/src/maps-interactive-page/hooks/use-query-parameter';
import { noop } from '@plentyag/app-production/src/maps-interactive-page/utils/noop';
import { useFeatureFlag } from '@plentyag/brand-ui/src/components/feature-flag';
import { changeTextField } from '@plentyag/brand-ui/src/test-helpers';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { DateTimeFormat } from '@plentyag/core/src/utils';
import { render } from '@testing-library/react';
import { DateTime } from 'luxon';
import React from 'react';

import { dataTestIdsMapsDateTimePicker as dataTestIds, MapsDateTimePicker } from '.';

jest.mock('@plentyag/app-production/src/maps-interactive-page/hooks/use-maps-interactive-routing');
const mockChangeSelectedDateQueryParameter = jest.fn();
(useMapsInteractiveRouting as jest.Mock).mockReturnValue({
  changeSelectedDateQueryParameter: mockChangeSelectedDateQueryParameter,
});

jest.mock('@plentyag/app-production/src/maps-interactive-page/hooks/use-query-parameter');

jest.mock('@plentyag/brand-ui/src/components/feature-flag');
const mockUseFeatureFlag = useFeatureFlag as jest.Mock;
mockUseFeatureFlag.mockReturnValue(true);

describe('MapsDateTimePicker', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  function renderMapsDateTimePicker() {
    return render(<MapsDateTimePicker />);
  }

  it('renders date from query parameters', () => {
    jest.useFakeTimers();

    // set fake now date.
    jest.setSystemTime(new Date('2022-01-01 01:01:00 AM'));

    const initialSelectedDate = DateTime.now();

    (useQueryParameter as jest.Mock).mockReturnValue({
      parameters: { selectedDate: initialSelectedDate },
      setParameters: noop,
    });

    const { queryByTestId } = renderMapsDateTimePicker();
    expect(queryByTestId(dataTestIds.dateTimePicker).querySelector('input')).toHaveValue(
      initialSelectedDate.toFormat(DateTimeFormat.US_DEFAULT)
    );
  });

  it('does not update query parameters (or change the "selectedDate" query parameter) when an invalid date is entered', async () => {
    const mockSetParameters = jest.fn();
    (useQueryParameter as jest.Mock).mockReturnValue({
      parameters: { selectedDate: DateTime.now() },
      setParameters: mockSetParameters,
    });
    const { queryByTestId } = renderMapsDateTimePicker();

    const dateTimePickerInput = queryByTestId(dataTestIds.dateTimePicker).querySelector('input');
    await actAndAwait(() => changeTextField(dateTimePickerInput, 'invalid time'));

    expect(mockSetParameters).not.toHaveBeenCalled();
    expect(mockChangeSelectedDateQueryParameter).not.toHaveBeenCalled();
  });

  it('does not update query paramters (or change the "selectedDate" query parameter) when future date is entered', async () => {
    jest.useFakeTimers();

    // set fake now date.
    jest.setSystemTime(new Date('2022-01-01 01:00:00 AM'));

    const mockSetParameters = jest.fn();
    (useQueryParameter as jest.Mock).mockReturnValue({
      parameters: { selectedDate: DateTime.now() },
      setParameters: mockSetParameters,
    });

    const { queryByTestId } = renderMapsDateTimePicker();

    const dateTimePickerInput = queryByTestId(dataTestIds.dateTimePicker).querySelector('input');
    // input date has year 2023 which is after current year 2022
    await actAndAwait(() => changeTextField(dateTimePickerInput, '01/01/2023 03:01 AM'));

    // future date not allowed, so nothing should be updated.
    expect(mockSetParameters).not.toHaveBeenCalled();
    expect(mockChangeSelectedDateQueryParameter).not.toHaveBeenCalled();
  });
});

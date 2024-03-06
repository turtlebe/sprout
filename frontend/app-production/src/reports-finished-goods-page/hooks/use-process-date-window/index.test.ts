import { errorSnackbar, mockGlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar/test-helper';
import { useQueryParam } from '@plentyag/core/src/hooks';
import { DateTimeFormat, getLuxonDateTime } from '@plentyag/core/src/utils';
import { renderHook } from '@testing-library/react-hooks';

import { useProcessDateWindow } from '.';

jest.mock('@plentyag/core/src/hooks/use-query-param');
const mockUseQueryParam = useQueryParam as jest.Mock;

mockGlobalSnackbar();

describe('useProcessDateWindow', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns valid date range', () => {
    // ARRANGE
    mockUseQueryParam.mockImplementation(() => {
      const dates = new Map();
      dates.set('endDateTime', '2022-04-16T12:00:00.000Z');
      dates.set('startDateTime', '2022-04-01T12:00:00.000Z');
      return dates;
    });

    // ACT
    const { result } = renderHook(() => useProcessDateWindow());
    const formattedStartDate = getLuxonDateTime(result.current.startDate).toFormat(
      DateTimeFormat.US_DEFAULT_WITH_SECONDS
    );
    const formattedEndDate = getLuxonDateTime(result.current.endDate).toFormat(DateTimeFormat.US_DEFAULT_WITH_SECONDS);

    // ASSERT
    expect(formattedStartDate).toEqual('04/01/2022 12:00:00 AM'); // start of day
    expect(formattedEndDate).toEqual('04/16/2022 11:59:59 PM'); // end of day
  });

  it('automatically sets start date max days (31) before end date if start date is not given', () => {
    // ARRANGE
    mockUseQueryParam.mockImplementation(() => {
      const dates = new Map();
      dates.set('endDateTime', '2022-04-16');
      return dates;
    });

    // ACT
    const { result } = renderHook(() => useProcessDateWindow());

    const formattedStartDate = getLuxonDateTime(result.current.startDate).toFormat(
      DateTimeFormat.US_DEFAULT_WITH_SECONDS
    );
    const formattedEndDate = getLuxonDateTime(result.current.endDate).toFormat(DateTimeFormat.US_DEFAULT_WITH_SECONDS);

    // ASSERT
    expect(formattedStartDate).toEqual('03/17/2022 12:00:00 AM'); // start of day
    expect(formattedEndDate).toEqual('04/16/2022 11:59:59 PM'); // end of day
  });

  it('throws error in snack bar if date range is beyond max days (31) and sets date as undefined', () => {
    // ARRANGE
    mockUseQueryParam.mockImplementation(() => {
      const dates = new Map();
      dates.set('endDateTime', '2022-04-16');
      dates.set('startDateTime', '2022-01-01');
      return dates;
    });

    // ACT
    const { result } = renderHook(() => useProcessDateWindow());

    // ASSERT
    expect(errorSnackbar).toHaveBeenCalled();
    expect(result.current.startDate).toBeUndefined();
  });
});

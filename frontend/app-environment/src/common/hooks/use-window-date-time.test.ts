import { useQueryParam } from '@plentyag/core/src/hooks';
import { renderHook } from '@testing-library/react-hooks';
import moment from 'moment';

import { useWindowDateTime } from '.';

jest.mock('@plentyag/core/src/hooks/use-query-param');

const mockUseQueryParam = useQueryParam as jest.Mock;

describe('useWindowDateTime', () => {
  beforeEach(() => {
    mockUseQueryParam.mockRestore();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('initializes to now and tomorrow', () => {
    mockUseQueryParam.mockReturnValue(new URLSearchParams(''));

    const { result } = renderHook(() => useWindowDateTime());

    expect(result.current.startDateTime).toEqual(moment().startOf('minute').subtract(1, 'day').toDate());
    expect(result.current.endDateTime).toEqual(moment().startOf('minute').toDate());
  });

  it('initializes from query parameters', () => {
    mockUseQueryParam.mockReturnValue(
      new URLSearchParams('?startDateTime=2019-10-17T08%3A30%3A00.000Z&endDateTime=2019-10-18T12%3A45%3A00.000Z')
    );

    const { result } = renderHook(() => useWindowDateTime());

    expect(result.current.startDateTime).toEqual(moment('2019-10-17T08:30:00.000Z').toDate());
    expect(result.current.endDateTime).toEqual(moment('2019-10-18T12:45:00.000Z').toDate());
  });
});

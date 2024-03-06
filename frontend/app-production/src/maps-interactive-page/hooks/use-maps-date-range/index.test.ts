import { renderHook } from '@testing-library/react-hooks';
import { DateTime } from 'luxon';

import { SupportedAreaClass } from '../../types';

import { useMapsDateRange } from '.';

describe('useMapsDateRange', () => {
  it('returns the date range for germination', () => {
    const date = DateTime.fromSQL('2008-04-16');

    const { result } = renderHook(() => useMapsDateRange('SSF2', SupportedAreaClass.Germination, date));

    expect(result.current.startDate).toEqual(DateTime.fromSQL('2008-04-04').startOf('day').toISO()); // 12 days ago
    expect(result.current.endDate).toEqual(DateTime.fromSQL('2008-04-16').endOf('day').toISO());
  });

  it('returns the date range for propagation', () => {
    const date = DateTime.fromSQL('2008-04-16');

    const { result } = renderHook(() => useMapsDateRange('SSF2', SupportedAreaClass.Propagation, date));

    expect(result.current.startDate).toEqual(DateTime.fromSQL('2008-03-24').startOf('day').toISO()); // 23 days ago
    expect(result.current.endDate).toEqual(DateTime.fromSQL('2008-04-16').endOf('day').toISO());
  });

  it('returns the date range for vertical grow', () => {
    const date = DateTime.fromSQL('2008-04-16');

    const { result } = renderHook(() => useMapsDateRange('SSF2', SupportedAreaClass.VerticalGrow, date));

    expect(result.current.startDate).toEqual(DateTime.fromSQL('2008-03-22').startOf('day').toISO()); // 25 days ago
    expect(result.current.endDate).toEqual(DateTime.fromSQL('2008-04-16').endOf('day').toISO());
  });

  it('returns no values seemlessly if arguments are missing/null/undefined', () => {
    const { result: result1 } = renderHook(() => useMapsDateRange(null, null, null));
    const { result: result2 } = renderHook(() => useMapsDateRange('SSF2', null, null));
    const { result: result3 } = renderHook(() => useMapsDateRange('SSF2', SupportedAreaClass.VerticalGrow, null));

    expect(result1.current.startDate).toBeNull();
    expect(result1.current.endDate).toBeNull();
    expect(result2.current.startDate).toBeNull();
    expect(result2.current.endDate).toBeNull();
    expect(result3.current.startDate).toBeNull();
    expect(result3.current.endDate).toBeNull();
  });
});

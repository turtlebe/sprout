import { useQueryParam } from '@plentyag/core/src/hooks/use-query-param';
import { getLuxonDateTime } from '@plentyag/core/src/utils';
import { act, renderHook } from '@testing-library/react-hooks';
import { useHistory } from 'react-router-dom';

import { DATE_QUERY_PARAM, usePlanDate } from '.';

jest.mock('@plentyag/core/src/hooks/use-query-param');
const mockUseQueryParam = useQueryParam as jest.Mock;

jest.mock('react-router-dom', () => ({
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  ...(jest.requireActual('react-router-dom') as object),
  useHistory: jest.fn(),
}));
const mockUseHistory = useHistory as jest.Mock;

describe('usePlanDate', () => {
  const mockNow = new Date('2022-04-16');
  const mockCurrentPath = '/production/sites/LAX1/farms/LAX1/workcenters/Seed';
  const mockPush = jest.fn();

  beforeAll(() => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(mockNow);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    mockUseQueryParam.mockReturnValue(new Map());
    mockUseHistory.mockReturnValue({
      push: mockPush,
      location: {
        pathname: mockCurrentPath,
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('planDate -> returns current date if no date query param is found', () => {
    // note: return null here since this is what dataQueryParams.get() returns when nothing is found.
    mockUseQueryParam.mockReturnValue(new Map([[DATE_QUERY_PARAM, null]]));

    // ACT
    const { result } = renderHook(() => usePlanDate());

    // ASSERT
    expect(result.current.planDate).toEqual(mockNow);
  });

  it('planDate -> returns query param date', () => {
    // ARRANGE
    mockUseQueryParam.mockReturnValue(
      new Map(
        Object.entries({
          [DATE_QUERY_PARAM]: '2022-11-13',
        })
      )
    );

    // ACT
    const { result } = renderHook(() => usePlanDate());

    // ASSERT
    expect(result.current.planDate).toEqual(getLuxonDateTime('2022-11-13').toJSDate());
  });

  it('setPlanDate => appends date query param to the current path', () => {
    // ARRANGE
    const { result } = renderHook(() => usePlanDate());

    // ACT
    act(() => result.current.setPlanDate(getLuxonDateTime('2009-04-16').toJSDate()));

    // ASSERT
    expect(mockPush).toHaveBeenCalledWith(`${mockCurrentPath}?planDate=2009-04-16`);
  });
});

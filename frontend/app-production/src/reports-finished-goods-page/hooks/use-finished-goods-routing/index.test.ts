import { useQueryParam } from '@plentyag/core/src/hooks/use-query-param';
import { renderHook } from '@testing-library/react-hooks';
import { useHistory, useParams } from 'react-router-dom';

jest.mock('@plentyag/core/src/hooks/use-query-param');
const mockUseQueryParam = useQueryParam as jest.Mock;

jest.mock('react-router-dom', () => ({
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  ...(jest.requireActual('react-router-dom') as object),
  useHistory: jest.fn(),
  useParams: jest.fn(),
}));
const mockUseHistory = useHistory as jest.Mock;
const mockUseParams = useParams as jest.Mock;

import { ReportTabs, useFinishedGoodsRouting } from '.';

describe('useFinishedGoodsRouting', () => {
  const mockBasePath = '/production/sites/LAX1/farms/LAX1/reports/finished-goods';
  let mockPush = jest.fn();

  beforeEach(() => {
    mockUseQueryParam.mockReturnValue(new Map());
    mockUseHistory.mockReturnValue({
      push: mockPush,
    });
    mockUseParams.mockReturnValue({
      reportName: undefined,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns default finished goods tab based on URL param', () => {
    // ACT
    const { result } = renderHook(() => useFinishedGoodsRouting(mockBasePath));

    // ASSERT
    expect(result.current.tab).toEqual(ReportTabs.FINISHED_GOODS);
  });

  it('returns skus tab based on URL param', () => {
    // ARRANGE
    mockUseParams.mockReturnValue({
      reportName: 'skus',
    });

    // ACT
    const { result } = renderHook(() => useFinishedGoodsRouting(mockBasePath));

    // ASSERT
    expect(result.current.tab).toEqual(ReportTabs.SKUS);
  });

  it('getLink => returns the link to the specific tab including date query params', () => {
    // ARRANGE
    mockUseQueryParam.mockReturnValue(
      new Map(
        Object.entries({
          startDateTime: '2022-04-16T12:00:00.000Z',
          endDateTime: '2022-09-01T12:00:00.000Z',
        })
      )
    );

    const { result } = renderHook(() => useFinishedGoodsRouting(mockBasePath));

    // ACT
    const linkResult = result.current.getLink(ReportTabs.SKUS);

    // ASSERT
    expect(linkResult).toEqual(
      `${mockBasePath}/skus?startDateTime=2022-04-16T12%3A00%3A00.000Z&endDateTime=2022-09-01T12%3A00%3A00.000Z`
    );
  });

  it('getLink => returns the link with additional parameters', () => {
    // ARRANGE
    const { result } = renderHook(() => useFinishedGoodsRouting(mockBasePath));

    // ACT
    const linkResult = result.current.getLink(ReportTabs.FINISHED_GOODS, {
      testAdditionalParam: '123',
    });

    // ASSERT
    expect(linkResult).toEqual(`${mockBasePath}?testAdditionalParam=123`);
  });

  it('goTo => navigates to new link', () => {
    // ARRANGE
    mockUseQueryParam.mockReturnValue(
      new Map(
        Object.entries({
          startDateTime: '2022-04-16T12:00:00.000Z',
          endDateTime: '2022-09-01T12:00:00.000Z',
        })
      )
    );
    const { result } = renderHook(() => useFinishedGoodsRouting(mockBasePath));

    // ACT
    result.current.goTo(ReportTabs.SKUS, {
      testAdditionalParam: '123',
    });

    // ASSERT
    expect(mockPush).toHaveBeenCalledWith(
      `${mockBasePath}/skus?testAdditionalParam=123&startDateTime=2022-04-16T12%3A00%3A00.000Z&endDateTime=2022-09-01T12%3A00%3A00.000Z`
    );
  });
});

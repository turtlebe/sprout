import { AppProductionTestWrapper, mockBasePath } from '@plentyag/app-production/src/common/test-helpers';
import { renderHook } from '@testing-library/react-hooks';
import { useHistory } from 'react-router-dom';

import { useQueryParameter } from '../use-query-parameter';

import { useMapsInteractiveRouting } from '.';

jest.mock('react-router-dom', () => ({
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  ...(jest.requireActual('react-router-dom') as object),
  useHistory: jest.fn(),
}));

const mockUseHistory = useHistory as jest.Mock;

jest.mock('../use-query-parameter');
const mockUseQueryParameter = useQueryParameter as jest.Mock;

describe('useMapsInteractiveRouting', () => {
  let basePath;
  let resourcesPageBasePath;
  let mockHistoryPush = jest.fn();

  beforeEach(() => {
    basePath = `${mockBasePath}/maps/interactive`;
    resourcesPageBasePath = `${mockBasePath}/resources`;
    mockUseHistory.mockReturnValue({
      push: mockHistoryPush,
      location: { search: '' },
    });

    mockUseQueryParameter.mockReturnValue({
      resetParameters: jest.fn().mockReturnValue(''),
    });
  });

  function renderUseMapsInteractiveRoutingHook() {
    const wrapper = ({ children }: any) => {
      return <AppProductionTestWrapper>{children}</AppProductionTestWrapper>;
    };

    // ACT
    return renderHook(() => useMapsInteractiveRouting(), { wrapper });
  }

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the specified base path given to provider', () => {
    // ARRANGE
    const {
      result: { current: hookReturn },
    } = renderUseMapsInteractiveRoutingHook();

    // ACT
    const result = hookReturn.getMapsInteractiveRoute();

    // ASSERT
    expect(hookReturn.basePath).toEqual(basePath);
    expect(result).toEqual(basePath);
  });

  it('should return the resources page base path', () => {
    // ACT
    const {
      result: { current: hookReturn },
    } = renderUseMapsInteractiveRoutingHook();

    // ASSERT
    expect(hookReturn.resourcesPageBasePath).toEqual(resourcesPageBasePath);
  });

  it('should return the correct interactve maps route based on base path given area and line name', () => {
    // ARRANGE
    const {
      result: { current: hookReturn },
    } = renderUseMapsInteractiveRoutingHook();

    // ACT
    const result = hookReturn.getMapsInteractiveRoute('VerticalGrow', 'GrowRoom');

    // ASSERT
    expect(result).toEqual(`${basePath}/VerticalGrow/GrowRoom`);
  });

  it('should return the correct interactve maps route based on base path given only area', () => {
    // ARRANGE
    const {
      result: { current: hookReturn },
    } = renderUseMapsInteractiveRoutingHook();
    // ACT
    const result = hookReturn.getMapsInteractiveRoute('VerticalGrow');

    // ASSERT
    expect(result).toEqual(`${basePath}/VerticalGrow`);
  });

  it('should keep current query params when navigating and remove query parameters for "selectedDate", "selectedCrops", "selectedLabels" and "ageCohortDate"', () => {
    mockUseQueryParameter.mockReturnValue({
      resetParameters: jest.fn().mockReturnValue('existing=params'),
    });

    // ARRANGE
    mockUseHistory.mockReturnValue({
      push: mockHistoryPush,
      location: {
        search:
          '?existing=params&selectedDate=2023-06-05T09%3A27%3A51.978-07%3A00&selectedCrops=BAC&selectedLabels=testlabel1&selectedLabels=testLabel2&ageCohortDate=all',
      },
    });
    const {
      result: { current: hookReturn },
    } = renderUseMapsInteractiveRoutingHook();

    // ACT
    const result = hookReturn.getMapsInteractiveRoute('VerticalGrow');

    // ASSERT
    expect(result).toEqual(`${basePath}/VerticalGrow?existing=params`);
  });

  it('should route to the correct interactve maps route based on base path given only area', () => {
    // ARRANGE
    const {
      result: { current: hookReturn },
    } = renderUseMapsInteractiveRoutingHook();

    // ACT
    hookReturn.routeToMapsInterative('VerticalGrow');

    // ASSERT
    expect(mockHistoryPush).toHaveBeenCalledWith(`${basePath}/VerticalGrow`);
  });
});

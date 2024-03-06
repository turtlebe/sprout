import { mockDefaultQueryParameters } from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-default-query-parameters';
import { useCoreStore } from '@plentyag/core/src/core-store';
import { useQueryParam } from '@plentyag/core/src/hooks/use-query-param';
import { render } from '@testing-library/react';
import { DateTime } from 'luxon';
import { MemoryRouter, useHistory, useParams } from 'react-router-dom';

import { dataTestIdsMapsInteractivePage, MapsInteractivePage } from '.';

import { LandingView } from './components/landing-view';
import { MainAreaView } from './components/main-area-view';
import { useLoadMapsAreasData } from './hooks/use-load-maps-areas-data';
import { QueryParameterProvider } from './hooks/use-query-parameter';
import {
  mockAreaWithGerminationLine,
  mockAreaWithPropagationLine,
  mockFarm,
  mockGerminationLine,
  mockPropagationLine,
} from './test-helpers/farm-def-mocks';

jest.mock('react-router-dom', () => ({
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  ...(jest.requireActual('react-router-dom') as object),
  useParams: jest.fn(),
  useHistory: jest.fn(),
}));
jest.mock('@plentyag/core/src/hooks/use-query-param');
jest.mock('@plentyag/core/src/core-store');
jest.mock('./hooks/use-load-maps-areas-data');
jest.mock('./components/main-area-view');
jest.mock('./components/landing-view');
jest.mock('./styles');
jest.mock('./hooks/use-query-parameter');

const mockQueryParameterProvider = QueryParameterProvider as jest.Mock;
mockQueryParameterProvider.mockImplementation(props => props.children);

describe('MapsInteractivePage', () => {
  const dataTestIdsMainAreaView = 'mock-area-view-test-id';
  const dataTestIdsLandingView = 'mock-landing-view-test-id';

  beforeEach(() => {
    // -- hooks
    (useCoreStore as jest.Mock).mockReturnValue([
      {
        currentUser: {
          currentFarmDefPath: 'sites/SSF2/farms/Tigris',
        },
      },
    ]);
    (useParams as jest.Mock).mockReturnValue({ area: 'Germination', line: 'GerminationLine' });
    (useHistory as jest.Mock).mockReturnValue({ push: jest.fn() });
    (useLoadMapsAreasData as jest.Mock).mockReturnValue({
      isValidating: true,
    });
    (useQueryParam as jest.Mock).mockReturnValue(new URLSearchParams(''));
    (MainAreaView as jest.Mock).mockReturnValue(<div data-testid={dataTestIdsMainAreaView}>hi</div>);
    (LandingView as jest.Mock).mockReturnValue(<div data-testid={dataTestIdsLandingView}>hi</div>);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  function renderMapsInteractivePage() {
    return render(<MapsInteractivePage />, {
      wrapper: props => <MemoryRouter {...props} />,
    });
  }

  it('should render loading state while data is being fetched', () => {
    // ACT
    const { queryByTestId } = renderMapsInteractivePage();

    // ASSERT
    expect(useLoadMapsAreasData).toHaveBeenCalledWith({
      siteName: 'SSF2',
      farmName: 'Tigris',
      areaName: 'Germination',
      lineName: 'GerminationLine',
    });
    expect(queryByTestId(dataTestIdsMapsInteractivePage.root)).toBeInTheDocument();
    expect(queryByTestId(dataTestIdsMapsInteractivePage.loading)).toBeInTheDocument();
    expect(queryByTestId(dataTestIdsLandingView)).not.toBeInTheDocument();
  });

  it('should render main content when finished with loading', () => {
    // ARRANGE
    (useLoadMapsAreasData as jest.Mock).mockReturnValue({
      isValidating: false,
      farm: mockFarm,
      area: mockAreaWithGerminationLine,
      line: mockGerminationLine,
      areas: [mockGerminationLine],
    });

    // ACT
    const { queryByTestId } = renderMapsInteractivePage();

    // ASSERT
    expect(queryByTestId(dataTestIdsMapsInteractivePage.root)).toBeInTheDocument();
    expect(queryByTestId(dataTestIdsMapsInteractivePage.loading)).not.toBeInTheDocument();

    // -- calling main content with correct props
    expect(MainAreaView).toHaveBeenCalledWith(
      expect.objectContaining({
        area: mockAreaWithGerminationLine,
        line: mockGerminationLine,
        areas: [mockGerminationLine],
      }),
      expect.anything()
    );
  });

  it('should render landing view if area or line is not supported', () => {
    // ARRANGE
    (useLoadMapsAreasData as jest.Mock).mockReturnValue({
      isValidating: false,
      farm: mockFarm,
      area: mockAreaWithGerminationLine,
      line: { ...mockGerminationLine, class: 'not-supported' },
      areas: [mockGerminationLine],
    });

    // ACT
    const { queryByTestId } = renderMapsInteractivePage();

    // ASSERT
    expect(MainAreaView).not.toHaveBeenCalled();
    expect(queryByTestId(dataTestIdsLandingView)).toBeInTheDocument();
  });

  describe('default query parameters', () => {
    const mockNow = new Date('2023-01-01T00:00:00.000Z');

    beforeEach(() => {
      // ARRANGE
      // -- anchor now date
      jest.useFakeTimers();
      jest.setSystemTime(mockNow);

      // -- mock data hook
      (useLoadMapsAreasData as jest.Mock).mockReturnValue({
        isValidating: false,
        farm: mockFarm,
        area: mockAreaWithGerminationLine,
        line: mockGerminationLine,
        areas: [mockGerminationLine],
      });
    });

    afterEach(() => {
      jest.clearAllMocks();
      jest.useRealTimers();
    });

    it('provides default query parameters', () => {
      renderMapsInteractivePage();

      expect(mockQueryParameterProvider).toHaveBeenCalledWith(
        expect.objectContaining({
          defaultParameters: {
            ...mockDefaultQueryParameters,
            selectedDate: DateTime.fromJSDate(mockNow),
          },
        }),
        expect.anything()
      );
    });

    it('should set new default query parameters when site or line changes', () => {
      (useLoadMapsAreasData as jest.Mock)
        .mockReturnValueOnce({
          isValidating: false,
          farm: mockFarm,
          area: mockAreaWithGerminationLine,
          line: mockGerminationLine,
          areas: [mockGerminationLine],
        })
        .mockReturnValue({
          isValidating: false,
          farm: mockFarm,
          area: mockAreaWithPropagationLine,
          line: mockPropagationLine,
          areas: [mockPropagationLine],
        });

      const { rerender } = renderMapsInteractivePage();

      expect(mockQueryParameterProvider).toHaveBeenCalledWith(
        expect.objectContaining({
          defaultParameters: {
            ...mockDefaultQueryParameters,
            selectedDate: DateTime.fromJSDate(mockNow),
          },
        }),
        expect.anything()
      );

      const newerMockNow = new Date('2023-02-01T00:00:00.000Z');
      jest.setSystemTime(newerMockNow);

      rerender(<MapsInteractivePage />);

      // should be called with newer "now"
      expect(mockQueryParameterProvider).toHaveBeenCalledWith(
        expect.objectContaining({
          defaultParameters: {
            ...mockDefaultQueryParameters,
            selectedDate: DateTime.fromJSDate(newerMockNow),
          },
        }),
        expect.anything()
      );
    });

    it('should set new default query parameters when maps is reset', () => {
      const mockResetMapsDataTestId = 'mock-reset-maps-data-test-id';
      (MainAreaView as jest.Mock).mockImplementation(props => (
        <button onClick={() => props.onMapsReset()} data-testid={mockResetMapsDataTestId}>
          fake maps resets
        </button>
      ));

      const { queryByTestId } = renderMapsInteractivePage();

      expect(mockQueryParameterProvider).toHaveBeenCalledWith(
        expect.objectContaining({
          defaultParameters: {
            ...mockDefaultQueryParameters,
            selectedDate: DateTime.fromJSDate(mockNow),
          },
        }),
        expect.anything()
      );

      const newerMockNow = new Date('2023-02-01T00:00:00.000Z');
      jest.setSystemTime(newerMockNow);

      queryByTestId(mockResetMapsDataTestId).click();

      // should be called with newer "now"
      expect(mockQueryParameterProvider).toHaveBeenCalledWith(
        expect.objectContaining({
          defaultParameters: {
            ...mockDefaultQueryParameters,
            selectedDate: DateTime.fromJSDate(newerMockNow),
          },
        }),
        expect.anything()
      );
    });
  });
});

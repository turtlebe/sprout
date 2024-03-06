import { useMapsInteractiveRouting } from '@plentyag/app-production/src/maps-interactive-page/hooks/use-maps-interactive-routing';
import {
  mockAreaWithGerminationLine,
  mockAreaWithPropLine,
  mockAreaWithVerticalGrowLine,
  mockVerticalGrowLineGrowRoom1,
} from '@plentyag/app-production/src/maps-interactive-page/test-helpers/farm-def-mocks';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { dataTestIdsNavToolbar, NavToolbar } from '.';

jest.mock('@plentyag/app-production/src/maps-interactive-page/hooks/use-maps-interactive-routing');

describe('NavToolbar', () => {
  let mockGetMapsInteractiveRoute, mockRouteToMapsInterative;
  const mockInteractiveMapsRoute = '/production/maps/interactive';

  beforeEach(() => {
    mockGetMapsInteractiveRoute = jest.fn().mockReturnValue(mockInteractiveMapsRoute);
    mockRouteToMapsInterative = jest.fn();

    (useMapsInteractiveRouting as jest.Mock).mockReturnValue({
      getMapsInteractiveRoute: mockGetMapsInteractiveRoute,
      routeToMapsInterative: mockRouteToMapsInterative,
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  function renderNavToolbar(area?, lines = []) {
    const areas = [mockAreaWithGerminationLine, mockAreaWithPropLine, mockAreaWithVerticalGrowLine];
    return render(<NavToolbar lines={lines} areas={areas} area={area} />, {
      wrapper: props => <MemoryRouter {...props} />,
    });
  }

  it('renders', () => {
    // ACT
    const { queryByTestId } = renderNavToolbar();

    // ASSERT
    expect(queryByTestId(dataTestIdsNavToolbar.root)).toBeInTheDocument();
    expect(mockGetMapsInteractiveRoute).toHaveBeenCalled();
  });

  it('renders links to interactive maps home page', () => {
    const { queryByTestId } = renderNavToolbar();

    expect(queryByTestId(dataTestIdsNavToolbar.mapsLink)).toHaveAttribute('href', mockInteractiveMapsRoute);
    expect(queryByTestId(dataTestIdsNavToolbar.interactiveLink)).toHaveAttribute('href', mockInteractiveMapsRoute);
  });

  it('navigates when area dropdown changes and automatically call first line', async () => {
    // ARRANGE
    const { queryByTestId } = renderNavToolbar();

    // ACT
    // -- click to open list
    await actAndAwait(() => queryByTestId(dataTestIdsNavToolbar.areaDropdown).click());

    // -- click dropdown item with name: Propagation
    await actAndAwait(() => queryByTestId(dataTestIdsNavToolbar.areaDropdownItem('Propagation')).click());

    // ASSERT
    expect(mockRouteToMapsInterative).toHaveBeenCalledWith('Propagation', undefined);
  });

  it('navigates when line dropdown changes', async () => {
    // ARRANGE
    const area = mockAreaWithVerticalGrowLine;
    const lines = [mockVerticalGrowLineGrowRoom1];
    const { queryByTestId } = renderNavToolbar(area, lines);

    // ACT
    // -- click to open list
    await actAndAwait(() => queryByTestId(dataTestIdsNavToolbar.lineDropdown).click());

    // -- click on 1st option
    await actAndAwait(() => queryByTestId(dataTestIdsNavToolbar.lineDropdownItem('GrowRoom1')).click());

    // ASSERT
    expect(mockRouteToMapsInterative).toHaveBeenCalledWith('VerticalGrow', 'GrowRoom1');
  });

  it('automatically chooses first line if only area is set', () => {
    // ARRANGE
    const area = mockAreaWithVerticalGrowLine;
    const lines = [mockVerticalGrowLineGrowRoom1];
    renderNavToolbar(area, lines);

    // ASSERT
    expect(mockRouteToMapsInterative).toHaveBeenCalledWith('VerticalGrow', 'GrowRoom1');
  });
});

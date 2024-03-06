import { useMapsInteractiveRouting } from '@plentyag/app-production/src/maps-interactive-page/hooks/use-maps-interactive-routing';
import {
  mockAreaWithGerminationLine,
  mockFarm,
} from '@plentyag/app-production/src/maps-interactive-page/test-helpers/farm-def-mocks';
import { FarmDefArea } from '@plentyag/core/src/farm-def/types';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { Header } from '../header';

import { dataTestIdsLandingView, LandingView } from '.';

import { dataTestIdsAreaCard } from './components/area-card';
import { dataTestIdsNotSupported } from './components/not-supported';

jest.mock('@plentyag/app-production/src/maps-interactive-page/hooks/use-maps-interactive-routing');
jest.mock('../header');

describe('LandingView', () => {
  const dataTestIdsHeader = 'mock-header';

  beforeEach(() => {
    (useMapsInteractiveRouting as jest.Mock).mockReturnValue({
      getMapsInteractiveRoute: jest.fn().mockReturnValue('/production/maps/interactive'),
      routeToMapsInterative: jest.fn(),
    });
    (Header as jest.Mock).mockReturnValue(<div data-testid={dataTestIdsHeader}>mock header</div>);
  });

  function renderLandingView(areas, farm) {
    return render(<LandingView areas={areas} farm={farm} />, {
      wrapper: props => <MemoryRouter {...props} />,
    });
  }

  it('renders', () => {
    // ARRANGE
    const areas: FarmDefArea[] = [mockAreaWithGerminationLine];

    // ACT
    const { queryByTestId, queryAllByTestId } = renderLandingView(areas, mockFarm);

    // ASSERT
    expect(queryByTestId(dataTestIdsLandingView.root)).toBeInTheDocument();
    expect(queryByTestId(dataTestIdsHeader)).toBeInTheDocument();
    expect(queryAllByTestId(dataTestIdsAreaCard.container).length).toBe(1);
  });

  it('renders not supported message if there is no areas/lines', () => {
    // ACT
    const { queryByTestId } = renderLandingView(undefined, mockFarm);

    // ASSERT
    expect(queryByTestId(dataTestIdsLandingView.root)).toBeInTheDocument();
    expect(queryByTestId(dataTestIdsHeader)).toBeInTheDocument();
    expect(queryByTestId(dataTestIdsNotSupported.notSupportedMessage)).toBeInTheDocument();
  });
});

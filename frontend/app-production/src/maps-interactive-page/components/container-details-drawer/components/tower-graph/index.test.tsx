import { mockFarmDefContainerLocations } from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-farm-def-object-data';
import { mocksResourcesState } from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-maps-state';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { dataTestIdsTowerGraph, TowerGraph } from '.';

import { TowerGraphContent } from './tower-graph-content';

jest.mock('./tower-graph-content');

describe('TowerGraph', () => {
  const dataTestIdsTowerGraphContentContainer = 'mock-tower-graph-container';

  beforeEach(() => {
    // Mocking the graph content
    (TowerGraphContent as jest.Mock).mockImplementation(() => (
      <div data-testid={dataTestIdsTowerGraphContentContainer}>tower graph content</div>
    ));
  });

  function renderTowerGraph() {
    const [mockOneResourceState] = mocksResourcesState;
    return render(
      <TowerGraph
        data={{ resourceState: mockOneResourceState, containerLocation: mockFarmDefContainerLocations }}
        getCropColor={jest.fn()}
      />,
      {
        wrapper: props => <MemoryRouter {...props} />,
      }
    );
  }

  it('renders', () => {
    const { queryByTestId } = renderTowerGraph();

    expect(queryByTestId(dataTestIdsTowerGraph.container)).toBeInTheDocument();
    expect(queryByTestId(dataTestIdsTowerGraphContentContainer)).toBeInTheDocument();
  });
});

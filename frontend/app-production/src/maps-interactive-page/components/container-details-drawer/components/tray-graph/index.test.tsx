import { mockFarmDefContainerLocations } from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-farm-def-object-data';
import { mocksResourcesState } from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-maps-state';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { dataTestIdsTrayGraph, TrayGraph } from '.';

import { TrayGraphContent } from './tray-graph-content';

jest.mock('./tray-graph-content');

describe('TrayGraph', () => {
  const dataTestIdsTrayGraphContentContainer = 'mock-tray-graph-container';

  beforeEach(() => {
    // Mocking the graph content
    (TrayGraphContent as jest.Mock).mockImplementation(() => (
      <div data-testid={dataTestIdsTrayGraphContentContainer}>tray graph content</div>
    ));
  });

  function renderTrayGraph() {
    const [mockOneResourceState] = mocksResourcesState;
    return render(
      <TrayGraph
        data={{ resourceState: mockOneResourceState, containerLocation: mockFarmDefContainerLocations }}
        getCropColor={jest.fn()}
      />,
      {
        wrapper: props => <MemoryRouter {...props} />,
      }
    );
  }

  it('render', () => {
    const { queryByTestId } = renderTrayGraph();

    expect(queryByTestId(dataTestIdsTrayGraph.container)).toBeInTheDocument();
    expect(queryByTestId(dataTestIdsTrayGraphContentContainer)).toBeInTheDocument();
  });
});

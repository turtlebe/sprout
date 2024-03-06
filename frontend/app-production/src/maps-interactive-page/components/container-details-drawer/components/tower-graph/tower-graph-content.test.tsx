import { mockChildResourcesMapsState } from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-maps-state';
import { useResizeObserver } from '@plentyag/core/src/hooks';
import { render } from '@testing-library/react';

import { useTowerGraphApi } from '../../hooks/use-tower-graph-api';

import { dataTestIdsTowerGraphContent, TowerGraphContent } from './tower-graph-content';

jest.mock('@plentyag/core/src/hooks/use-resize-observer');
jest.mock('../../hooks/use-tower-graph-api');

describe('TowerGraphContent', () => {
  let mockRenderTower, mockClear;

  beforeEach(() => {
    (useResizeObserver as jest.Mock).mockReturnValue({
      width: 100,
      height: 100,
    });

    mockRenderTower = jest.fn();
    mockClear = jest.fn();

    (useTowerGraphApi as jest.Mock).mockReturnValue({
      renderTower: mockRenderTower,
      clear: mockClear,
    });
  });

  function renderTowerGraphContent() {
    return render(
      <TowerGraphContent siteName="SSF2" trayState={mockChildResourcesMapsState} getCropColor={jest.fn()} />
    );
  }

  it('renders element executing rendering the graph, and then when unmounted, it clears the graph', () => {
    // ACT 1
    const { queryByTestId, unmount } = renderTowerGraphContent();

    // ASSERT 1
    expect(queryByTestId(dataTestIdsTowerGraphContent.container)).toBeInTheDocument();
    expect(mockRenderTower).toHaveBeenCalled();

    // ACT 2
    unmount();

    // ASSERT 2
    expect(queryByTestId(dataTestIdsTowerGraphContent.container)).not.toBeInTheDocument();
    expect(mockClear).toHaveBeenCalled();
  });
});

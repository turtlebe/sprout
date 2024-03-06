import { mockChildResourcesMapsState } from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-maps-state';
import { useResizeObserver } from '@plentyag/core/src/hooks';
import { render } from '@testing-library/react';

import { useTrayGraphApi } from '../../hooks/use-tray-graph-api';

import { dataTestIdsTrayGraphContent, TrayGraphContent } from './tray-graph-content';

jest.mock('@plentyag/core/src/hooks/use-resize-observer');
jest.mock('../../hooks/use-tray-graph-api');

describe('TrayGraphContent', () => {
  let mockRenderTray, mockClear;

  beforeEach(() => {
    (useResizeObserver as jest.Mock).mockReturnValue({
      width: 100,
      height: 100,
    });

    mockRenderTray = jest.fn();
    mockClear = jest.fn();

    (useTrayGraphApi as jest.Mock).mockReturnValue({
      renderTray: mockRenderTray,
      clear: mockClear,
    });
  });

  function renderTrayGraphContent() {
    return render(
      <TrayGraphContent siteName="SSF2" trayState={mockChildResourcesMapsState} getCropColor={jest.fn()} />
    );
  }

  it('renders element executing rendering the graph, and then when unmounted, it clears the graph', () => {
    // ACT 1
    const { queryByTestId, unmount } = renderTrayGraphContent();

    // ASSERT 1
    expect(queryByTestId(dataTestIdsTrayGraphContent.container)).toBeInTheDocument();
    expect(mockRenderTray).toHaveBeenCalled();

    // ACT 2
    unmount();

    // ASSERT 2
    expect(queryByTestId(dataTestIdsTrayGraphContent.container)).not.toBeInTheDocument();
    expect(mockClear).toHaveBeenCalled();
  });
});

import { useGetParentChildResources } from '@plentyag/app-production/src/common/hooks';
import { mockData } from '@plentyag/app-production/src/common/hooks/use-get-parent-child-resources/mock-get-states-by-historic-ids';
import { mockFarmDefContainerLocations } from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-farm-def-object-data';
import { mocksResourcesState } from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-maps-state';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { fireEvent, render } from '@testing-library/react';
import { useRef } from 'react';
import { MemoryRouter } from 'react-router-dom';

import { ContainerDetailsDrawer } from '../..';
import { dataTestIdsTooltip } from '../../../container-summary-tooltip';

import { dataTestIdsTableGraph, TableGraph } from '.';

import { TableGraphContent } from './table-graph-content';

jest.mock('@plentyag/app-production/src/common/hooks');
jest.mock('./table-graph-content');

jest.mock('../..');
const mockContainerDetailsDrawer = ContainerDetailsDrawer as jest.Mock;
const mockDrawerShowingTrayDataTestid = 'drawer-with-tray-info';
mockContainerDetailsDrawer.mockImplementation(() => {
  return <div data-testid={mockDrawerShowingTrayDataTestid}>mock drawer showing tray</div>;
});

describe('TableGraph', () => {
  const dataTestIdsTableGraphContentContainer = 'mock-table-graph-container';
  const dataTestIdsTableGraphContentTray = 'mock-table-graph-tray';

  beforeEach(() => {
    /**
     * Mocking the graph content
     */
    (TableGraphContent as jest.Mock).mockImplementation(({ onTrayClick, onTrayEnter, onTrayExit }) => {
      const ref = useRef(null);
      const [resourceState] = mockData;
      return (
        <div data-testid={dataTestIdsTableGraphContentContainer}>
          <div
            ref={ref}
            data-testid={dataTestIdsTableGraphContentTray}
            onClick={() => {
              onTrayClick(null, ref.current, { resourceState });
            }}
            onMouseEnter={() => {
              onTrayEnter(null, ref.current, { resourceState });
            }}
            onMouseLeave={() => {
              onTrayExit(null, ref.current, { resourceState });
            }}
          >
            Tray
          </div>
        </div>
      );
    });
  });

  function renderTableGraph() {
    const [mockOneResourceState] = mocksResourcesState;
    return render(
      <TableGraph
        data={{ resourceState: mockOneResourceState, containerLocation: mockFarmDefContainerLocations }}
        getCropColor={jest.fn()}
      />,
      {
        wrapper: props => <MemoryRouter {...props} />,
      }
    );
  }

  describe('Loading state', () => {
    beforeEach(() => {
      (useGetParentChildResources as jest.Mock).mockReturnValue({
        isLoading: true,
        childResources: null,
      });
    });

    it('initially renders and display loader', () => {
      const { queryByTestId } = renderTableGraph();

      expect(queryByTestId(dataTestIdsTableGraph.container)).toBeInTheDocument();
      expect(queryByTestId(dataTestIdsTableGraph.loading)).toBeInTheDocument();
    });
  });

  describe('Successful data state', () => {
    beforeEach(() => {
      (useGetParentChildResources as jest.Mock).mockReturnValue({
        isLoading: false,
        childResources: mockData,
      });
    });

    it('renders when data is loaded', () => {
      const { queryByTestId } = renderTableGraph();

      expect(queryByTestId(dataTestIdsTableGraph.loading)).not.toBeInTheDocument();
      expect(queryByTestId(dataTestIdsTableGraphContentContainer)).toBeInTheDocument();
    });

    it('shows tooltips on mouse over and hides on mouse out', async () => {
      const { queryByTestId } = renderTableGraph();

      // mouse over
      await actAndAwait(() => fireEvent.mouseEnter(queryByTestId(dataTestIdsTableGraphContentTray)));
      expect(queryByTestId(dataTestIdsTooltip.container)).toBeInTheDocument();

      // mouse out
      await actAndAwait(() => fireEvent.mouseLeave(queryByTestId(dataTestIdsTableGraphContentTray)));
      expect(queryByTestId(dataTestIdsTooltip.container)).not.toBeInTheDocument();
    });

    it('shows container drawer with tray info when clicked', () => {
      const { queryByTestId } = renderTableGraph();

      expect(queryByTestId(mockDrawerShowingTrayDataTestid)).toBeInTheDocument();

      expect(mockContainerDetailsDrawer).toHaveBeenLastCalledWith(
        expect.objectContaining({
          data: null,
        }),
        expect.anything()
      );

      queryByTestId(dataTestIdsTableGraphContentTray).click();

      expect(queryByTestId(mockDrawerShowingTrayDataTestid)).toBeInTheDocument();

      expect(mockContainerDetailsDrawer).toHaveBeenLastCalledWith(
        expect.objectContaining({
          data: { containerLocation: mockFarmDefContainerLocations, resourceState: mockData[0] },
        }),
        expect.anything()
      );
    });
  });
});

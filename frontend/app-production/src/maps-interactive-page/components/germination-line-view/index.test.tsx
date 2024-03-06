import { mockDefaultQueryParameters } from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-default-query-parameters';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { fireEvent, render } from '@testing-library/react';
import { DateTime } from 'luxon';
import { useRef } from 'react';
import { MemoryRouter } from 'react-router-dom';

import {
  mockFarmDefContainerLocations,
  mockFarmDefMachineGermination,
} from '../../test-helpers/mock-farm-def-object-data';
import { mockMapStateForTable } from '../../test-helpers/mock-map-state-data';
import { ContainerDetailsDrawer } from '../container-details-drawer';
import { TableGraph } from '../container-details-drawer/components/table-graph';
import { dataTestIdsTooltip } from '../container-summary-tooltip';

import { dataTestIdsGerminationLineView, GerminationLineView } from '.';

import { GerminationRackGraph } from './components/germination-rack-graph';

jest.mock('../../hooks/use-load-maps-line-data');
jest.mock('../../hooks/use-load-maps-state');
jest.mock('../../hooks/use-get-crops-color');
jest.mock('./components/germination-rack-graph');
jest.mock('../container-details-drawer/components/table-graph');
jest.mock('../container-details-drawer');

describe('GerminationLineView', () => {
  const selectedDate = DateTime.fromSQL('2020-12-14');
  const mockGetCropColor = jest.fn();

  const dataTestIdGerminationRackGraph = 'germination-rack-graph-test-id';
  const dataTestIdGerminationRackGraphTable = 'germination-rack-graph-table-test-id';
  const dataTestContainerDetailsDrawer = 'container-details-drawer-test-id';

  beforeEach(() => {
    /**
     * Mocking this to have a more controlled test with GerminationRackGraph with a table
     */
    (GerminationRackGraph as jest.Mock).mockImplementation(({ onTableEnter, onTableExit, onTableClick }) => {
      const ref = useRef(null);
      return (
        <div data-testid={dataTestIdGerminationRackGraph}>
          <div
            ref={ref}
            data-testid={dataTestIdGerminationRackGraphTable}
            onMouseEnter={() => {
              onTableEnter(null, ref.current, { containerLocation: mockFarmDefContainerLocations });
            }}
            onMouseLeave={() => {
              onTableExit(null, ref.current, { containerLocation: mockFarmDefContainerLocations });
            }}
            onClick={() => {
              onTableClick(null, ref.current, {
                containerLocation: mockFarmDefContainerLocations,
                resourceState: mockMapStateForTable,
              });
            }}
          >
            Table
          </div>
        </div>
      );
    });

    (ContainerDetailsDrawer as jest.Mock).mockReturnValue(
      <div data-testid={dataTestContainerDetailsDrawer}>mock details drawer</div>
    );

    /**
     * Mocking this as it is complex
     */
    (TableGraph as jest.Mock).mockReturnValue(<div>hi</div>);
  });

  function renderGerminationLineView(machines, mapsState) {
    return render(
      <GerminationLineView
        machines={machines}
        mapsState={mapsState}
        getCropColor={mockGetCropColor}
        queryParameters={{ ...mockDefaultQueryParameters, selectedDate }}
      />,
      {
        wrapper: props => <MemoryRouter {...props} />,
      }
    );
  }

  it('renders', () => {
    const { queryByTestId } = renderGerminationLineView([mockFarmDefMachineGermination], mockMapStateForTable);

    expect(queryByTestId(dataTestIdsGerminationLineView.container)).toBeInTheDocument();
    expect(queryByTestId(dataTestIdsGerminationLineView.loading)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIdGerminationRackGraph)).toBeInTheDocument();
  });

  it('shows tooltips on mouse over and hides on mouse out', async () => {
    const { queryByTestId } = renderGerminationLineView([mockFarmDefMachineGermination], mockMapStateForTable);

    // mouse over
    await actAndAwait(() => fireEvent.mouseEnter(queryByTestId(dataTestIdGerminationRackGraphTable)));
    expect(queryByTestId(dataTestIdsTooltip.container)).toBeInTheDocument();

    // mouse out
    await actAndAwait(() => fireEvent.mouseLeave(queryByTestId(dataTestIdGerminationRackGraphTable)));
    expect(queryByTestId(dataTestIdsTooltip.container)).not.toBeInTheDocument();
  });

  it('shows drawer when table is clicked on', async () => {
    const { queryByTestId } = renderGerminationLineView([mockFarmDefMachineGermination], mockMapStateForTable);

    // open
    await actAndAwait(() => fireEvent.click(queryByTestId(dataTestIdGerminationRackGraphTable)));
    expect(queryByTestId(dataTestContainerDetailsDrawer)).toBeInTheDocument();
  });
});

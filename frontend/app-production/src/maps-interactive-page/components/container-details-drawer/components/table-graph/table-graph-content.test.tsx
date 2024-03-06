import { mockIrrigationTasks } from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-irrigation-tasks';
import { mockChildResourcesMapsState } from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-maps-state';
import { IrrigationExecutionType, IrrigationStatus } from '@plentyag/app-production/src/maps-interactive-page/types';
import { useResizeObserver } from '@plentyag/core/src/hooks';
import { render } from '@testing-library/react';

import { useTableGraphApi } from '../../hooks/use-table-graph-api';

import { dataTestIdsTableGraphContent, TableGraphContent } from './table-graph-content';

jest.mock('@plentyag/core/src/hooks/use-resize-observer');
jest.mock('../../hooks/use-table-graph-api');
const mockIrrigationExecution = mockIrrigationTasks[2].executions[0];

describe('TableGraphContent', () => {
  let mockRenderTrays, mockRenderCoodinates, mockClear;

  beforeEach(() => {
    (useResizeObserver as jest.Mock).mockReturnValue({
      width: 100,
      height: 100,
    });

    mockRenderTrays = jest.fn();
    mockRenderCoodinates = jest.fn();
    mockClear = jest.fn();

    (useTableGraphApi as jest.Mock).mockReturnValue({
      renderTrays: mockRenderTrays,
      renderCoodinates: mockRenderCoodinates,
      clear: mockClear,
    });
  });

  function renderTableGraphContent(status?: IrrigationStatus, type?: IrrigationExecutionType) {
    return render(
      <TableGraphContent
        siteName="SSF2"
        tablesState={mockChildResourcesMapsState}
        getCropColor={jest.fn()}
        irrigationExecution={{ ...mockIrrigationExecution, status, type }}
        onTrayClick={jest.fn()}
        onTrayEnter={jest.fn()}
        onTrayExit={jest.fn()}
      />
    );
  }

  it('renders element executing rendering the graph, and then when unmounted, it clears the graph', () => {
    // ACT 1
    const { queryByTestId, unmount } = renderTableGraphContent();

    // ASSERT 1
    expect(queryByTestId(dataTestIdsTableGraphContent.container)).toBeInTheDocument();
    expect(mockRenderTrays).toHaveBeenCalled();
    expect(mockRenderCoodinates).toHaveBeenCalled();

    // ACT 2
    unmount();

    // ASSERT 2
    expect(queryByTestId(dataTestIdsTableGraphContent.container)).not.toBeInTheDocument();
    expect(mockClear).toHaveBeenCalled();
  });

  it('renders element with irrigation pending box, when irrigation status is cancelled', () => {
    // ACT 1
    const { queryByTestId, unmount } = renderTableGraphContent(IrrigationStatus.CANCELLED);

    // ASSERT 1
    expect(queryByTestId(dataTestIdsTableGraphContent.irrigationBox(IrrigationStatus.CANCELLED))).toBeInTheDocument();
    expect(queryByTestId(dataTestIdsTableGraphContent.irrigationStatusIcon)).toHaveTextContent(
      'irrigation-cancelled-icon.svg'
    );
    expect(queryByTestId(dataTestIdsTableGraphContent.irrigationStatusIcon)).toHaveTextContent('CANCELLED');
    expect(queryByTestId(dataTestIdsTableGraphContent.irrigationTypeIcon)).not.toBeInTheDocument();
    expect(mockRenderTrays).toHaveBeenCalled();
    expect(mockRenderCoodinates).toHaveBeenCalled();

    // ACT 2
    unmount();

    // ASSERT 2
    expect(
      queryByTestId(dataTestIdsTableGraphContent.irrigationBox(IrrigationStatus.CANCELLED))
    ).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIdsTableGraphContent.irrigationStatusIcon)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIdsTableGraphContent.irrigationTypeIcon)).not.toBeInTheDocument();
    expect(mockClear).toHaveBeenCalled();
  });

  it('renders element with irrigation pending box, when irrigation status is cancelled and irrigation type manual', () => {
    // ACT 1
    const { queryByTestId, unmount } = renderTableGraphContent(
      IrrigationStatus.CANCELLED,
      IrrigationExecutionType.MANUAL
    );

    // ASSERT 1
    expect(queryByTestId(dataTestIdsTableGraphContent.irrigationBox(IrrigationStatus.CANCELLED))).toBeInTheDocument();
    expect(queryByTestId(dataTestIdsTableGraphContent.irrigationStatusIcon)).toHaveTextContent(
      'irrigation-cancelled-icon.svg'
    );
    expect(queryByTestId(dataTestIdsTableGraphContent.irrigationStatusIcon)).toHaveTextContent('CANCELLED');
    expect(queryByTestId(dataTestIdsTableGraphContent.irrigationTypeIcon)).toHaveTextContent(
      'irrigation-manual-icon.svg'
    );
    expect(mockRenderTrays).toHaveBeenCalled();
    expect(mockRenderCoodinates).toHaveBeenCalled();

    // ACT 2
    unmount();

    // ASSERT 2
    expect(
      queryByTestId(dataTestIdsTableGraphContent.irrigationBox(IrrigationStatus.CANCELLED))
    ).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIdsTableGraphContent.irrigationStatusIcon)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIdsTableGraphContent.irrigationTypeIcon)).not.toBeInTheDocument();
    expect(mockClear).toHaveBeenCalled();
  });

  it('renders element with irrigation pending box, when irrigation status is created', () => {
    // ACT 1
    const { queryByTestId, unmount } = renderTableGraphContent(IrrigationStatus.CREATED);

    // ASSERT 1
    expect(queryByTestId(dataTestIdsTableGraphContent.irrigationBox(IrrigationStatus.CREATED))).toBeInTheDocument();
    expect(queryByTestId(dataTestIdsTableGraphContent.irrigationStatusIcon)).toHaveTextContent(
      'irrigation-pending-icon.svg'
    );
    expect(queryByTestId(dataTestIdsTableGraphContent.irrigationStatusIcon)).toHaveTextContent('CREATED');
    expect(queryByTestId(dataTestIdsTableGraphContent.irrigationTypeIcon)).not.toBeInTheDocument();
    expect(mockRenderTrays).toHaveBeenCalled();
    expect(mockRenderCoodinates).toHaveBeenCalled();

    // ACT 2
    unmount();

    // ASSERT 2
    expect(queryByTestId(dataTestIdsTableGraphContent.irrigationBox(IrrigationStatus.CREATED))).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIdsTableGraphContent.irrigationStatusIcon)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIdsTableGraphContent.irrigationTypeIcon)).not.toBeInTheDocument();
    expect(mockClear).toHaveBeenCalled();
  });

  it('renders element with irrigation pending box, when irrigation status is created and irrigation type manual', () => {
    // ACT 1
    const { queryByTestId, unmount } = renderTableGraphContent(
      IrrigationStatus.CREATED,
      IrrigationExecutionType.MANUAL
    );

    // ASSERT 1
    expect(queryByTestId(dataTestIdsTableGraphContent.irrigationBox(IrrigationStatus.CREATED))).toBeInTheDocument();
    expect(queryByTestId(dataTestIdsTableGraphContent.irrigationStatusIcon)).toHaveTextContent(
      'irrigation-pending-icon.svg'
    );
    expect(queryByTestId(dataTestIdsTableGraphContent.irrigationStatusIcon)).toHaveTextContent('CREATED');
    expect(queryByTestId(dataTestIdsTableGraphContent.irrigationTypeIcon)).toHaveTextContent(
      'irrigation-manual-icon.svg'
    );
    expect(mockRenderTrays).toHaveBeenCalled();
    expect(mockRenderCoodinates).toHaveBeenCalled();

    // ACT 2
    unmount();

    // ASSERT 2
    expect(queryByTestId(dataTestIdsTableGraphContent.irrigationBox(IrrigationStatus.CREATED))).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIdsTableGraphContent.irrigationStatusIcon)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIdsTableGraphContent.irrigationTypeIcon)).not.toBeInTheDocument();
    expect(mockClear).toHaveBeenCalled();
  });

  it('renders element with irrigation pending box, when irrigation status is failure', () => {
    // ACT 1
    const { queryByTestId, unmount } = renderTableGraphContent(IrrigationStatus.FAILURE);

    // ASSERT 1
    expect(queryByTestId(dataTestIdsTableGraphContent.irrigationBox(IrrigationStatus.FAILURE))).toBeInTheDocument();
    expect(queryByTestId(dataTestIdsTableGraphContent.irrigationStatusIcon)).toHaveTextContent(
      'irrigation-failure-icon.svg'
    );
    expect(queryByTestId(dataTestIdsTableGraphContent.irrigationStatusIcon)).toHaveTextContent('FAILURE');
    expect(queryByTestId(dataTestIdsTableGraphContent.irrigationTypeIcon)).not.toBeInTheDocument();
    expect(mockRenderTrays).toHaveBeenCalled();
    expect(mockRenderCoodinates).toHaveBeenCalled();

    // ACT 2
    unmount();

    // ASSERT 2
    expect(queryByTestId(dataTestIdsTableGraphContent.irrigationBox(IrrigationStatus.FAILURE))).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIdsTableGraphContent.irrigationStatusIcon)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIdsTableGraphContent.irrigationTypeIcon)).not.toBeInTheDocument();
    expect(mockClear).toHaveBeenCalled();
  });

  it('renders element with irrigation pending box, when irrigation status is failure and irrigation type manual', () => {
    // ACT 1
    const { queryByTestId, unmount } = renderTableGraphContent(
      IrrigationStatus.FAILURE,
      IrrigationExecutionType.MANUAL
    );

    // ASSERT 1
    expect(queryByTestId(dataTestIdsTableGraphContent.irrigationBox(IrrigationStatus.FAILURE))).toBeInTheDocument();
    expect(queryByTestId(dataTestIdsTableGraphContent.irrigationStatusIcon)).toHaveTextContent(
      'irrigation-failure-icon.svg'
    );
    expect(queryByTestId(dataTestIdsTableGraphContent.irrigationStatusIcon)).toHaveTextContent('FAILURE');
    expect(queryByTestId(dataTestIdsTableGraphContent.irrigationTypeIcon)).toHaveTextContent(
      'irrigation-manual-icon.svg'
    );
    expect(mockRenderTrays).toHaveBeenCalled();
    expect(mockRenderCoodinates).toHaveBeenCalled();

    // ACT 2
    unmount();

    // ASSERT 2
    expect(queryByTestId(dataTestIdsTableGraphContent.irrigationBox(IrrigationStatus.ONGOING))).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIdsTableGraphContent.irrigationStatusIcon)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIdsTableGraphContent.irrigationTypeIcon)).not.toBeInTheDocument();
    expect(mockClear).toHaveBeenCalled();
  });

  it('renders element with irrigation pending box, when irrigation status is ongoing', () => {
    // ACT 1
    const { queryByTestId, unmount } = renderTableGraphContent(IrrigationStatus.ONGOING);

    // ASSERT 1
    expect(queryByTestId(dataTestIdsTableGraphContent.irrigationBox(IrrigationStatus.ONGOING))).toBeInTheDocument();
    expect(queryByTestId(dataTestIdsTableGraphContent.irrigationStatusIcon)).toHaveTextContent(
      'irrigation-pending-icon.svg'
    );
    expect(queryByTestId(dataTestIdsTableGraphContent.irrigationStatusIcon)).toHaveTextContent('ONGOING');
    expect(queryByTestId(dataTestIdsTableGraphContent.irrigationTypeIcon)).not.toBeInTheDocument();
    expect(mockRenderTrays).toHaveBeenCalled();
    expect(mockRenderCoodinates).toHaveBeenCalled();

    // ACT 2
    unmount();

    // ASSERT 2
    expect(queryByTestId(dataTestIdsTableGraphContent.irrigationBox(IrrigationStatus.ONGOING))).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIdsTableGraphContent.irrigationStatusIcon)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIdsTableGraphContent.irrigationTypeIcon)).not.toBeInTheDocument();
    expect(mockClear).toHaveBeenCalled();
  });

  it('renders element with irrigation pending box, when irrigation status is ongoing and irrigation type manual', () => {
    // ACT 1
    const { queryByTestId, unmount } = renderTableGraphContent(
      IrrigationStatus.ONGOING,
      IrrigationExecutionType.MANUAL
    );

    // ASSERT 1
    expect(queryByTestId(dataTestIdsTableGraphContent.irrigationBox(IrrigationStatus.ONGOING))).toBeInTheDocument();
    expect(queryByTestId(dataTestIdsTableGraphContent.irrigationStatusIcon)).toHaveTextContent(
      'irrigation-pending-icon.svg'
    );
    expect(queryByTestId(dataTestIdsTableGraphContent.irrigationStatusIcon)).toHaveTextContent('ONGOING');
    expect(queryByTestId(dataTestIdsTableGraphContent.irrigationTypeIcon)).toHaveTextContent(
      'irrigation-manual-icon.svg'
    );
    expect(mockRenderTrays).toHaveBeenCalled();
    expect(mockRenderCoodinates).toHaveBeenCalled();

    // ACT 2
    unmount();

    // ASSERT 2
    expect(queryByTestId(dataTestIdsTableGraphContent.irrigationBox(IrrigationStatus.SUCCESS))).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIdsTableGraphContent.irrigationStatusIcon)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIdsTableGraphContent.irrigationTypeIcon)).not.toBeInTheDocument();
    expect(mockClear).toHaveBeenCalled();
  });

  it('renders element with irrigation success box, when irrigation status is success', () => {
    // ACT 1
    const { queryByTestId, unmount } = renderTableGraphContent(IrrigationStatus.SUCCESS);

    // ASSERT 1
    expect(queryByTestId(dataTestIdsTableGraphContent.irrigationBox(IrrigationStatus.SUCCESS))).toBeInTheDocument();
    expect(queryByTestId(dataTestIdsTableGraphContent.irrigationStatusIcon)).toHaveTextContent(
      'irrigation-success-icon.svg'
    );
    expect(queryByTestId(dataTestIdsTableGraphContent.irrigationStatusIcon)).toHaveTextContent('SUCCESS');
    expect(queryByTestId(dataTestIdsTableGraphContent.irrigationTypeIcon)).not.toBeInTheDocument();
    expect(mockRenderTrays).toHaveBeenCalled();
    expect(mockRenderCoodinates).toHaveBeenCalled();

    // ACT 2
    unmount();

    // ASSERT 2
    expect(queryByTestId(dataTestIdsTableGraphContent.irrigationBox(IrrigationStatus.SUCCESS))).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIdsTableGraphContent.irrigationStatusIcon)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIdsTableGraphContent.irrigationTypeIcon)).not.toBeInTheDocument();
    expect(mockClear).toHaveBeenCalled();
  });

  it('renders element with irrigation success box, when irrigation status is success and irrigation type manual', () => {
    // ACT 1
    const { queryByTestId, unmount } = renderTableGraphContent(
      IrrigationStatus.SUCCESS,
      IrrigationExecutionType.MANUAL
    );

    // ASSERT 1
    expect(queryByTestId(dataTestIdsTableGraphContent.irrigationBox(IrrigationStatus.SUCCESS))).toBeInTheDocument();
    expect(queryByTestId(dataTestIdsTableGraphContent.irrigationStatusIcon)).toHaveTextContent(
      'irrigation-success-icon.svg'
    );
    expect(queryByTestId(dataTestIdsTableGraphContent.irrigationStatusIcon)).toHaveTextContent('SUCCESS');
    expect(queryByTestId(dataTestIdsTableGraphContent.irrigationTypeIcon)).toHaveTextContent(
      'irrigation-manual-icon.svg'
    );
    expect(mockRenderTrays).toHaveBeenCalled();
    expect(mockRenderCoodinates).toHaveBeenCalled();

    // ACT 2
    unmount();

    // ASSERT 2
    expect(queryByTestId(dataTestIdsTableGraphContent.irrigationBox(IrrigationStatus.SUCCESS))).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIdsTableGraphContent.irrigationStatusIcon)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIdsTableGraphContent.irrigationTypeIcon)).not.toBeInTheDocument();
    expect(mockClear).toHaveBeenCalled();
  });
});

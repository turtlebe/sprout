import { mockBufferCarriers } from '@plentyag/app-production/src/central-processing-dashboard-page/test-helpers/mock-carrier';
import { AppProductionTestWrapper } from '@plentyag/app-production/src/common/test-helpers';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { getTowerDestinationFromPath } from '@plentyag/core/src/utils';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';

import { InlineDestinationAction } from '../inline-destination-action';

import { BufferCarriersTable, dataTestIdsBufferCarriersTable as dataTestIds } from '.';

jest.mock('../inline-destination-action');
const MockInlineDestinationAction = InlineDestinationAction as jest.Mock;

describe('BufferCarriersTable', () => {
  const mockInlineDestinationActionDataTestId = 'mockInlineDestinationActionDataTestId';

  function renderBufferCarriersTable(props?: Partial<BufferCarriersTable>) {
    return render(<BufferCarriersTable bufferCarriers={mockBufferCarriers} {...props} />, {
      wrapper: AppProductionTestWrapper,
    });
  }

  beforeEach(() => {
    MockInlineDestinationAction.mockImplementation(({ bufferCarrierState, onAfterSubmitAsync }) => (
      <div data-testid={mockInlineDestinationActionDataTestId} onClick={onAfterSubmitAsync}>
        {getTowerDestinationFromPath(bufferCarrierState.next_destination)}
      </div>
    ));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders', () => {
    // ACT
    const { queryAllByTestId, queryByTestId } = renderBufferCarriersTable();

    // ASSERT
    function expectRowToHaveContent(rowIndex: number) {
      const carrierId = mockBufferCarriers[rowIndex].carrier_id;
      const rowData = mockBufferCarriers[rowIndex];
      expect(queryByTestId(dataTestIds.tableCellCarrierIndex(carrierId))).not.toBeInTheDocument();
      expect(queryByTestId(dataTestIds.tableCellCarrierLink(carrierId))).toHaveTextContent(carrierId);
      expect(queryByTestId(dataTestIds.tableCellFinalDestination(carrierId))).toHaveTextContent(
        getTowerDestinationFromPath(rowData.next_destination)
      );
      expect(queryByTestId(dataTestIds.tableCellTowerLink(carrierId))).toHaveTextContent(rowData.tower_id);
      expect(queryByTestId(dataTestIds.tableCellCrop(carrierId))).toHaveTextContent(rowData.crop);
      expect(queryByTestId(dataTestIds.tableCellTowerLabels(carrierId))).toHaveTextContent(
        rowData.tower_labels.join(', ')
      );
    }

    expect(queryAllByTestId(dataTestIds.tableRow)).toHaveLength(3);
    expectRowToHaveContent(0);
    expectRowToHaveContent(1);
    expectRowToHaveContent(2);
  });

  it('render showing order', () => {
    // ACT
    const { queryAllByTestId, queryByTestId } = renderBufferCarriersTable({
      showOrder: true,
    });

    // ASSERT
    expect(queryAllByTestId(dataTestIds.tableRow)).toHaveLength(3);
    expect(queryByTestId(dataTestIds.tableCellCarrierIndex(mockBufferCarriers[0].carrier_id))).toHaveTextContent(
      mockBufferCarriers[0].buffer_position.toString()
    );
    expect(queryByTestId(dataTestIds.tableCellCarrierIndex(mockBufferCarriers[1].carrier_id))).toHaveTextContent(
      mockBufferCarriers[1].buffer_position.toString()
    );
    expect(queryByTestId(dataTestIds.tableCellCarrierIndex(mockBufferCarriers[2].carrier_id))).toHaveTextContent(
      mockBufferCarriers[2].buffer_position.toString()
    );
  });

  it('renders active highlight on row', async () => {
    // ARRANGE
    const mockOnUpdateAsync = jest.fn().mockReturnValue(Promise.resolve(true));

    const { queryAllByTestId } = renderBufferCarriersTable({ onUpdateAsync: mockOnUpdateAsync });
    const firstRow = queryAllByTestId(dataTestIds.tableRow)[0];

    // ASSERT 0
    expect(firstRow.getAttribute('active')).toBeNull();

    // ACT 1
    await actAndAwait(() => fireEvent.mouseEnter(firstRow));

    // ASSERT 1
    expect(firstRow.getAttribute('active')).toEqual('true');

    // ACT 2 -- update async callback
    await actAndAwait(() => fireEvent.click(queryAllByTestId(mockInlineDestinationActionDataTestId)[0]));

    // ASSERT 2
    expect(mockOnUpdateAsync).toHaveBeenCalled();
  });

  it('renders message when buffer carriers data is empty', () => {
    // ACT
    const { queryByTestId } = renderBufferCarriersTable({ bufferCarriers: [] });

    // ASSERT
    expect(queryByTestId(dataTestIds.emptyTableMessage)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.root)).not.toBeInTheDocument();
  });
});

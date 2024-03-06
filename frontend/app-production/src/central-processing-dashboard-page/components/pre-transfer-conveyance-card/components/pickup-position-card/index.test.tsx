import { mockCarriers } from '@plentyag/app-production/src/central-processing-dashboard-page/test-helpers/mock-carrier';
import { AppProductionTestWrapper } from '@plentyag/app-production/src/common/test-helpers';
import { getTowerDestinationFromPath } from '@plentyag/core/src/utils';
import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsBufferCarriersTable } from '../../../buffer-carriers-table';

import { PickupPositionCard } from '.';

describe('PickupPositionCard', () => {
  it('renders the card w/ table', () => {
    const { queryByTestId, queryAllByTestId } = render(<PickupPositionCard pickupBuffer={mockCarriers} />, {
      wrapper: AppProductionTestWrapper,
    });

    function expectRowToHaveContent(rowIndex: number) {
      const carrierId = mockCarriers[rowIndex].carrier_id;
      const rowData = mockCarriers[rowIndex];
      expect(queryByTestId(dataTestIdsBufferCarriersTable.tableCellCarrierIndex(carrierId))).not.toBeInTheDocument();
      expect(queryByTestId(dataTestIdsBufferCarriersTable.tableCellCarrierLink(carrierId))).toHaveTextContent(
        carrierId
      );
      expect(queryByTestId(dataTestIdsBufferCarriersTable.tableCellFinalDestination(carrierId))).toHaveTextContent(
        getTowerDestinationFromPath(rowData.final_destination)
      );
      expect(queryByTestId(dataTestIdsBufferCarriersTable.tableCellTowerLink(carrierId))).toHaveTextContent(
        rowData.tower_id
      );
      expect(queryByTestId(dataTestIdsBufferCarriersTable.tableCellCrop(carrierId))).toHaveTextContent(rowData.crop);
      expect(queryByTestId(dataTestIdsBufferCarriersTable.tableCellTowerLabels(carrierId))).toHaveTextContent(
        rowData.tower_labels.join(', ')
      );
    }

    expect(queryAllByTestId(dataTestIdsBufferCarriersTable.tableRow)).toHaveLength(2);
    expectRowToHaveContent(0);
    expectRowToHaveContent(1);
  });
});

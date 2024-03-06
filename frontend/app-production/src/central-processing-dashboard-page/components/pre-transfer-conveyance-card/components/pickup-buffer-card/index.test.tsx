import { mockCarriers } from '@plentyag/app-production/src/central-processing-dashboard-page/test-helpers/mock-carrier';
import { AppProductionTestWrapper } from '@plentyag/app-production/src/common/test-helpers';
import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsPickupBufferCard as dataTestIds, PickupBufferCard } from '.';

describe('PickupBufferCard', () => {
  it('renders the card w/ table', () => {
    const { queryByTestId, queryAllByTestId } = render(<PickupBufferCard pickupBuffer={mockCarriers} />, {
      wrapper: AppProductionTestWrapper,
    });

    function expectRowToHaveContent(rowIndex: number) {
      const carrierId = mockCarriers[rowIndex].carrier_id;
      const rowData = mockCarriers[rowIndex];
      expect(queryByTestId(dataTestIds.tableCellCarrierIndex(carrierId))).toHaveTextContent(
        rowData.buffer_position.toString()
      );
      expect(queryByTestId(dataTestIds.tableCellCarrierLink(carrierId))).toHaveTextContent(carrierId);
    }

    expect(queryAllByTestId(dataTestIds.tableRow)).toHaveLength(1);
    expectRowToHaveContent(2);
  });
});

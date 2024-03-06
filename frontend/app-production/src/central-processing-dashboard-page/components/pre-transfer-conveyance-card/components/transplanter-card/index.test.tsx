import { mockTowers } from '@plentyag/app-production/src/central-processing-dashboard-page/test-helpers';
import { AppProductionTestWrapper } from '@plentyag/app-production/src/common/test-helpers';
import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsTransplanterCard as dataTestIds, TransplanterCard } from '.';

describe('TransplanterCard', () => {
  it('renders the card w/ table', () => {
    const { queryByTestId, queryAllByTestId } = render(<TransplanterCard title="towers" towers={mockTowers} />, {
      wrapper: AppProductionTestWrapper,
    });

    function expectRowToHaveContent(rowIndex: number) {
      const towerId = mockTowers[rowIndex].containerObj.serial;
      const rowData = mockTowers[rowIndex];

      expect(queryByTestId(dataTestIds.tableCellTowerLink(towerId))).toHaveTextContent(towerId);
      expect(queryByTestId(dataTestIds.tableCellCrop(towerId))).toHaveTextContent(rowData.materialObj.product);
      expect(queryByTestId(dataTestIds.tableCellTowerLabels(towerId))).toHaveTextContent(
        rowData.containerLabels.join(', ')
      );
    }

    expect(queryAllByTestId(dataTestIds.tableRow)).toHaveLength(2);
    expectRowToHaveContent(0);
    expectRowToHaveContent(1);
  });
});

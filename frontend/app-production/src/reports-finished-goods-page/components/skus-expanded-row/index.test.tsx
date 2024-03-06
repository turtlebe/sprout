import { AppProductionTestWrapper } from '@plentyag/app-production/src/common/test-helpers';
import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { render } from '@testing-library/react';
import React from 'react';

import { mockFinishedGoodsDataSkus } from '../../test-helpers/mock-finished-goods-data';

import { dataTestIdsSkusExpandedRow as dataTestIds, SkusExpandedRow } from '.';

describe('SkusExpandedRow', () => {
  const [mockSkuData] = mockFinishedGoodsDataSkus;

  it('renders', () => {
    // ARRANGE
    mockCurrentUser();

    // ACT
    const { queryByTestId } = render(<SkusExpandedRow data={mockSkuData} />, {
      wrapper: AppProductionTestWrapper,
    });

    // ASSERT
    expect(queryByTestId(dataTestIds.root)).toBeInTheDocument();
  });
});

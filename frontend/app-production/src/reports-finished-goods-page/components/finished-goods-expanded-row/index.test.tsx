import { mockPackagingLot } from '@plentyag/core/src/test-helpers/mocks';
import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { mockSkusWithCount } from '../../test-helpers/mock-skus';

import { dataTestIdsFinishedGoodsExpandedRow as dataTestIds, FinishedGoodsExpandedRow } from '.';

describe('FinishedGoodsExpandedRow', () => {
  const mockBasePath = '/production/sites/LAX1/farms/LAX1/reports/finished-goods';

  it('renders', () => {
    // ACT
    const { queryByTestId } = render(
      <FinishedGoodsExpandedRow basePath={mockBasePath} lot={mockPackagingLot} skus={mockSkusWithCount} />,
      { wrapper: props => <MemoryRouter {...props} /> }
    );

    // ASSERT
    expect(queryByTestId(dataTestIds.root)).toBeInTheDocument();
  });
});

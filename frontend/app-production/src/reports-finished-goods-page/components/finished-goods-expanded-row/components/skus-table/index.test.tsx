import { mockSkusWithCount } from '@plentyag/app-production/src/reports-finished-goods-page/test-helpers/mock-skus';
import { mockPackagingLot } from '@plentyag/core/src/test-helpers/mocks';
import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { dataTestIdsSkusTable as dataTestIds, SkusTable } from '.';

describe('SkusTable', () => {
  const mockBasePath = '/production/sites/LAX1/farms/LAX1/reports/finished-goods';

  it('renders a list of associated SKUs', () => {
    // ACT
    const { queryByTestId } = render(
      <SkusTable basePath={mockBasePath} lot={mockPackagingLot} skus={mockSkusWithCount} />,
      { wrapper: props => <MemoryRouter {...props} /> }
    );

    // ASSERT
    expect(queryByTestId(dataTestIds.root)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.noSkus)).not.toBeInTheDocument();
    // -- first row
    expect(queryByTestId(dataTestIds.link('C11Case6Clamshell4o5oz')).getAttribute('href')).toEqual(
      `${mockBasePath}/skus?lotName=filterType-text-*type-contains-*filter-5-LAX1-C11-219&sku=filterType-text-*type-contains-*filter-Sweet%20Sunrise%206ct%20Case%20of%20Clamshells%204.5oz`
    );
    expect(queryByTestId(dataTestIds.count('C11Case6Clamshell4o5oz')).textContent).toEqual('1');
    expect(queryByTestId(dataTestIds.date('C11Case6Clamshell4o5oz')).textContent).toEqual('08/21/2022');
    // -- second row
    expect(queryByTestId(dataTestIds.link('B10Case6Clamshell4o5oz')).getAttribute('href')).toEqual(
      `${mockBasePath}/skus?lotName=filterType-text-*type-contains-*filter-5-LAX1-C11-219&sku=filterType-text-*type-contains-*filter-BAC%20Arugula%20Testing%20Oscar%206ct%20Case%20of%20Clamshells%204.5oz`
    );
    expect(queryByTestId(dataTestIds.count('B10Case6Clamshell4o5oz')).textContent).toEqual('3');
    expect(queryByTestId(dataTestIds.date('B10Case6Clamshell4o5oz')).textContent).toEqual('08/22/2022');
  });

  it('renders "No SKUs associated" if there are no associated SKUs', () => {
    // ACT
    const { queryByTestId } = render(<SkusTable basePath={mockBasePath} lot={mockPackagingLot} skus={[]} />, {
      wrapper: props => <MemoryRouter {...props} />,
    });

    // ASSERT
    expect(queryByTestId(dataTestIds.noSkus)).toBeInTheDocument();
  });
});

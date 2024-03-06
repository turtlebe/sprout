import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { useFetchFinishedGoodCases } from '@plentyag/core/src/hooks/use-fetch-finished-good-cases';
import { useFetchPackagingLots } from '@plentyag/core/src/hooks/use-fetch-packaging-lots';
import { mockFinishedGoodsCases, mockPackagingLots } from '@plentyag/core/src/test-helpers/mocks/finished-good-cases';
import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { dataTestIdsReportsFinishedGoods as dataTestIds, ReportsFinishedGoods } from '.';

import { useLoadCrops } from './hooks/use-load-crops';
import { useLoadSkusForPackagingLots } from './hooks/use-load-skus-for-packaging-lots';
import { mockCrops } from './test-helpers/mock-crops';
import { mockSkus } from './test-helpers/mock-skus';

jest.mock('./hooks/use-load-crops');
const mockUseLoadCrops = useLoadCrops as jest.Mock;

jest.mock('@plentyag/core/src/hooks/use-fetch-finished-good-cases');
const mockUseLoadFinishedGoodCases = useFetchFinishedGoodCases as jest.Mock;

jest.mock('@plentyag/core/src/hooks/use-fetch-packaging-lots');
const mockUseFetchPackagingLots = useFetchPackagingLots as jest.Mock;

jest.mock('./hooks/use-load-skus-for-packaging-lots');
const mockUseLoadSkusForPackagingLots = useLoadSkusForPackagingLots as jest.Mock;

describe('ReportsFinishedGoods', () => {
  beforeEach(() => {
    mockCurrentUser();

    mockUseLoadCrops.mockReturnValue({
      crops: mockCrops,
      isLoading: false,
    });
    mockUseLoadFinishedGoodCases.mockReturnValue({
      cases: mockFinishedGoodsCases,
      isLoading: false,
    });
    mockUseFetchPackagingLots.mockReturnValue({
      lots: mockPackagingLots,
      isLoading: false,
    });
    mockUseLoadSkusForPackagingLots.mockReturnValue({
      skus: mockSkus,
      isLoading: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  function renderFinishedGoodsReport() {
    return render(<ReportsFinishedGoods />, {
      wrapper: props => <MemoryRouter {...props} />,
    });
  }

  it('renders', () => {
    // ACT
    const { queryByTestId } = renderFinishedGoodsReport();

    // ASSERT
    expect(queryByTestId(dataTestIds.root)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.loading)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.title).textContent).toEqual('Finished Goods Report');
    expect(mockUseLoadSkusForPackagingLots).toHaveBeenCalledWith({
      lots: mockPackagingLots,
      includeDeleted: true,
      skuTypeClass: 'Case',
    });
  });

  it('shows loading', () => {
    // ARRANGE
    mockUseLoadFinishedGoodCases.mockReturnValue({
      cases: [],
      isLoading: true,
    });

    // ACT
    const { queryByTestId } = renderFinishedGoodsReport();

    // ASSERT
    expect(queryByTestId(dataTestIds.loading)).toBeInTheDocument();
  });
});

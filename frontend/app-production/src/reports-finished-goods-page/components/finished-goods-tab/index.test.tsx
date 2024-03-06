import {
  errorSnackbar,
  mockGlobalSnackbar,
  successSnackbar,
} from '@plentyag/brand-ui/src/components/global-snackbar/test-helper';
import { mockPackagingLot, mockPackagingLotWithOverride } from '@plentyag/core/src/test-helpers/mocks';
import { mockFinishedGoodsCases } from '@plentyag/core/src/test-helpers/mocks/finished-good-cases';
import { act, render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { useFinishedGoodsAgGridConfig } from '../../hooks/use-finished-goods-ag-grid-config';
import { mockCrops } from '../../test-helpers/mock-crops';
import { mockSkus } from '../../test-helpers/mock-skus';

import { dataTestIdsFinishedGoodsTab as dataTestIds, FinishedGoodsTab } from '.';

jest.mock('../../hooks/use-finished-goods-ag-grid-config');
const mockUseFinishedGoodsAgGridConfig = useFinishedGoodsAgGridConfig as jest.Mock;

mockGlobalSnackbar();

describe('FinishedGoodsTab', () => {
  const mockBasePath = '/production/sites/LAX1/farms/LAX1/reports/finished-goods';
  let mockRefresh, mockFinishedGoodsData;

  beforeEach(() => {
    mockRefresh = jest.fn();
    mockFinishedGoodsData = {
      lots: [mockPackagingLot, mockPackagingLotWithOverride],
      crops: mockCrops,
      cases: mockFinishedGoodsCases,
      skus: mockSkus,
    };
    mockUseFinishedGoodsAgGridConfig.mockReturnValue({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  function renderFinishedGoodsTab() {
    return render(
      <FinishedGoodsTab finishedGoodsData={mockFinishedGoodsData} refresh={mockRefresh} basePath={mockBasePath} />,
      {
        wrapper: props => <MemoryRouter {...props} />,
      }
    );
  }

  it('renders', () => {
    // ACT
    const { queryByTestId } = renderFinishedGoodsTab();

    // ASSERT
    expect(queryByTestId(dataTestIds.root)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.unreleasedCount)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.releasedCount)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.expiredCount)).toBeInTheDocument();
  });

  it('calls refresh callback and show success snackbar after a record is successfully saved', () => {
    // ARRANGE
    let mockHandleUpdateStatusSuccess;
    mockUseFinishedGoodsAgGridConfig.mockImplementation(({ onUpdateStatusSuccess }) => {
      mockHandleUpdateStatusSuccess = jest.fn().mockImplementation(() => {
        onUpdateStatusSuccess();
      });
      return {};
    });

    renderFinishedGoodsTab();

    // ACT
    act(() => mockHandleUpdateStatusSuccess());

    // ASSERT
    expect(successSnackbar).toHaveBeenCalled();
    expect(mockRefresh).toHaveBeenCalled();
  });

  it('shows error snackbar after a record failed saving', () => {
    // ARRANGE
    let mockHandleUpdateStatusError;
    mockUseFinishedGoodsAgGridConfig.mockImplementation(({ onUpdateStatusError }) => {
      mockHandleUpdateStatusError = jest.fn().mockImplementation(() => {
        onUpdateStatusError();
      });
      return {};
    });

    renderFinishedGoodsTab();

    // ACT
    act(() => mockHandleUpdateStatusError());

    // ASSERT
    expect(errorSnackbar).toHaveBeenCalled();
    expect(mockRefresh).not.toHaveBeenCalled();
  });
});

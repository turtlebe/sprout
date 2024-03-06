import {
  errorSnackbar,
  mockGlobalSnackbar,
  successSnackbar,
} from '@plentyag/brand-ui/src/components/global-snackbar/test-helper';
import { mockPackagingLot, mockPackagingLotWithOverride, mockSkus } from '@plentyag/core/src/test-helpers/mocks';
import { mockFinishedGoodsCases } from '@plentyag/core/src/test-helpers/mocks/finished-good-cases';
import { act, render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { useSkusAgGridConfig } from '../../hooks/use-skus-ag-grid-config';
import { mockCrops } from '../../test-helpers/mock-crops';

import { dataTestIdsSkusTab as dataTestIds, SkusTab } from '.';

jest.mock('../../hooks/use-skus-ag-grid-config');
const mockUseSkusAgGridConfig = useSkusAgGridConfig as jest.Mock;
mockGlobalSnackbar();

describe('SkusTab', () => {
  let mockRefresh, mockFinishedGoodsData;

  beforeEach(() => {
    mockRefresh = jest.fn();
    mockFinishedGoodsData = {
      lots: [mockPackagingLot, mockPackagingLotWithOverride],
      crops: mockCrops,
      cases: mockFinishedGoodsCases,
      skus: mockSkus,
    };
    mockUseSkusAgGridConfig.mockReturnValue({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  function renderSkusTab() {
    return render(
      <MemoryRouter>
        <SkusTab finishedGoodsData={mockFinishedGoodsData} refresh={mockRefresh} />
      </MemoryRouter>
    );
  }

  it('renders', () => {
    // ACT
    const { queryByTestId } = renderSkusTab();

    // ASSERT
    expect(queryByTestId(dataTestIds.root)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.unreleasedCount)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.releasedCount)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.expiredCount)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.casesCount)).toBeInTheDocument();
  });

  it('calls refresh callback and show success snackbar after a record is successfully saved', () => {
    // ARRANGE
    let mockHandleUpdateStatusSuccess;
    mockUseSkusAgGridConfig.mockImplementation(({ onUpdateStatusSuccess }) => {
      mockHandleUpdateStatusSuccess = jest.fn().mockImplementation(() => {
        onUpdateStatusSuccess();
      });
      return {};
    });

    // ACT 1
    renderSkusTab();

    // ASSERT 1
    expect(successSnackbar).not.toHaveBeenCalled();
    expect(mockRefresh).not.toHaveBeenCalled();

    // ACT 2
    act(() => mockHandleUpdateStatusSuccess());

    // ASSERT 2
    expect(successSnackbar).toHaveBeenCalled();
    expect(mockRefresh).toHaveBeenCalled();
  });

  it('shows error snackbar after a record failed saving', () => {
    // ARRANGE
    let mockHandleUpdateStatusError;
    mockUseSkusAgGridConfig.mockImplementation(({ onUpdateStatusError }) => {
      mockHandleUpdateStatusError = jest.fn().mockImplementation(() => {
        onUpdateStatusError();
      });
      return {};
    });

    // ACT 1
    renderSkusTab();

    // ASSERT 1
    expect(successSnackbar).not.toHaveBeenCalled();
    expect(mockRefresh).not.toHaveBeenCalled();

    // ACT 2
    act(() => mockHandleUpdateStatusError());

    // ASSERT 2
    expect(errorSnackbar).toHaveBeenCalled();
    expect(mockRefresh).not.toHaveBeenCalled();
  });
});

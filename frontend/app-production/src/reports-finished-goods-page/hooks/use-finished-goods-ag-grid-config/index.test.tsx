import { BaseAgGridClientSideTable } from '@plentyag/brand-ui/src/components';
import { render, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { MemoryRouter } from 'react-router-dom';

import { ButtonEditTestStatus } from '../../components/button-edit-test-status';
import { mockFinishedGoodsDataLots } from '../../test-helpers/mock-finished-goods-data';

import { dataTestIdsFinishedGoodsAgGrid as dataTestIds, useFinishedGoodsAgGridConfig } from '.';

jest.mock('../../components/button-edit-test-status');
const mockButtonEditTestStatus = ButtonEditTestStatus as jest.Mock;

describe('useFinishedGoodsAgGridConfig', () => {
  let mockOnUpdateStatusSuccess, mockOnUpdateStatusError;

  function renderAgGrid() {
    // -- render hook
    const hookRender = renderHook(() =>
      useFinishedGoodsAgGridConfig({
        finishedGoodsData: mockFinishedGoodsDataLots,
        onUpdateStatusSuccess: mockOnUpdateStatusSuccess,
        onUpdateStatusError: mockOnUpdateStatusError,
      })
    );

    // -- render component
    const componentRender = render(<BaseAgGridClientSideTable agGridConfig={hookRender.result.current} />, {
      wrapper: props => <MemoryRouter {...props} />,
    });

    return {
      hook: hookRender,
      component: componentRender,
    };
  }

  beforeEach(() => {
    mockOnUpdateStatusSuccess = jest.fn();
    mockOnUpdateStatusError = jest.fn();
    mockButtonEditTestStatus.mockImplementation(props => {
      return (
        <button data-testid={props['data-testid']} onClick={() => props.onSuccess()}>
          edit me
        </button>
      );
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns ag grid config without errors', () => {
    // ACT
    const { hook } = renderAgGrid();
    const { result } = hook;

    // ASSERT
    expect(result.current).toEqual(
      expect.objectContaining({
        rowData: mockFinishedGoodsDataLots,
        rowHeight: 48,
      })
    );
    expect(result.current.columnDefs[0].headerName).toEqual('Status');
    expect(result.current.columnDefs[1].headerName).toEqual('Harvested');
    expect(result.current.columnDefs[2].headerName).toEqual('Packaging Lot');
    expect(result.current.columnDefs[3].headerName).toEqual('Exp Date');
    expect(result.current.columnDefs[4].headerName).toEqual('Crop');
    expect(result.current.columnDefs[5].headerName).toEqual('Full Name');
    expect(result.current.columnDefs[6].headerName).toEqual('QA Status');
    expect(result.current.columnDefs[7].headerName).toEqual('Lab Testing');
    expect(result.current.columnDefs[8].headerName).toEqual('Notes');
  });

  it('returns a dash if there is an invalid exp date', () => {
    // ARRANGE
    const { hook } = renderAgGrid();

    const row = {
      data: { ...mockFinishedGoodsDataLots[0], expDate: null }, // null exp date
    };

    // ACT
    const expDateResult = (hook.result.current.columnDefs[3] as any).valueGetter(row);

    // ASSERT
    expect(expDateResult).toEqual('-');
  });

  it('returns correct overridden test statuses', () => {
    // ARRANGE
    const { hook } = renderAgGrid();

    const row = {
      data: { ...mockFinishedGoodsDataLots[0] }, // should contain overrides
    };

    // ACT
    const qaResult = (hook.result.current.columnDefs[6] as any).valueGetter(row);
    const ltResult = (hook.result.current.columnDefs[7] as any).valueGetter(row);

    // ASSERT
    // -- test qa status
    expect(row.data.lot.properties.passedQaStatus).not.toEqual('HOLD');
    expect(qaResult).toEqual('HOLD');
    // -- test lt status
    expect(row.data.lot.properties.passedLtStatus).not.toEqual('FAIL');
    expect(ltResult).toEqual('FAIL');
  });

  it.each([
    ['success', 'QA', dataTestIds.editQAStatus],
    ['error', 'QA', dataTestIds.editQAStatus],
    ['success', 'Lab Testing', dataTestIds.editLTStatus],
    ['error', 'Lab Testing', dataTestIds.editLTStatus],
  ])('handle the %s action results of %s fields', async (responseStatus, field, dataTestId) => {
    // ARRANGE
    // -- mock edit button
    mockButtonEditTestStatus.mockImplementation(props => {
      return (
        <button
          data-testid={dataTestId}
          onClick={() => {
            responseStatus === 'success' ? props.onSuccess() : props.onError();
          }}
        >
          {field}
        </button>
      );
    });

    // -- setup with ag grid config
    const { component } = renderAgGrid();
    const { queryByTestId } = component;

    // ACT
    await waitFor(() => queryByTestId(dataTestId).click());

    // ASSERT
    if (responseStatus === 'success') {
      expect(mockOnUpdateStatusSuccess).toHaveBeenCalled();
    } else {
      expect(mockOnUpdateStatusError).toHaveBeenCalled();
    }
  });
});

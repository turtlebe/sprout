import { DialogBaseForm } from '@plentyag/brand-ui/src/components/dialog-base-form';
import { Show } from '@plentyag/brand-ui/src/components/show';
import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import {
  mockPackagingLotWithOverride,
  mockPackagingLotWithReleaseDetailsOverride,
  mockSku,
} from '@plentyag/core/src/test-helpers/mocks';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { useFinishedGoodsTestStatusFormGenConfig } from '../../hooks/use-finished-goods-test-status-form-gen-config';
import { FinishedGoodsStatus, TestStatusField } from '../../types';

import { ButtonEditTestStatus, dataTestIdsButtonEditTestStatus as dataTestIds } from '.';

mockCurrentUser();

jest.mock('@plentyag/brand-ui/src/components/dialog-base-form');
const mockDialogBaseForm = DialogBaseForm as jest.Mock;

jest.mock('../../hooks/use-finished-goods-test-status-form-gen-config');
const mockUseFinishedGoodsTestStatusFormGenConfig = useFinishedGoodsTestStatusFormGenConfig as jest.Mock;

describe('ButtonEditTestStatus', () => {
  let mockOnSuccess, mockOnError;

  beforeEach(() => {
    mockOnSuccess = jest.fn();
    mockOnError = jest.fn();

    mockDialogBaseForm.mockImplementation(({ open, onSuccess }) => (
      <Show when={open}>
        <div data-testid={dataTestIds.dialog} onClick={() => onSuccess()} />
      </Show>
    ));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  function renderButtonEditTestStatus(
    field: TestStatusField,
    status = FinishedGoodsStatus.UNRELEASED,
    isSkuLevel = false
  ) {
    return render(
      isSkuLevel ? (
        <ButtonEditTestStatus
          lot={mockPackagingLotWithReleaseDetailsOverride}
          sku={mockSku}
          field={field}
          status={status}
          onSuccess={mockOnSuccess}
          onError={mockOnError}
        />
      ) : (
        <ButtonEditTestStatus
          lot={mockPackagingLotWithOverride}
          field={field}
          status={status}
          onSuccess={mockOnSuccess}
          onError={mockOnError}
        />
      ),
      { wrapper: props => <MemoryRouter {...props} /> }
    );
  }

  describe('form gen config test', () => {
    it('should pass through just lot for lot-based release', () => {
      // ACT
      renderButtonEditTestStatus(TestStatusField.QA, FinishedGoodsStatus.UNRELEASED);

      // ASSERT
      expect(mockUseFinishedGoodsTestStatusFormGenConfig).toHaveBeenCalledWith({
        field: 'qa',
        lotName: '5-LAX1-C11-245',
        username: 'olittle',
      });
    });

    it('should pass in the sku name and netsuiteitem for sku-based release', () => {
      // ACT
      renderButtonEditTestStatus(TestStatusField.QA, FinishedGoodsStatus.UNRELEASED, true);

      // ASSERT
      expect(mockUseFinishedGoodsTestStatusFormGenConfig).toHaveBeenCalledWith({
        field: 'qa',
        lotName: '5-LAX1-C11-245',
        netSuiteItem: '5-003-0004-06',
        skuName: 'Sweet Sunrise 6ct Case of Clamshells 4.5oz',
        username: 'olittle',
      });
    });
  });

  describe('status test', () => {
    it.each([[FinishedGoodsStatus.UNRELEASED], [FinishedGoodsStatus.HOLD]])(
      'renders for lot with %s status',
      status => {
        // ARRANGE
        mockCurrentUser({
          permissions: {
            HYP_QUALITY: 'EDIT',
          },
        });

        // ACT
        const { queryByTestId } = renderButtonEditTestStatus(TestStatusField.QA, status);

        // ASSERT
        expect(queryByTestId(dataTestIds.button)).toBeInTheDocument();
      }
    );

    it.each([[FinishedGoodsStatus.EXPIRED], [FinishedGoodsStatus.RELEASED]])(
      'does not render for lot with %s status',
      status => {
        // ARRANGE
        mockCurrentUser({
          permissions: {
            HYP_QUALITY: 'EDIT',
          },
        });

        // ACT
        const { queryByTestId } = renderButtonEditTestStatus(TestStatusField.QA, status);

        // ASSERT
        expect(queryByTestId(dataTestIds.button)).not.toBeInTheDocument();
      }
    );
  });

  describe('permission tests', () => {
    it('does not render for users without permission', () => {
      // ARRANGE
      mockCurrentUser({
        permissions: {},
      });

      // ACT
      const { queryByTestId } = renderButtonEditTestStatus(TestStatusField.QA);

      // ASSERT
      expect(queryByTestId(dataTestIds.button)).not.toBeInTheDocument();
    });

    it('render QA Testing field for users with Production Admin Edit permission', () => {
      // ARRANGE
      mockCurrentUser({
        permissions: {
          HYP_QUALITY: 'EDIT',
        },
      });

      // ACT
      const { queryByTestId } = renderButtonEditTestStatus(TestStatusField.QA);

      // ASSERT
      expect(queryByTestId(dataTestIds.button)).toBeInTheDocument();
    });

    it('render Lab Testing field for users with Lab Testing Edit permission', () => {
      // ARRANGE
      mockCurrentUser({
        permissions: {
          HYP_LAB_TESTING: 'EDIT',
        },
      });

      // ACT
      const { queryByTestId } = renderButtonEditTestStatus(TestStatusField.LAB_TESTING);

      // ASSERT
      expect(queryByTestId(dataTestIds.button)).toBeInTheDocument();
    });
  });

  describe('interaction tests', () => {
    beforeEach(() => {
      mockCurrentUser({
        permissions: {
          HYP_QUALITY: 'EDIT',
          HYP_LAB_TESTING: 'EDIT',
        },
      });
    });

    it('opens form when clicked and handle success callback', () => {
      // ARRANGE 1
      const { queryByTestId } = renderButtonEditTestStatus(TestStatusField.QA);

      // ASSERT 1
      expect(queryByTestId(dataTestIds.dialog)).not.toBeInTheDocument();

      // ACT 1
      fireEvent.click(queryByTestId(dataTestIds.button));

      // ASSERT 1
      expect(queryByTestId(dataTestIds.dialog)).toBeInTheDocument();

      // ACT 2
      // -- success
      fireEvent.click(queryByTestId(dataTestIds.dialog));

      // ASSERT 2
      expect(mockOnSuccess).toHaveBeenCalled();
    });

    it('handles close form', () => {
      // ARRANGE
      // -- dialog with callback error
      mockDialogBaseForm.mockImplementation(({ open, onClose }) => (
        <Show when={open}>
          <div data-testid={dataTestIds.dialog} onClick={() => onClose()} />
        </Show>
      ));
      // -- render button
      const { queryByTestId } = renderButtonEditTestStatus(TestStatusField.QA);
      // -- click to open dialog
      fireEvent.click(queryByTestId(dataTestIds.button));

      // ASSERT
      // -- dialog opened
      expect(queryByTestId(dataTestIds.dialog)).toBeInTheDocument();

      // ACT
      // -- close dialog
      fireEvent.click(queryByTestId(dataTestIds.dialog));

      // ASSERT
      expect(queryByTestId(dataTestIds.dialog)).not.toBeInTheDocument();
    });

    it('handles error callback', () => {
      // ARRANGE
      // -- dialog with callback error
      mockDialogBaseForm.mockImplementation(({ open, onError }) => (
        <Show when={open}>
          <div data-testid={dataTestIds.dialog} onClick={() => onError()} />
        </Show>
      ));
      // -- render button
      const { queryByTestId } = renderButtonEditTestStatus(TestStatusField.QA);
      // -- click to open dialog
      fireEvent.click(queryByTestId(dataTestIds.button));

      // ACT
      // -- error out
      fireEvent.click(queryByTestId(dataTestIds.dialog));

      // ASSERT
      expect(mockOnError).toHaveBeenCalled();
    });
  });
});

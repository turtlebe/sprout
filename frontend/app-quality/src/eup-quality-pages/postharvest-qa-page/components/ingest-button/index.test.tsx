import { dataTestIdsDialogConfirmation } from '@plentyag/brand-ui/src/components';
import {
  errorSnackbar,
  mockGlobalSnackbar,
  successSnackbar,
} from '@plentyag/brand-ui/src/components/global-snackbar/test-helper';
import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { useFetchPackagingLots, usePostRequest } from '@plentyag/core/src/hooks';
import { mockPackagingLots, mockPackagingLotsRecord } from '@plentyag/core/src/test-helpers/mocks';
import { act, render, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { dataTestIdsIgestButton as dataTestIds, IngestButton } from '.';

mockGlobalSnackbar();

jest.mock('@plentyag/core/src/hooks/use-fetch-packaging-lots');
const mockUseFetchPackagingLots = useFetchPackagingLots as jest.Mock;

jest.mock('@plentyag/core/src/core-store');

jest.mock('@plentyag/core/src/hooks/use-axios');
const mockUsePostRequest = usePostRequest as jest.Mock;

describe('IngestButton', () => {
  function renderIngestButton(props?: Partial<IngestButton>) {
    return render(
      <MemoryRouter>
        <IngestButton
          onCreateIngest={jest.fn()}
          siteName="LAX1"
          farmName="LAX1"
          lotName="5-LAX1-123-1"
          skuName="CRSCase6Clamshell4o5ozPlenty"
          isIngested={false}
          {...props}
        />
      </MemoryRouter>
    );
  }

  beforeEach(() => {
    mockCurrentUser({
      username: 'bishopthesprinker',
      hasPermission: jest.fn().mockReturnValue(true),
      currentFarmDefPath: 'sites/LAX1/farms/LAX1',
    });

    mockUseFetchPackagingLots.mockReturnValue({
      lots: mockPackagingLots,
      lotsRecord: mockPackagingLotsRecord,
      isLoading: false,
    });

    mockUsePostRequest.mockReturnValue({
      data: undefined,
      isLoading: false,
      makeRequest: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks(); // FYI that "resetAllMocks" kills "mockGlobalSnackbar"
  });

  describe('not submitted yet', () => {
    it('renders', () => {
      // ACT
      const { queryByTestId } = renderIngestButton();

      // ASSERT
      expect(queryByTestId(dataTestIds.root)).toBeInTheDocument();
      expect(queryByTestId(dataTestIds.button)).toBeInTheDocument();
      expect(queryByTestId(dataTestIds.submitted)).not.toBeInTheDocument();
      expect(queryByTestId(dataTestIds.passIcon)).not.toBeInTheDocument();
      expect(queryByTestId(dataTestIdsDialogConfirmation.root)).not.toBeInTheDocument();
    });

    it('opens dialog when clicked', async () => {
      // ARRANGE
      const { queryByTestId } = renderIngestButton();

      // ACT
      act(() => queryByTestId(dataTestIds.button).click());

      // ASSERT
      expect(queryByTestId(dataTestIdsDialogConfirmation.root)).toBeInTheDocument();

      // ACT 2
      act(() => queryByTestId(dataTestIdsDialogConfirmation.cancel).click());

      // ASSERT 2
      await waitFor(() => {
        expect(queryByTestId(dataTestIdsDialogConfirmation.root)).not.toBeInTheDocument();
      });
    });

    it('shows success after confirm is clicked and returns a successful response', async () => {
      // ARRANGE
      // -- mocks
      mockUsePostRequest.mockReturnValue({
        data: undefined,
        isLoading: false,
        makeRequest: jest.fn(({ onSuccess }) => onSuccess()),
      });
      const mockOnCreateIngest = jest.fn();

      // -- render and click on button
      const { queryByTestId } = renderIngestButton({
        onCreateIngest: mockOnCreateIngest,
      });

      act(() => queryByTestId(dataTestIds.button).click());

      // ACT
      act(() => queryByTestId(dataTestIdsDialogConfirmation.confirm).click());

      // ASSERT
      await waitFor(() => {
        expect(mockOnCreateIngest).toHaveBeenCalled();
        expect(successSnackbar).toHaveBeenCalledWith('Submitted audits with success');
        expect(queryByTestId(dataTestIdsDialogConfirmation.root)).not.toBeInTheDocument();
      });
    });

    it('shows error after confirm is clicked and returns a failed response', async () => {
      // ARRANGE
      // -- mocks
      const mockError = new Error('no');
      mockError.message = 'no';

      mockUsePostRequest.mockReturnValue({
        data: undefined,
        isLoading: false,
        makeRequest: jest.fn(({ onError }) => onError(mockError)),
      });
      const mockOnCreateIngest = jest.fn();

      // -- render and click on button
      const { queryByTestId } = renderIngestButton({
        onCreateIngest: mockOnCreateIngest,
      });

      act(() => queryByTestId(dataTestIds.button).click());

      // ACT
      act(() => queryByTestId(dataTestIdsDialogConfirmation.confirm).click());

      // ASSERT
      await waitFor(() => {
        expect(mockOnCreateIngest).not.toHaveBeenCalled();
        expect(errorSnackbar).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Error submitting audits',
            message: 'no',
          })
        );
        expect(queryByTestId(dataTestIdsDialogConfirmation.root)).not.toBeInTheDocument();
      });
    });
  });

  describe('submitted', () => {
    it('renders', () => {
      // ACT
      const { queryByTestId } = renderIngestButton({
        isIngested: true,
      });

      // ASSERT
      expect(queryByTestId(dataTestIds.root)).toBeInTheDocument();
      expect(queryByTestId(dataTestIds.button)).not.toBeInTheDocument();
      expect(queryByTestId(dataTestIds.submitted)).toBeInTheDocument();
      expect(queryByTestId(dataTestIds.passIcon)).toBeInTheDocument();
      expect(queryByTestId(dataTestIdsDialogConfirmation.root)).not.toBeInTheDocument();
    });
  });
});

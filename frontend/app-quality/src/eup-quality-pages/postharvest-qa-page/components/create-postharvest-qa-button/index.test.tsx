import { useLoadSkusForPackagingLots } from '@plentyag/app-production/src/reports-finished-goods-page/hooks';
import { dataTestIdsDialogBaseForm } from '@plentyag/brand-ui/src/components';
import { dataTestIdsEditButton } from '@plentyag/brand-ui/src/components/edit-button';
import { mockGlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar/test-helper';
import {
  changeTextField,
  changeTextFieldDateTime,
  chooseFromAutocomplete,
  clickRadio,
  getSubmitButton,
  openAutocomplete,
} from '@plentyag/brand-ui/src/test-helpers';
import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { useFetchPackagingLots, usePostRequest, usePutRequest } from '@plentyag/core/src/hooks';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import {
  mockPackagingLots,
  mockPackagingLotsRecord,
  mockSkus,
  mockSkusRecord,
} from '@plentyag/core/src/test-helpers/mocks';
import { render } from '@testing-library/react';
import { Settings } from 'luxon';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { useFetchAssessmentTypes } from '../../hooks';
import { mockAssessmentTypes } from '../../test-helpers/mock-assessment-types';

import { CreatePostharvestQaButton } from '.';

jest.mock('@plentyag/core/src/hooks/use-fetch-packaging-lots');
const mockUseFetchPackagingLots = useFetchPackagingLots as jest.Mock;

jest.mock('@plentyag/app-production/src/reports-finished-goods-page/hooks/use-load-skus-for-packaging-lots');
const mockUseLoadSkusForPackagingLots = useLoadSkusForPackagingLots as jest.Mock;

jest.mock('@plentyag/core/src/core-store');

jest.mock('@plentyag/core/src/hooks/use-axios');
const mockUsePostRequest = usePostRequest as jest.Mock;
const mockUsePutRequest = usePutRequest as jest.Mock;

jest.mock('../../hooks/use-fetch-assessment-types');
const mockUseFetchAssessmentTypes = useFetchAssessmentTypes as jest.Mock;

mockGlobalSnackbar();

describe('CreatePostharvestQaButton', () => {
  const editButtonDataTestId = dataTestIdsEditButton.editButton('New Audit');

  function renderCreatePostharvestQaButton(props?: Partial<CreatePostharvestQaButton>) {
    return render(
      <MemoryRouter>
        <CreatePostharvestQaButton onSuccess={jest.fn()} siteName="LAX1" farmName="LAX1" {...props} />
      </MemoryRouter>
    );
  }

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2020-04-01'));
    Settings.defaultZone = 'America/Los_Angeles';
  });

  afterAll(() => {
    jest.useRealTimers();
    Settings.defaultZone = 'system';
  });

  beforeEach(() => {
    mockCurrentUser({
      username: 'bishopthesprinker',
      permissions: {
        HYP_QUALITY: 'EDIT',
      },
    });

    mockUseFetchAssessmentTypes.mockReturnValue({
      assessmentTypes: mockAssessmentTypes,
      isLoading: false,
    });

    mockUseFetchPackagingLots.mockReturnValue({
      lots: mockPackagingLots,
      lotsRecord: mockPackagingLotsRecord,
      isLoading: false,
    });

    mockUseLoadSkusForPackagingLots.mockReturnValue({
      skus: mockSkus,
      skusRecord: mockSkusRecord,
      isLoading: false,
    });

    mockUsePostRequest.mockReturnValue({
      data: undefined,
      isLoading: false,
      makeRequest: jest.fn(),
    });

    mockUsePutRequest.mockReturnValue({
      data: undefined,
      isLoading: false,
      makeRequest: jest.fn(),
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('load data', () => {
    it('fetches packaging lots in the last 3 days', () => {
      // ACT
      renderCreatePostharvestQaButton();

      // ASSERT
      expect(mockUseFetchPackagingLots).toHaveBeenCalledWith({
        farmPath: 'sites/LAX1/farms/LAX1',
        startDate: new Date('2020-03-29'),
        endDate: new Date('2020-04-01'),
      });
    });

    it('fetches skus using lots and correct attributes', () => {
      // ACT
      renderCreatePostharvestQaButton();

      // ASSERT
      expect(mockUseLoadSkusForPackagingLots).toHaveBeenCalledWith({
        lots: mockPackagingLots,
        includeDeleted: true,
        skuTypeClass: 'Case',
      });
    });
  });

  describe('button states', () => {
    it('renders', () => {
      // ACT
      const { queryByTestId } = renderCreatePostharvestQaButton();

      // ASSERT
      expect(queryByTestId(editButtonDataTestId)).toBeInTheDocument();
      expect(queryByTestId(editButtonDataTestId)).not.toBeDisabled();
    });

    it('disables if still loading', () => {
      // ARRANGE
      mockUseFetchPackagingLots.mockReturnValue({
        lots: [],
        lotsRecord: {},
        isLoading: true,
      });

      // ACT
      const { queryByTestId } = renderCreatePostharvestQaButton();

      // ASSERT
      expect(queryByTestId(editButtonDataTestId)).toBeDisabled();
    });

    it('should not render if there is no access permission', () => {
      // ARRANGE
      mockCurrentUser({
        username: 'bishopthesprinker',
        permissions: {
          HYP_QUALITY: null,
        },
      });

      // ACT
      const { queryByTestId } = renderCreatePostharvestQaButton();

      // ASSERT
      expect(queryByTestId(editButtonDataTestId)).not.toBeInTheDocument();
    });
  });

  describe('open form', () => {
    function renderCreatePostharvestQaButtonOpenForm(props?: Partial<CreatePostharvestQaButton>) {
      // render button
      const results = renderCreatePostharvestQaButton(props);

      // open the form
      results.queryByTestId(editButtonDataTestId).click();
      return results;
    }

    it('shows the form', () => {
      // ARRANGE & ACT
      const { queryByTestId } = renderCreatePostharvestQaButtonOpenForm();

      // ASSERT
      expect(queryByTestId(dataTestIdsDialogBaseForm.root)).toBeInTheDocument();
    });

    it('makes request after the form is filled out with valid values and submitted', async () => {
      // ARRANGE
      const mockRequest = jest.fn();
      mockUsePostRequest.mockReturnValue({
        data: undefined,
        isLoading: false,
        makeRequest: mockRequest,
      });

      const { queryByTestId } = renderCreatePostharvestQaButtonOpenForm();

      // ACT
      // -- choose lot
      await actAndAwait(() => openAutocomplete('lot'));
      await actAndAwait(() => chooseFromAutocomplete('5-LAX1-C11-219'));

      // -- choose sku
      await actAndAwait(() => openAutocomplete('sku'));
      await actAndAwait(() => chooseFromAutocomplete('C11Case6Clamshell4o5oz'));

      // -- assessment types: tub weight
      await actAndAwait(() => changeTextField('tubWeight', 5));

      // -- assessment types: notes
      await actAndAwait(() => changeTextField('notes', 'this is a good note'));

      // -- assessment types: large leaves
      await actAndAwait(() => clickRadio('largeLeaves', 'FAIL'));

      // -- assessment types: best by date
      await actAndAwait(() => clickRadio('bestByDateCorrect', 'PASS'));

      // -- assessment types: timestamp
      await actAndAwait(() => changeTextFieldDateTime('timestamp', '2020-01-09T19:50:56.761606Z'));

      // -- assessment types: tub weight float choice
      await actAndAwait(() => changeTextField('tubWeightFloatChoice', 6));

      // submit
      await actAndAwait(() => queryByTestId(getSubmitButton()).click());

      // ASSERT
      expect(mockRequest).toHaveBeenCalled();
    });
  });
});

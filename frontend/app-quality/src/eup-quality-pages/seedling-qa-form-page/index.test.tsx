import { dataTestIdsDialogConfirmation, dataTestIdsSnackbar, GlobalSnackbar } from '@plentyag/brand-ui/src/components';
import {
  changeTextArea,
  changeTextField,
  expectErrorOn,
  expectNoErrorOn,
  getInputByName,
  getTextAreaByName,
} from '@plentyag/brand-ui/src/test-helpers';
import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { usePostRequest, usePutRequest } from '@plentyag/core/src/hooks/use-axios';
import { actAndAwait, actAndAwaitRender } from '@plentyag/core/src/test-helpers';
import { axiosRequest } from '@plentyag/core/src/utils/request';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { dataTestIdsInfoDialog } from '../components/info-message-dialog/info-message-dialog';

import { dataTestIdsSeedlingQaForm as dataTestIds, SeedlingQaFormEup } from '.';

import {
  getCheckboxInGrid,
  getMatch,
  getRadioInGrid,
  getTextFieldInGrid,
  MOCK_FARM_DEF_SEARCH_CROPS,
  MOCK_FORM_VALUES_EUPHRATES,
  MOCK_GET_SEEDLING_QA_RECORD_EUPHRATES,
  MOCK_TRAY_ID_RECORD,
} from './test-helpers';

jest.mock('@plentyag/core/src/hooks/use-axios');
jest.mock('@plentyag/core/src/utils/request');
jest.mock('@plentyag/core/src/core-store');

const mockUsePostRequest = usePostRequest as jest.Mock;
const mockUsePostRequest1 = usePostRequest as jest.Mock;
const mockUsePutRequest = usePutRequest as jest.Mock;
const mockAxiosRequest = axiosRequest as jest.Mock;

describe('SeedlingQaForm', () => {
  beforeEach(() => {
    mockUsePostRequest.mockRestore();
    mockUsePostRequest1.mockRestore();
    mockUsePutRequest.mockRestore();
    mockAxiosRequest.mockRestore();
  });

  const fillNonPlugFormFields = async () => {
    changeTextField('trayId', MOCK_FORM_VALUES_EUPHRATES.trayId);
    await actAndAwait(() => jest.runAllTimers());
    changeTextArea('notes', MOCK_FORM_VALUES_EUPHRATES.notes);

    await actAndAwait(() => changeTextField(getTextFieldInGrid('seedlingCount.seedlingCount', 0), 1));
    await actAndAwait(() => changeTextField(getTextFieldInGrid('seedlingCount.seedlingCount', 1), 1));
    await actAndAwait(() => changeTextField(getTextFieldInGrid('seedlingCount.seedlingCount', 2), 1));
    await actAndAwait(() => changeTextField(getTextFieldInGrid('seedlingCount.seedlingCount', 3), 1));
    await actAndAwait(() => getRadioInGrid('packagingCondensationLevels', 0, 'low').click());
    await actAndAwait(() => getRadioInGrid('packagingCondensationLevels', 1, 'low').click());
    await actAndAwait(() => getRadioInGrid('packagingCondensationLevels', 2, 'low').click());
    await actAndAwait(() => getRadioInGrid('packagingCondensationLevels', 3, 'low').click());

    expect(getInputByName('site')).toHaveValue(MOCK_FORM_VALUES_EUPHRATES.site); // -> form has values
    expect(getInputByName('cultivar').value).toContain(MOCK_FORM_VALUES_EUPHRATES.cultivar);
    expect(getInputByName('trayId')).toHaveValue(MOCK_FORM_VALUES_EUPHRATES.trayId);
    expect(getTextAreaByName('notes')).toHaveValue(MOCK_FORM_VALUES_EUPHRATES.notes);
  };

  it('POSTs a new SeedlingQA record and handles form validations', async () => {
    jest.useFakeTimers();

    mockCurrentUser({ permissions: { HYP_QUALITY: 'EDIT' } });

    const makeRequest = jest.fn().mockImplementation(({ data, onSuccess }) => {
      expect(data.id).toBeUndefined();
      expect(data.username).toBe('olittle');
      expect(data.cultivar).toBe(MOCK_FORM_VALUES_EUPHRATES.cultivar);
      expect(data.trayId).toBe(MOCK_FORM_VALUES_EUPHRATES.trayId);
      expect(data.site).toBe(MOCK_FORM_VALUES_EUPHRATES.site);
      expect(data.notes).toBe(MOCK_FORM_VALUES_EUPHRATES.notes);
      expect(data.plugs).toEqual(MOCK_GET_SEEDLING_QA_RECORD_EUPHRATES.plugs);

      onSuccess({
        ...data,
        id: MOCK_FORM_VALUES_EUPHRATES.id,
        seedlingQAActionResponse: MOCK_GET_SEEDLING_QA_RECORD_EUPHRATES.seedlingQAActionResponse,
      });
    });

    mockAxiosRequest.mockImplementation(args => {
      if (!args) {
        return {};
      }

      if (args.url.includes('get-state-by-id')) {
        return { data: MOCK_TRAY_ID_RECORD };
      }

      if (args.url.includes('search-crops')) {
        return { data: MOCK_FARM_DEF_SEARCH_CROPS };
      }

      return {};
    });
    mockUsePostRequest.mockReturnValue({ isLoading: false, makeRequest });
    mockUsePutRequest.mockReturnValue({ isLoading: false, makeRequest: jest.fn() });

    const { getByTestId, queryByTestId } = await actAndAwaitRender(
      <GlobalSnackbar>
        <MemoryRouter>
          <SeedlingQaFormEup match={getMatch()} />
        </MemoryRouter>
      </GlobalSnackbar>
    );

    expect(mockUsePostRequest).toHaveBeenCalledWith({
      url: '/api/plentyservice/product-quality-service/post-seedling-qa',
    });
    expect(mockUsePutRequest).toHaveBeenCalledWith({
      url: '/api/plentyservice/product-quality-service/put-seedling-qa',
    });

    // -> form is empty and no snackbar
    expect(getInputByName('cultivar')).toHaveValue('');
    expect(getInputByName('trayId')).toHaveValue('');
    expect(getInputByName('site')).toHaveValue('LAX1_LAX1');
    expect(getTextAreaByName('notes')).toHaveValue('');
    expect(queryByTestId(dataTestIdsSnackbar.snackbar)).not.toBeInTheDocument();

    // -> form does not have errors
    expectNoErrorOn('cultivar');
    expectNoErrorOn('trayId');
    expectNoErrorOn('site');
    expectNoErrorOn('notes');

    // -> submit
    await actAndAwait(() => getByTestId(dataTestIds.submit).click());

    // -> form has errors
    expectErrorOn('cultivar');
    expectErrorOn('trayId');
    expectNoErrorOn('notes');

    // -> fill up the form
    await actAndAwait(async () => fillNonPlugFormFields());

    // -> submit the form
    await actAndAwait(() => getByTestId(dataTestIds.submit).click());

    // -> errors are cleared
    expectNoErrorOn('site');
    expectNoErrorOn('cultivar');
    expectNoErrorOn('trayId');
    expectNoErrorOn('notes');

    // -> form is submitted and making a POST request
    expect(makeRequest).toHaveBeenCalled();

    // -> form is cleared
    expect(getInputByName('site')).toHaveValue('LAX1_LAX1');
    expect(getTextAreaByName('notes')).toHaveValue('');
    expect(getInputByName('trayId')).toHaveValue('');
    expect(getInputByName('cultivar')).toHaveValue('');

    // -> snackbar appears
    expect(getByTestId(dataTestIdsSnackbar.snackbar)).toBeVisible();

    // we should not fecth existing images on a new form entry
    expect(mockAxiosRequest).not.toHaveBeenCalledWith(
      expect.objectContaining({ url: expect.stringContaining('presigned-get-urls') })
    );

    expect(queryByTestId(dataTestIdsInfoDialog.root)).toBeInTheDocument();
    expect(queryByTestId(dataTestIdsInfoDialog.content)).toHaveTextContent('routed to transplant');
    await actAndAwait(() => getByTestId(dataTestIdsInfoDialog.button).click());
  }, 10000);

  it('POSTs a new SeedlingQA record and show popup message "routing to compost"', async () => {
    mockCurrentUser({ permissions: { HYP_QUALITY: 'EDIT' } });
    jest.useFakeTimers();
    const makeRequest = jest.fn().mockImplementation(({ onError }) =>
      onError({
        status: 400,
        error: 'DEFECT_VALIDATION:{"Compost": ["Damp off"]}',
      })
    );

    mockAxiosRequest.mockImplementation(args => {
      if (!args) {
        return {};
      }

      if (args.url.includes('get-state-by-id')) {
        return { data: MOCK_TRAY_ID_RECORD };
      }

      if (args.url.includes('search-crops')) {
        return { data: MOCK_FARM_DEF_SEARCH_CROPS };
      }

      return {};
    });

    mockUsePostRequest.mockReturnValue({ isLoading: false, makeRequest });
    mockUsePutRequest.mockReturnValue({ isLoading: false, makeRequest: jest.fn() });

    const { getByTestId, queryByTestId } = await actAndAwaitRender(
      <GlobalSnackbar>
        <MemoryRouter>
          <SeedlingQaFormEup match={getMatch()} />
        </MemoryRouter>
      </GlobalSnackbar>
    );

    // -> form is empty and no snackbar
    expect(getInputByName('cultivar')).toHaveValue('');
    expect(getInputByName('trayId')).toHaveValue('');
    expect(getInputByName('site')).toHaveValue('LAX1_LAX1');
    expect(getTextAreaByName('notes')).toHaveValue('');
    expect(queryByTestId(dataTestIdsSnackbar.snackbar)).not.toBeInTheDocument();

    // -> form does not have errors
    expectNoErrorOn('cultivar');
    expectNoErrorOn('trayId');
    expectNoErrorOn('site');
    expectNoErrorOn('notes');

    // -> fill up the form
    await actAndAwait(async () => fillNonPlugFormFields());

    await actAndAwait(() => getCheckboxInGrid('plantHealth.Damp off', 0).click());

    // -> submit the form
    await actAndAwait(() => getByTestId(dataTestIds.submit).click());

    // -> errors are cleared
    expectNoErrorOn('site');
    expectNoErrorOn('cultivar');
    expectNoErrorOn('trayId');
    expectNoErrorOn('notes');
    // jest.advanceTimersByTime(1000);

    // -> form is submitted and making a POST request (first call to have set validation to true)
    expect(makeRequest).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        data: expect.objectContaining({
          enableThresholdsValidation: true,
        }),
      })
    );

    // Confirmation popup message should be shown
    expect(queryByTestId(dataTestIdsDialogConfirmation.root)).toBeInTheDocument();

    // -> set request to be 200 now
    makeRequest.mockImplementation(({ onSuccess }) =>
      onSuccess({
        MOCK_FORM_VALUES_EUPHRATES,
        seedlingQAActionResponse: MOCK_GET_SEEDLING_QA_RECORD_EUPHRATES.seedlingQAActionResponse,
      })
    );

    // -> click on confirm
    await actAndAwait(() => queryByTestId(dataTestIdsDialogConfirmation.confirm).click());

    // -> check re-request with validation set to false
    expect(makeRequest).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        data: expect.objectContaining({
          enableThresholdsValidation: false,
        }),
      })
    );
    expect(queryByTestId(dataTestIdsInfoDialog.root)).toBeInTheDocument();
    expect(queryByTestId(dataTestIdsInfoDialog.content)).toHaveTextContent('routed to compost');
    getByTestId(dataTestIdsInfoDialog.button).click();
  }, 10000);

  it('POSTs a new SeedlingQA record and show popup message "routing to transplant"', async () => {
    mockCurrentUser({ permissions: { HYP_QUALITY: 'EDIT' } });
    jest.useFakeTimers();
    const makeRequest = jest.fn().mockImplementation(({ onError }) =>
      onError({
        status: 400,
        error: 'DEFECT_VALIDATION:{"Compost": ["Damp off"]}',
      })
    );

    mockAxiosRequest.mockImplementation(args => {
      if (!args) {
        return {};
      }

      if (args.url.includes('get-state-by-id')) {
        return { data: MOCK_TRAY_ID_RECORD };
      }

      if (args.url.includes('search-crops')) {
        return { data: MOCK_FARM_DEF_SEARCH_CROPS };
      }

      return {};
    });

    mockUsePostRequest.mockReturnValue({ isLoading: false, makeRequest });
    mockUsePutRequest.mockReturnValue({ isLoading: false, makeRequest: jest.fn() });

    const { getByTestId, queryByTestId } = await actAndAwaitRender(
      <GlobalSnackbar>
        <MemoryRouter>
          <SeedlingQaFormEup match={getMatch()} />
        </MemoryRouter>
      </GlobalSnackbar>
    );

    // -> form is empty and no snackbar
    expect(getInputByName('cultivar')).toHaveValue('');
    expect(getInputByName('trayId')).toHaveValue('');
    expect(getInputByName('site')).toHaveValue('LAX1_LAX1');
    expect(getTextAreaByName('notes')).toHaveValue('');
    expect(queryByTestId(dataTestIdsSnackbar.snackbar)).not.toBeInTheDocument();

    // -> fill up the form
    await actAndAwait(async () => fillNonPlugFormFields());

    // check Damp Off defect checkbox
    await actAndAwait(() => getCheckboxInGrid('plantHealth.Damp off', 0).click());

    // -> submit the form
    await actAndAwait(() => getByTestId(dataTestIds.submit).click());

    // -> form is submitted and making a POST request (first call to have set validation to true)
    expect(makeRequest).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        data: expect.objectContaining({
          enableThresholdsValidation: true,
        }),
      })
    );

    // Confirmation popup message should be shown
    expect(queryByTestId(dataTestIdsDialogConfirmation.root)).toBeInTheDocument();

    // -> set request to be 200 now
    makeRequest.mockImplementation(({ onSuccess }) =>
      onSuccess({
        MOCK_FORM_VALUES_EUPHRATES,
        seedlingQAActionResponse: MOCK_GET_SEEDLING_QA_RECORD_EUPHRATES.seedlingQAActionResponse,
      })
    );

    // -> click on "Review" (cancel button)
    await actAndAwait(() => queryByTestId(dataTestIdsDialogConfirmation.cancel).click());

    // Uncheck Damp Off defect checkbox
    await actAndAwait(() => getCheckboxInGrid('plantHealth.Damp off', 0).click());

    // -> Submit the form again.
    await actAndAwait(() => getByTestId(dataTestIds.submit).click());

    expect(makeRequest).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        data: expect.objectContaining({
          enableThresholdsValidation: true,
        }),
      })
    );

    // Since there was no defect and form will be successfuly submitted, tray will be routed to transplant.
    expect(queryByTestId(dataTestIdsInfoDialog.root)).toBeInTheDocument();
    expect(queryByTestId(dataTestIdsInfoDialog.content)).toHaveTextContent('routed to transplant');
    getByTestId(dataTestIdsInfoDialog.button).click();
  }, 10000);

  it('POSTs a new SeedlingQA record and Warning message is displayed', async () => {
    mockCurrentUser({ permissions: { HYP_QUALITY: 'EDIT' } });
    jest.useFakeTimers();
    const makeRequest = jest.fn().mockImplementation(({ onError }) =>
      onError({
        status: 500,
        error:
          'Your seedling QA submissions has been saved but we encountered an error when trying to check it against the allowable thresholds.',
      })
    );

    mockAxiosRequest.mockImplementation(args => {
      if (!args) {
        return {};
      }

      if (args.url.includes('get-state-by-id')) {
        return { data: MOCK_TRAY_ID_RECORD };
      }

      if (args.url.includes('search-crops')) {
        return { data: MOCK_FARM_DEF_SEARCH_CROPS };
      }

      return {};
    });

    mockUsePostRequest.mockReturnValue({ isLoading: false, makeRequest });
    mockUsePutRequest.mockReturnValue({ isLoading: false, makeRequest: jest.fn() });

    const { getByTestId, queryByTestId } = await actAndAwaitRender(
      <GlobalSnackbar>
        <MemoryRouter>
          <SeedlingQaFormEup match={getMatch()} />
        </MemoryRouter>
      </GlobalSnackbar>
    );

    // -> form is empty and no snackbar
    expect(getInputByName('trayId')).toHaveValue('');
    expect(getInputByName('site')).toHaveValue('LAX1_LAX1');
    expect(queryByTestId(dataTestIdsSnackbar.snackbar)).not.toBeInTheDocument();

    // -> fill up the form
    await actAndAwait(async () => fillNonPlugFormFields());

    // -> submit the form
    await actAndAwait(() => getByTestId(dataTestIds.submit).click());

    expect(queryByTestId(dataTestIdsSnackbar.snackbar)).toBeInTheDocument();
    expect(queryByTestId(dataTestIdsSnackbar.snackbar)).toHaveTextContent(
      'Your seedling QA submissions has been saved but we encountered'
    );
  }, 10000);

  it('POSTs a new SeedlingQA record and Error message is displayed on submitting same tray again on same day', async () => {
    mockCurrentUser({ permissions: { HYP_QUALITY: 'EDIT' } });
    jest.useFakeTimers();
    const makeRequest = jest.fn().mockImplementation(({ onError }) =>
      onError({
        status: 400,
        error: 'QA data has already been submitted for this tray. Please scan a new tray to continue.',
      })
    );

    mockAxiosRequest.mockImplementation(args => {
      if (!args) {
        return {};
      }

      if (args.url.includes('get-state-by-id')) {
        return { data: MOCK_TRAY_ID_RECORD };
      }

      if (args.url.includes('search-crops')) {
        return { data: MOCK_FARM_DEF_SEARCH_CROPS };
      }

      return {};
    });

    mockUsePostRequest.mockReturnValue({ isLoading: false, makeRequest });
    mockUsePutRequest.mockReturnValue({ isLoading: false, makeRequest: jest.fn() });

    const { getByTestId, queryByTestId } = await actAndAwaitRender(
      <GlobalSnackbar>
        <MemoryRouter>
          <SeedlingQaFormEup match={getMatch()} />
        </MemoryRouter>
      </GlobalSnackbar>
    );

    // -> form is empty and no snackbar
    expect(getInputByName('trayId')).toHaveValue('');
    expect(getInputByName('site')).toHaveValue('LAX1_LAX1');
    expect(queryByTestId(dataTestIdsSnackbar.snackbar)).not.toBeInTheDocument();

    // -> fill up the form
    await actAndAwait(async () => fillNonPlugFormFields());

    // -> submit the form
    await actAndAwait(() => getByTestId(dataTestIds.submit).click());

    expect(queryByTestId(dataTestIdsSnackbar.snackbar)).toBeInTheDocument();
    expect(queryByTestId(dataTestIdsSnackbar.snackbar)).toHaveTextContent(
      'QA data has already been submitted for this tray. Please scan a new tray to continue.'
    );
    expect(getInputByName('trayId')).toHaveValue(MOCK_FORM_VALUES_EUPHRATES.trayId);
  }, 10000);
});

import { EVS_URLS } from '@plentyag/app-environment/src/common/utils';
import { mockUseSwrAxiosImpl as mockAutocompleteFdsObjcetUseSwrAxiosImpl } from '@plentyag/brand-ui/src/components/autocomplete-farm-def-object/test-helpers';
import { GlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar';
import {
  changeTextField,
  chooseFromAutocompleteByIndex,
  expectNoErrorOn,
  getInputByName,
  getSubmitButton,
  openAutocomplete,
} from '@plentyag/brand-ui/src/test-helpers';
import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { usePostRequest, usePutRequest, useSwrAxios } from '@plentyag/core/src/hooks';
import { mockUseFetchMeasurementTypes } from '@plentyag/core/src/hooks/use-fetch-measurement-types/test-helpers';
import { mockUseFetchObservationGroups } from '@plentyag/core/src/hooks/use-fetch-observation-groups/test-helpers';
import { actAndAwait, mockConsoleError } from '@plentyag/core/src/test-helpers';
import { getShortenedPath } from '@plentyag/core/src/utils';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { ButtonCreateMetric, dataTestIdsButtonCreateMetric as dataTestIds } from '.';

mockUseFetchObservationGroups();
mockUseFetchMeasurementTypes();

jest.mock('@plentyag/core/src/hooks/use-axios');
jest.mock('@plentyag/core/src/hooks/use-swr-axios');

const mockUsePostRequest = usePostRequest as jest.Mock;
const mockUsePutRequest = usePutRequest as jest.Mock;
const mockUseSwrAxios = useSwrAxios as jest.Mock;

const values = {
  path: 'sites/SSF2',
  measurementType: 'FLOW_RATE',
  observationName: 'CoolingCoilFlow',
  min: 0,
  max: 100,
};

const consoleError = mockConsoleError();

describe('ButtonCreateMetric', () => {
  beforeEach(() => {
    mockUsePostRequest.mockRestore();
    mockUsePutRequest.mockRestore();
    mockUseSwrAxios.mockRestore();
    consoleError.mockReset();
  });

  it('renders nothing when current user has insufficient permission', () => {
    mockCurrentUser();
    const { container } = render(<ButtonCreateMetric onSuccess={jest.fn()} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('opens a dialog to create a metric', async () => {
    const makeRequest = jest.fn().mockImplementation(({ onSuccess }) => onSuccess({ id: 'id' }));
    const onSuccess = jest.fn();
    mockUsePostRequest.mockReturnValue({ data: undefined, isLoading: false, makeRequest });
    mockUsePutRequest.mockReturnValue({ data: undefined, isLoading: false, makeRequest: jest.fn() });
    mockUseSwrAxios.mockImplementation(args => {
      if (!args || !args.url) {
        return { data: undefined, error: undefined, isValidating: false };
      }

      return mockAutocompleteFdsObjcetUseSwrAxiosImpl(args);
    });

    mockCurrentUser({ permissions: { HYP_ENVIRONMENT_V2: 'EDIT' } });

    const { queryByTestId } = render(
      <MemoryRouter>
        <GlobalSnackbar>
          <ButtonCreateMetric onSuccess={onSuccess} />
        </GlobalSnackbar>
      </MemoryRouter>
    );

    expect(queryByTestId(dataTestIds.button)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.dialog)).not.toBeInTheDocument();

    queryByTestId(dataTestIds.button).click();

    expect(queryByTestId(dataTestIds.dialog)).toBeInTheDocument();

    expect(getInputByName('path')).toHaveValue('');
    expect(getInputByName('measurementType')).toHaveValue('');
    expect(getInputByName('observationName')).toHaveValue('');
    expect(getInputByName('min')).toHaveValue('');
    expect(getInputByName('max')).toHaveValue('');

    expect(queryByTestId(getSubmitButton())).toBeInTheDocument();

    expect(getInputByName('measurementType')).toBeDisabled();
    expect(getInputByName('observationName')).toBeDisabled();
    expect(getInputByName('min')).toBeDisabled();
    expect(getInputByName('max')).toBeDisabled();

    // -> Choose a path
    await actAndAwait(() => openAutocomplete('path'));
    await actAndAwait(() => chooseFromAutocompleteByIndex(0));
    await actAndAwait(() => fireEvent.blur(getInputByName('path'))); // Trigger validation

    expect(getInputByName('measurementType')).not.toBeDisabled();

    // -> Choose a measurementType
    await actAndAwait(() => openAutocomplete('measurementType'));
    await actAndAwait(() => chooseFromAutocompleteByIndex(0));

    expect(getInputByName('observationName')).not.toBeDisabled();

    // -> Choose an ObservationName
    await actAndAwait(() => openAutocomplete('observationName'));
    await actAndAwait(() => chooseFromAutocompleteByIndex(0));

    // -> Choose min/max
    await actAndAwait(() => changeTextField('min', values.min));
    await actAndAwait(() => changeTextField('max', values.max));

    expect(getInputByName('path')).toHaveValue(getShortenedPath(values.path, true));
    expect(getInputByName('measurementType')).toHaveValue(values.measurementType);
    expect(getInputByName('observationName')).toHaveValue(values.observationName);
    expect(getInputByName('min')).toHaveValue(values.min.toString());
    expect(getInputByName('max')).toHaveValue(values.max.toString());

    expectNoErrorOn('path');
    expectNoErrorOn('measurementType');
    expectNoErrorOn('observationName');

    await actAndAwait(() => queryByTestId(getSubmitButton()).click());

    expect(makeRequest).toHaveBeenCalledWith({
      data: {
        createdBy: 'olittle',
        path: values.path,
        measurementType: values.measurementType,
        observationName: values.observationName,
        unitConfig: {
          min: values.min,
          max: values.max,
        },
      },
      url: EVS_URLS.metrics.createUrl(),
      onSuccess: expect.any(Function),
      onError: expect.any(Function),
    });
    expect(onSuccess).toHaveBeenCalled();
  }, 20000);

  it('shows an error message with a link when the metric already exists', async () => {
    const makeRequest = jest
      .fn()
      .mockImplementation(({ onError }) =>
        onError({ error: 'This Metric already exists. See Metric#14aafd47-2158-4841-8e6c-05e6ed718809' })
      );
    const onSuccess = jest.fn();
    mockUsePostRequest.mockReturnValue({ data: undefined, isLoading: false, makeRequest });
    mockUsePutRequest.mockReturnValue({ data: undefined, isLoading: false, makeRequest: jest.fn() });
    mockUseSwrAxios.mockImplementation(args => {
      if (!args || !args.url) {
        return { data: undefined, error: undefined, isValidating: false };
      }

      return mockAutocompleteFdsObjcetUseSwrAxiosImpl(args);
    });

    mockCurrentUser({ permissions: { HYP_ENVIRONMENT_V2: 'EDIT' } });

    const { queryByTestId } = render(
      <MemoryRouter>
        <GlobalSnackbar>
          <ButtonCreateMetric onSuccess={onSuccess} />
        </GlobalSnackbar>
      </MemoryRouter>
    );

    queryByTestId(dataTestIds.button).click();

    // -> Choose a path
    await actAndAwait(() => openAutocomplete('path'));
    await actAndAwait(() => chooseFromAutocompleteByIndex(0));
    await actAndAwait(() => fireEvent.blur(getInputByName('path'))); // Trigger validation

    // -> Choose a measurementType
    await actAndAwait(() => openAutocomplete('measurementType'));
    await actAndAwait(() => chooseFromAutocompleteByIndex(0));

    // -> Choose an ObservationName
    await actAndAwait(() => openAutocomplete('observationName'));
    await actAndAwait(() => chooseFromAutocompleteByIndex(0));

    // -> Choose min/max
    await actAndAwait(() => changeTextField('min', values.min));
    await actAndAwait(() => changeTextField('max', values.max));

    // -> Submit
    expect(queryByTestId(dataTestIds.linkToMetricPage)).not.toBeInTheDocument();

    await actAndAwait(() => queryByTestId(getSubmitButton()).click());

    expect(queryByTestId(dataTestIds.linkToMetricPage)).toBeInTheDocument();

    expect(consoleError).not.toHaveBeenCalled();
  });

  it('shows an error message and calls the default handler', async () => {
    const error = 'A generic error message';
    const makeRequest = jest.fn().mockImplementation(({ onError }) => onError({ error }));
    const onSuccess = jest.fn();
    mockUsePostRequest.mockReturnValue({ data: undefined, isLoading: false, makeRequest });
    mockUsePutRequest.mockReturnValue({ data: undefined, isLoading: false, makeRequest: jest.fn() });
    mockUseSwrAxios.mockImplementation(args => {
      if (!args || !args.url) {
        return { data: undefined, error: undefined, isValidating: false };
      }

      return mockAutocompleteFdsObjcetUseSwrAxiosImpl(args);
    });

    mockCurrentUser({ permissions: { HYP_ENVIRONMENT_V2: 'EDIT' } });

    const { queryByTestId } = render(
      <MemoryRouter>
        <GlobalSnackbar>
          <ButtonCreateMetric onSuccess={onSuccess} />
        </GlobalSnackbar>
      </MemoryRouter>
    );

    queryByTestId(dataTestIds.button).click();

    // -> Choose a path
    await actAndAwait(() => openAutocomplete('path'));
    await actAndAwait(() => chooseFromAutocompleteByIndex(0));
    await actAndAwait(() => fireEvent.blur(getInputByName('path'))); // Trigger validation

    // -> Choose a measurementType
    await actAndAwait(() => openAutocomplete('measurementType'));
    await actAndAwait(() => chooseFromAutocompleteByIndex(0));

    // -> Choose an ObservationName
    await actAndAwait(() => openAutocomplete('observationName'));
    await actAndAwait(() => chooseFromAutocompleteByIndex(0));

    // -> Choose min/max
    await actAndAwait(() => changeTextField('min', values.min));
    await actAndAwait(() => changeTextField('max', values.max));

    // -> Submit
    expect(queryByTestId(dataTestIds.linkToMetricPage)).not.toBeInTheDocument();

    await actAndAwait(() => queryByTestId(getSubmitButton()).click());

    expect(queryByTestId(dataTestIds.linkToMetricPage)).not.toBeInTheDocument();

    expect(consoleError).toHaveBeenCalledWith({ error });
  });
});

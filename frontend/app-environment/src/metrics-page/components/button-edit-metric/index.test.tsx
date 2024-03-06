import { mockMetrics } from '@plentyag/app-environment/src/common/test-helpers';
import { EVS_URLS } from '@plentyag/app-environment/src/common/utils';
import { dataTestIdsListboxHeader } from '@plentyag/brand-ui/src/components/autocomplete-farm-def-object/components/listbox-header';
import { mockUseSwrAxiosImpl as mockAutocompleteFdsObjcetUseSwrAxiosImpl } from '@plentyag/brand-ui/src/components/autocomplete-farm-def-object/test-helpers';
import { GlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar';
import {
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
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { mockObservationGroups } from '@plentyag/core/src/test-helpers/mocks';
import { getShortenedPath } from '@plentyag/core/src/utils';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { ButtonEditMetric, dataTestIdsButtonEditMetric as dataTestIds } from '.';

jest.mock('@plentyag/core/src/hooks/use-axios');
jest.mock('@plentyag/core/src/hooks/use-swr-axios');

mockUseFetchMeasurementTypes();
mockUseFetchObservationGroups();

const mockUsePostRequest = usePostRequest as jest.Mock;
const mockUsePutRequest = usePutRequest as jest.Mock;
const mockUseSwrAxios = useSwrAxios as jest.Mock;

const [, rawMetric] = mockMetrics;
const [observationGroup] = mockObservationGroups;
const metric = {
  ...rawMetric,
  path: observationGroup.path,
  measurementType: observationGroup.measurementType,
  observationName: observationGroup.observationName,
};

const newValues = {
  path: 'sites/SSF2/areas/VerticalGrow/lines/GrowRoom',
  measurementType: 'FLOW_RATE',
  observationName: 'CoolingCoilFlow',
};

describe('ButtonEditMetric', () => {
  beforeEach(() => {
    mockUsePostRequest.mockRestore();
    mockUsePutRequest.mockRestore();
    mockUseSwrAxios.mockRestore();
  });

  it('renders nothing when current user has insufficient permission', () => {
    mockCurrentUser();

    const { container } = render(<ButtonEditMetric onSuccess={jest.fn()} metric={metric} disabled={false} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('opens a dialog to update a metric', async () => {
    const makeRequest = jest.fn().mockImplementation(({ onSuccess }) => onSuccess({ id: 'id' }));
    const onSuccess = jest.fn();
    mockUsePostRequest.mockReturnValue({ data: undefined, isLoading: false, makeRequest: jest.fn() });
    mockUsePutRequest.mockReturnValue({ data: undefined, isLoading: false, makeRequest });
    mockUseSwrAxios.mockImplementation(args => {
      if (!args || !args.url) {
        return { data: undefined, error: undefined, isValidating: false };
      }

      return mockAutocompleteFdsObjcetUseSwrAxiosImpl(args);
    });

    mockCurrentUser({ permissions: { HYP_ENVIRONMENT_V2: 'FULL' } });

    const { queryByTestId } = render(
      <MemoryRouter>
        <GlobalSnackbar>
          <ButtonEditMetric onSuccess={onSuccess} metric={metric} disabled={false} />
        </GlobalSnackbar>
      </MemoryRouter>
    );

    expect(queryByTestId(dataTestIds.button)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.dialog)).not.toBeInTheDocument();

    await actAndAwait(() => queryByTestId(dataTestIds.button).click());

    expect(queryByTestId(dataTestIds.dialog)).toBeInTheDocument();

    expect(getInputByName('path')).toHaveValue(getShortenedPath(metric.path, true));
    expect(getInputByName('measurementType')).toHaveValue(metric.measurementType);
    expect(getInputByName('observationName')).toHaveValue(metric.observationName);
    expect(queryByTestId(getSubmitButton())).toBeInTheDocument();

    // -> Modify path, measurementType and observationName
    await actAndAwait(() => openAutocomplete('path'));
    await actAndAwait(() => queryByTestId(dataTestIdsListboxHeader.backButton).click());
    await actAndAwait(() => fireEvent.blur(getInputByName('path'))); // Trigger validation
    await actAndAwait(() => openAutocomplete('measurementType'));
    await actAndAwait(() => chooseFromAutocompleteByIndex(0));
    await actAndAwait(() => openAutocomplete('observationName'));
    await actAndAwait(() => chooseFromAutocompleteByIndex(0));

    expect(getInputByName('path')).toHaveValue(getShortenedPath(newValues.path, true));
    expect(getInputByName('measurementType')).toHaveValue(newValues.measurementType);
    expect(getInputByName('observationName')).toHaveValue(newValues.observationName);

    expectNoErrorOn('path');
    expectNoErrorOn('measurementType');
    expectNoErrorOn('observationName');

    await actAndAwait(() => queryByTestId(getSubmitButton()).click());

    expect(makeRequest).toHaveBeenCalledWith({
      data: expect.objectContaining({
        ...metric,
        updatedBy: 'olittle',
        path: newValues.path,
        measurementType: newValues.measurementType,
        observationName: newValues.observationName,
      }),
      url: EVS_URLS.metrics.updateUrl(metric.id),
      onSuccess: expect.any(Function),
      onError: expect.any(Function),
    });
    expect(onSuccess).toHaveBeenCalled();
  }, 20000);
});

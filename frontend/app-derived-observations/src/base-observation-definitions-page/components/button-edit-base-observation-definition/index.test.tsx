import { mockBaseObservationDefinitions } from '@plentyag/app-derived-observations/src/common/test-helpers';
import { mockUseSwrAxiosImpl as mockAutocompleteFdsObjectUseSwrAxiosImpl } from '@plentyag/brand-ui/src/components/autocomplete-farm-def-object/test-helpers';
import { GlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar';
import {
  changeTextField,
  chooseFromAutocompleteByIndex,
  getInputByName,
  getSubmitButton,
  openAutocomplete,
} from '@plentyag/brand-ui/src/test-helpers';
import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { usePostRequest, usePutRequest, useSwrAxios } from '@plentyag/core/src/hooks';
import { mockUseFetchObservationGroups } from '@plentyag/core/src/hooks/use-fetch-observation-groups/test-helpers';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { ButtonEditBaseObservationDefinition, dataTestIdsButtonEditBaseObservationDefinition as dataTestIds } from '.';

const [definition] = mockBaseObservationDefinitions;

mockUseFetchObservationGroups();

jest.mock('@plentyag/core/src/hooks/use-axios');
jest.mock('@plentyag/core/src/hooks/use-swr-axios');

const mockUsePostRequest = usePostRequest as jest.Mock;
const mockUsePutRequest = usePutRequest as jest.Mock;
const mockUseSwrAxios = useSwrAxios as jest.Mock;
const onSuccess = jest.fn();

const values = {
  streamName: 'AirTemperatureMean5Minutes',
  path: 'sites/SSF2',
  observationName: 'CoolingCoilFlow',
};

describe('ButtonEditBaseObservationDefinition', () => {
  beforeEach(() => {
    mockUsePostRequest.mockRestore();
    mockUsePutRequest.mockRestore();
    mockUseSwrAxios.mockRestore();
    onSuccess.mockRestore();
  });

  it('renders nothing when current user has insufficient permission', () => {
    mockCurrentUser({ permissions: { HYP_DERIVED_OBSERVATIONS: 'EDIT' } });
    mockUseSwrAxios.mockReturnValue({ data: undefined, isValidating: false });

    const { container } = render(
      <ButtonEditBaseObservationDefinition definition={definition} onSuccess={onSuccess} disabled={false} />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('opens a dialog to edit a BaseObservationDefinition', async () => {
    mockCurrentUser({ permissions: { HYP_DERIVED_OBSERVATIONS: 'FULL' } });
    const makeRequest = jest.fn().mockImplementation(({ onSuccess }) => onSuccess({ id: 'id' }));
    mockUsePostRequest.mockReturnValue({ data: undefined, isLoading: false, makeRequest: jest.fn() });
    mockUsePutRequest.mockReturnValue({ data: undefined, isLoading: false, makeRequest });
    mockUseSwrAxios.mockImplementation(args => {
      if (!args || !args.url) {
        return { data: undefined, error: undefined, isValidating: false };
      }

      return mockAutocompleteFdsObjectUseSwrAxiosImpl(args);
    });

    const { queryByTestId } = render(
      <MemoryRouter>
        <GlobalSnackbar>
          <ButtonEditBaseObservationDefinition definition={definition} onSuccess={onSuccess} disabled={false} />
        </GlobalSnackbar>
      </MemoryRouter>
    );

    // -> Dialog is not visible
    expect(queryByTestId(dataTestIds.button)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.dialog)).not.toBeInTheDocument();

    await actAndAwait(() => queryByTestId(dataTestIds.button).click());

    expect(queryByTestId(dataTestIds.dialog)).toBeInTheDocument();

    // -> Form is populated
    expect(getInputByName('streamName')).toHaveValue(definition.streamName);
    expect(getInputByName('path')).toHaveValue(definition.observationKey.path);
    expect(getInputByName('measurementType')).toHaveValue('VOLUME');
    expect(getInputByName('observationName')).toHaveValue(definition.observationKey.observationName);
    expect(getInputByName('window')).toHaveValue(definition.window);
    expect(getInputByName('output')).toHaveValue(definition.output);
    expect(getInputByName('aggregation')).toHaveValue(definition.aggregation);
    expect(getInputByName('comment')).toHaveValue(definition.comment);

    // -> Choose a different streamName
    await actAndAwait(() => changeTextField('streamName', values.streamName));

    // -> Choose a different path
    await actAndAwait(() => openAutocomplete('path'));
    await actAndAwait(() => chooseFromAutocompleteByIndex(0));
    await actAndAwait(() => fireEvent.blur(getInputByName('path'))); // Trigger validation

    // -> Choose a different measurementType
    await actAndAwait(() => openAutocomplete('measurementType'));
    await actAndAwait(() => chooseFromAutocompleteByIndex(0));

    // -> Choose a different observationName
    await actAndAwait(() => openAutocomplete('observationName'));
    await actAndAwait(() => chooseFromAutocompleteByIndex(0));

    // -> Re-submit
    await actAndAwait(() => queryByTestId(getSubmitButton()).click());

    expect(makeRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          ...definition,
          updatedBy: 'olittle',
          streamName: values.streamName,
          observationKey: {
            path: values.path,
            observationName: values.observationName,
          },
        },
        url: `/api/swagger/environment-service/derived-observation-definitions-api/update-base-observation-definition/${definition.id}`,
      })
    );
    expect(onSuccess).toHaveBeenCalled();
  });
});

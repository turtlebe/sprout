import {
  mockBaseObservationDefinitions,
  mockDerivedObservationDefinitions,
} from '@plentyag/app-derived-observations/src/common/test-helpers';
import { mockUseSwrAxiosImpl as mockAutocompleteFdsObjectUseSwrAxiosImpl } from '@plentyag/brand-ui/src/components/autocomplete-farm-def-object/test-helpers';
import { GlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar';
import {
  changeTextField,
  chooseFromAutocompleteByIndex,
  getFormGenFieldElementByName,
  getInputByName,
  getSubmitButton,
  openAutocomplete,
} from '@plentyag/brand-ui/src/test-helpers';
import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { mockMeasurementTypes } from '@plentyag/core/src/farm-def/test-helpers';
import { useGetRequest, usePostRequest, usePutRequest, useSwrAxios } from '@plentyag/core/src/hooks';
import { mockUseFetchMeasurementTypes } from '@plentyag/core/src/hooks/use-fetch-measurement-types/test-helpers';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { getShortenedPath } from '@plentyag/core/src/utils';
import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { titleCase } from 'voca';

const mockObservationDefinitions = [...mockBaseObservationDefinitions, ...mockDerivedObservationDefinitions];
const [definition] = mockDerivedObservationDefinitions;

import {
  ButtonEditDerivedObservationDefinition,
  dataTestIdsButtonEditDerivedObservationDefinition as dataTestIds,
} from '.';

mockUseFetchMeasurementTypes();

jest.mock('@plentyag/core/src/hooks/use-axios');
jest.mock('@plentyag/core/src/hooks/use-swr-axios');

const mockUsePostRequest = usePostRequest as jest.Mock;
const mockUsePutRequest = usePutRequest as jest.Mock;
const mockUseGetRequest = useGetRequest as jest.Mock;
const mockUseSwrAxios = useSwrAxios as jest.Mock;
const onSuccess = jest.fn();

const values = {
  streamName: 'AirTemperatureMean5Minutes',
  sourceStreamNames: ['SSF2Nutrien3SupplyTankVolumeAvg5Min', 'LAR1NorthBuildingGP16SupplyOutletPressureAvg5Min'],
  expression: 'foobar',
};

describe('ButtonEditDerivedObservationDefinition', () => {
  beforeEach(() => {
    mockUsePostRequest.mockRestore();
    mockUsePutRequest.mockRestore();
    mockUseGetRequest.mockRestore();
    mockUseSwrAxios.mockRestore();
    onSuccess.mockRestore();
  });

  it('renders nothing when current user has insufficient permission', () => {
    mockCurrentUser({ permissions: { HYP_DERIVED_OBSERVATIONS: 'EDIT' } });
    mockUseSwrAxios.mockReturnValue({ data: undefined, isValidating: false });

    const { container } = render(
      <ButtonEditDerivedObservationDefinition onSuccess={onSuccess} definition={definition} disabled={false} />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('opens a dialog to edit a DerivedObservationDefinition', async () => {
    mockCurrentUser({ permissions: { HYP_DERIVED_OBSERVATIONS: 'FULL' } });
    const makeRequest = jest.fn().mockImplementation(({ onSuccess }) => onSuccess({ id: 'id' }));
    mockUsePostRequest.mockReturnValue({ data: undefined, isLoading: false, makeRequest: jest.fn() });
    mockUsePutRequest.mockReturnValue({ data: undefined, isLoading: false, makeRequest });
    mockUseGetRequest.mockReturnValue({ data: undefined, isLoading: false, makeRequest: jest.fn() });
    mockUseSwrAxios.mockImplementation(args => {
      if (!args || !args.url) {
        return { data: undefined, error: undefined, isValidating: false };
      }

      if (args.url.includes('observation-definitions')) {
        return { data: mockObservationDefinitions, isValidating: false };
      }

      if (args.url.includes('search-measurement-types')) {
        return { data: mockMeasurementTypes, isValidating: false };
      }

      return mockAutocompleteFdsObjectUseSwrAxiosImpl(args);
    });

    const { queryByTestId } = render(
      <MemoryRouter>
        <GlobalSnackbar>
          <ButtonEditDerivedObservationDefinition onSuccess={onSuccess} definition={definition} disabled={false} />
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
    expect(getInputByName('window')).toHaveValue(definition.window);
    expect(getFormGenFieldElementByName('previousSourceStreamNames')).toHaveTextContent(
      definition.sourceStreamNames.join(',')
    );
    expect(getInputByName('expression')).toHaveValue(definition.expression);
    expect(getInputByName('output')).toHaveValue(definition.output);
    expect(getInputByName('path')).toHaveValue(getShortenedPath(definition.observationKey.path, true));
    expect(getInputByName('observationName')).toHaveValue(definition.observationKey.observationName);
    expect(getInputByName('outputMeasurementType')).toHaveValue(titleCase(definition.outputMeasurementType));
    expect(getInputByName('outputMeasurementTypeUnits')).toHaveValue(definition.outputMeasurementTypeUnits);

    // -> Choose a different streamName
    await actAndAwait(() => changeTextField('streamName', values.streamName));

    // -> Choose different sourceStreamNames
    await actAndAwait(() => openAutocomplete('sourceStreamNames'));
    await actAndAwait(() => chooseFromAutocompleteByIndex(0));
    await actAndAwait(() => openAutocomplete('sourceStreamNames'));
    await actAndAwait(() => chooseFromAutocompleteByIndex(1));

    // -> Choose a different expression
    await actAndAwait(() => changeTextField('expression', values.expression));

    // -> Re-submit
    await actAndAwait(() => queryByTestId(getSubmitButton()).click());

    expect(makeRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          ...definition,
          updatedBy: 'olittle',
          streamName: values.streamName,
          sourceStreamNames: values.sourceStreamNames,
          expression: values.expression,
        },
        url: `/api/swagger/environment-service/derived-observation-definitions-api/update-derived-observation-definition/${definition.id}`,
      })
    );
    expect(onSuccess).toHaveBeenCalled();
  });
});

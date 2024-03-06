import { mockUseSwrAxiosImpl as mockAutocompleteFdsObjectUseSwrAxiosImpl } from '@plentyag/brand-ui/src/components/autocomplete-farm-def-object/test-helpers';
import { GlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar';
import {
  changeTextField,
  chooseFromAutocompleteByIndex,
  chooseFromSelect,
  expectErrorOn,
  expectNoErrorOn,
  getInputByName,
  getSubmitButton,
  openAutocomplete,
  openSelect,
} from '@plentyag/brand-ui/src/test-helpers';
import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { usePostRequest, usePutRequest, useSwrAxios } from '@plentyag/core/src/hooks';
import { mockUseFetchObservationGroups } from '@plentyag/core/src/hooks/use-fetch-observation-groups/test-helpers';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { Aggregation, Output, WindowDuration } from '@plentyag/core/src/types/derived-observations';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import {
  ButtonCreateBaseObservationDefinition,
  dataTestIdsButtonCreateBaseObservationDefinition as dataTestIds,
} from '.';

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
  window: WindowDuration.fiveMinutes,
  output: Output.double,
  aggregation: Aggregation.mean,
  comment: 'comment',
};

describe('ButtonCreateBaseObservationDefinition', () => {
  beforeEach(() => {
    mockUsePostRequest.mockRestore();
    mockUsePutRequest.mockRestore();
    mockUseSwrAxios.mockRestore();
    onSuccess.mockRestore();
  });

  it('renders nothing when current user has insufficient permission', () => {
    mockCurrentUser();
    mockUseSwrAxios.mockReturnValue({ data: undefined, isValidating: false });

    const { container } = render(<ButtonCreateBaseObservationDefinition onSuccess={onSuccess} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('opens a dialog to create a BaseObservationDefinition', async () => {
    mockCurrentUser({ permissions: { HYP_DERIVED_OBSERVATIONS: 'EDIT' } });
    const makeRequest = jest.fn().mockImplementation(({ onSuccess }) => onSuccess({ id: 'id' }));
    mockUsePostRequest.mockReturnValue({ data: undefined, isLoading: false, makeRequest });
    mockUsePutRequest.mockReturnValue({ data: undefined, isLoading: false, makeRequest: jest.fn() });
    mockUseSwrAxios.mockImplementation(args => {
      if (!args || !args.url) {
        return { data: undefined, error: undefined, isValidating: false };
      }

      return mockAutocompleteFdsObjectUseSwrAxiosImpl(args);
    });

    const { queryByTestId } = render(
      <MemoryRouter>
        <GlobalSnackbar>
          <ButtonCreateBaseObservationDefinition onSuccess={onSuccess} />
        </GlobalSnackbar>
      </MemoryRouter>
    );

    // -> Dialog is not visible
    expect(queryByTestId(dataTestIds.button)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.dialog)).not.toBeInTheDocument();

    queryByTestId(dataTestIds.button).click();

    expect(queryByTestId(dataTestIds.dialog)).toBeInTheDocument();

    // -> Form is empty
    expect(getInputByName('streamName')).toHaveValue('');
    expect(getInputByName('path')).toHaveValue('');
    expect(getInputByName('observationName')).toHaveValue('');
    expect(getInputByName('window')).toHaveValue('');
    expect(getInputByName('output')).toHaveValue('');
    expect(getInputByName('aggregation')).toHaveValue('');
    expect(getInputByName('comment')).toHaveValue('');

    // -> Try to validate and trigger validations
    await actAndAwait(() => queryByTestId(getSubmitButton()).click());

    expectErrorOn('streamName');
    expectErrorOn('path');
    expectErrorOn('observationName');
    expectErrorOn('window');
    expectErrorOn('output');
    expectErrorOn('aggregation');
    expectNoErrorOn('comment');

    // -> Choose a streamName
    await actAndAwait(() => changeTextField('streamName', values.streamName));

    // -> Choose a path
    await actAndAwait(() => openAutocomplete('path'));
    await actAndAwait(() => chooseFromAutocompleteByIndex(0));
    await actAndAwait(() => fireEvent.blur(getInputByName('path'))); // Trigger validation

    // -> Choose a measurementType
    await actAndAwait(() => openAutocomplete('measurementType'));
    await actAndAwait(() => chooseFromAutocompleteByIndex(0));

    // -> Choose an observationName
    await actAndAwait(() => openAutocomplete('observationName'));
    await actAndAwait(() => chooseFromAutocompleteByIndex(0));

    // -> Choose a window duration
    await actAndAwait(() => openSelect('window'));
    await actAndAwait(() => chooseFromSelect(values.window));

    // -> Choose an ouput
    await actAndAwait(() => openSelect('output'));
    await actAndAwait(() => chooseFromSelect(values.output));

    // -> Choose an aggregation
    await actAndAwait(() => openSelect('aggregation'));
    await actAndAwait(() => chooseFromSelect(values.aggregation));

    // -> Enter a commment
    await actAndAwait(() => changeTextField('comment', values.comment));

    expectNoErrorOn('streamName');
    expectNoErrorOn('path');
    expectNoErrorOn('observationName');
    expectNoErrorOn('window');
    expectNoErrorOn('output');
    expectNoErrorOn('aggregation');
    expectNoErrorOn('comment');

    // -> Re-submit
    await actAndAwait(() => queryByTestId(getSubmitButton()).click());

    expect(makeRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          createdBy: 'olittle',
          streamName: values.streamName,
          observationKey: {
            path: values.path,
            observationName: values.observationName,
          },
          window: values.window,
          output: values.output,
          aggregation: values.aggregation,
          comment: values.comment,
        },
        url: '/api/swagger/environment-service/derived-observation-definitions-api/create-base-observation-definition',
      })
    );
    expect(onSuccess).toHaveBeenCalled();
  });

  it('opens a dialog to create an Uptime BaseObservationDefinition', async () => {
    const uptimeValues = {
      ...values,
      aggregation: Aggregation.uptime,
      uptimeRuleId: '22b4777a-b7ff-4d81-8d4d-5cbcd5189427',
    };
    mockCurrentUser({ permissions: { HYP_DERIVED_OBSERVATIONS: 'EDIT' } });
    const makeRequest = jest.fn().mockImplementation(({ onSuccess }) => onSuccess({ id: 'id' }));
    mockUsePostRequest.mockReturnValue({ data: undefined, isLoading: false, makeRequest });
    mockUsePutRequest.mockReturnValue({ data: undefined, isLoading: false, makeRequest: jest.fn() });
    mockUseSwrAxios.mockImplementation(args => {
      if (!args || !args.url) {
        return { data: undefined, error: undefined, isValidating: false };
      }

      return mockAutocompleteFdsObjectUseSwrAxiosImpl(args);
    });

    const { queryByTestId } = render(
      <MemoryRouter>
        <GlobalSnackbar>
          <ButtonCreateBaseObservationDefinition onSuccess={onSuccess} />
        </GlobalSnackbar>
      </MemoryRouter>
    );

    // -> Open the modal
    queryByTestId(dataTestIds.button).click();

    // -> Choose a streamName
    await actAndAwait(() => changeTextField('streamName', uptimeValues.streamName));

    // -> Choose a path
    await actAndAwait(() => openAutocomplete('path'));
    await actAndAwait(() => chooseFromAutocompleteByIndex(0));
    await actAndAwait(() => fireEvent.blur(getInputByName('path'))); // Trigger validation

    // -> Choose a measurementType
    await actAndAwait(() => openAutocomplete('measurementType'));
    await actAndAwait(() => chooseFromAutocompleteByIndex(0));

    // -> Choose an observationName
    await actAndAwait(() => openAutocomplete('observationName'));
    await actAndAwait(() => chooseFromAutocompleteByIndex(0));

    // -> Choose a window duration
    await actAndAwait(() => openSelect('window'));
    await actAndAwait(() => chooseFromSelect(uptimeValues.window));

    // -> Choose an ouput
    await actAndAwait(() => openSelect('output'));
    await actAndAwait(() => chooseFromSelect(uptimeValues.output));

    // -> Choose the Uptime aggregation
    await actAndAwait(() => openSelect('aggregation'));
    await actAndAwait(() => chooseFromSelect(uptimeValues.aggregation));

    // -> Enter a commment
    await actAndAwait(() => changeTextField('comment', uptimeValues.comment));

    // -> Enter an AlertRuleId
    await actAndAwait(() => changeTextField('uptimeRuleId', uptimeValues.uptimeRuleId));

    // -> Submit
    await actAndAwait(() => queryByTestId(getSubmitButton()).click());

    expect(makeRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          createdBy: 'olittle',
          streamName: uptimeValues.streamName,
          observationKey: {
            path: uptimeValues.path,
            observationName: uptimeValues.observationName,
          },
          window: uptimeValues.window,
          output: uptimeValues.output,
          aggregation: uptimeValues.aggregation,
          comment: uptimeValues.comment,
          uptimeRuleId: uptimeValues.uptimeRuleId,
        },
        url: '/api/swagger/environment-service/derived-observation-definitions-api/create-base-observation-definition',
      })
    );
    expect(onSuccess).toHaveBeenCalled();
  });
});

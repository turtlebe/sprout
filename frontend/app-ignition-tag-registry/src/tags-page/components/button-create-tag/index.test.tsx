import { mockTagPaths, mockTagProviders } from '@plentyag/app-ignition-tag-registry/src/common/test-helpers';
import { mockUseSwrAxiosImpl as mockAutocompleteFdsObjectUseSwrAxiosImpl } from '@plentyag/brand-ui/src/components/autocomplete-farm-def-object/test-helpers';
import { GlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar';
import {
  changeTextField,
  chooseFromAutocomplete,
  chooseFromAutocompleteByIndex,
  chooseFromSelectByIndex,
  expectNoErrorOn,
  getInputByName,
  getSubmitButton,
  openAutocomplete,
  openSelect,
} from '@plentyag/brand-ui/src/test-helpers';
import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { mockMeasurementTypes } from '@plentyag/core/src/farm-def/test-helpers';
import { usePostRequest, usePutRequest, useSwrAxios } from '@plentyag/core/src/hooks';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { ButtonCreateTag, dataTestIdsButtonCreateTag as dataTestIds } from '.';

jest.mock('@plentyag/core/src/hooks/use-axios');
jest.mock('@plentyag/core/src/hooks/use-swr-axios');

const mockUsePostRequest = usePostRequest as jest.Mock;
const mockUsePutRequest = usePutRequest as jest.Mock;
const mockUseSwrAxios = useSwrAxios as jest.Mock;

describe('ButtonCreateTag', () => {
  beforeEach(() => {
    mockUsePostRequest.mockRestore();
    mockUsePutRequest.mockRestore();
    mockUseSwrAxios.mockRestore();
  });

  it('renders nothing when current user has insufficient permission', () => {
    mockCurrentUser();
    mockUseSwrAxios.mockReturnValue({ data: mockTagProviders, isValidating: false });

    const { container } = render(<ButtonCreateTag onSuccess={jest.fn()} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('opens a dialog to create a tag', async () => {
    const makeRequest = jest.fn().mockImplementation(({ onSuccess }) => onSuccess());
    const onSuccess = jest.fn();
    mockUsePostRequest.mockReturnValue({ data: undefined, isLoading: false, makeRequest });
    mockUsePutRequest.mockReturnValue({ data: undefined, isLoading: false, makeRequest: jest.fn() });
    mockUseSwrAxios.mockImplementation(args => {
      if (!args || !args.url) {
        return { data: undefined, error: undefined, isValidating: false };
      }

      if (args.url.includes('search-measurement-types')) {
        return { data: mockMeasurementTypes, isValidating: false };
      } else if (args.url.includes('providers')) {
        return { data: mockTagProviders, isValidating: false };
      } else if (args.url.includes('tag-paths')) {
        return { data: mockTagPaths, isValidating: false };
      }

      return mockAutocompleteFdsObjectUseSwrAxiosImpl(args);
    });

    mockCurrentUser({ permissions: { HYP_IGNITION_TAG_REGISTRY: 'EDIT' } });

    const { queryByTestId } = render(
      <MemoryRouter>
        <GlobalSnackbar>
          <ButtonCreateTag onSuccess={onSuccess} />
        </GlobalSnackbar>
      </MemoryRouter>
    );

    expect(queryByTestId(dataTestIds.button)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.dialog)).not.toBeInTheDocument();

    queryByTestId(dataTestIds.button).click();

    expect(queryByTestId(dataTestIds.dialog)).toBeInTheDocument();

    expect(getInputByName('path')).toHaveValue('');
    expect(getInputByName('tagProvider')).toHaveValue('');
    expect(getInputByName('tagPath')).toHaveValue('');
    expect(getInputByName('measurementType')).toHaveValue('');
    expect(getInputByName('measurementUnit')).toHaveValue('');
    expect(getInputByName('measurementName')).toHaveValue('');

    expect(queryByTestId(getSubmitButton())).toBeInTheDocument();

    await actAndAwait(() => openAutocomplete('path'));
    await actAndAwait(() => chooseFromAutocompleteByIndex(1)); // Choose Site: SSF2
    await actAndAwait(() => chooseFromAutocompleteByIndex(0)); // Choose Area: Seeding
    await actAndAwait(() => chooseFromAutocompleteByIndex(0)); // Choose Line: TraySeeding
    await actAndAwait(() => fireEvent.blur(getInputByName('path'))); // Trigger validation
    await actAndAwait(() => openSelect('tagProvider'));
    await actAndAwait(() => chooseFromSelectByIndex(0));
    await actAndAwait(() => openAutocomplete('tagPath'));
    await actAndAwait(() => chooseFromAutocompleteByIndex(0));
    await actAndAwait(() => openAutocomplete('measurementType'));
    await actAndAwait(() => chooseFromAutocomplete('Electrical conductivity'));
    await actAndAwait(() => openSelect('measurementUnit'));
    await actAndAwait(() => chooseFromSelectByIndex(0));
    await actAndAwait(() => changeTextField('measurementName', 'TestMeasurement'));

    expect(getInputByName('path')).toHaveValue('SSF2/Seeding/TraySeeding/');
    expect(getInputByName('tagProvider')).toHaveValue('alpha seeder');
    expect(getInputByName('tagPath')).toHaveValue('crane/crane/actposition');
    expect(getInputByName('measurementType')).toHaveValue('Electrical conductivity');
    expect(getInputByName('measurementUnit')).toHaveValue('MSIEMENS_PER_CM');
    expect(getInputByName('measurementName')).toHaveValue('TestMeasurement');

    expectNoErrorOn('path');
    expectNoErrorOn('tagProvider');
    expectNoErrorOn('tagPath');
    expectNoErrorOn('measurementType');
    expectNoErrorOn('measurementUnit');
    expectNoErrorOn('measurementName');

    await actAndAwait(() => queryByTestId(getSubmitButton()).click());

    expect(makeRequest).toHaveBeenCalledWith({
      data: {
        createdBy: 'olittle',
        deviceType: '',
        measurementName: 'TestMeasurement',
        measurementType: 'ELECTRICAL_CONDUCTIVITY',
        measurementUnit: 'MSIEMENS_PER_CM',
        path: 'sites/SSF2/areas/Seeding/lines/TraySeeding',
        tagPath: 'crane/crane/actposition',
        tagProvider: 'alpha seeder',
      },
      url: '/api/swagger/farm-def-service/tags-api/create-tag',
      onSuccess: expect.any(Function),
      onError: expect.any(Function),
    });
    expect(onSuccess).toHaveBeenCalled();
  });
});

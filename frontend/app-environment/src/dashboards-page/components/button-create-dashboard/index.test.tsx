import '@plentyag/core/src/yup/extension';
import { EVS_URLS } from '@plentyag/app-environment/src/common/utils';
import { GlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar';
import { metrics } from '@plentyag/brand-ui/src/components/metrics-selector/test-helpers';
import {
  changeTextField,
  expectErrorOn,
  expectNoErrorOn,
  getInputByName,
  getSubmitButton,
} from '@plentyag/brand-ui/src/test-helpers';
import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { usePostRequest, usePutRequest, useSwrAxios } from '@plentyag/core/src/hooks';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { ButtonCreateDashboard, dataTestIdsButtonCreateDashboard as dataTestIds } from '.';

jest.mock('@plentyag/core/src/hooks/use-axios');
jest.mock('@plentyag/core/src/hooks/use-swr-axios');

const mockUsePostRequest = usePostRequest as jest.Mock;
const mockUsePutRequest = usePutRequest as jest.Mock;
const mockUseSwrAxios = useSwrAxios as jest.Mock;

const values = {
  name: 'Dashboard Name',
  metricIds: [metrics[0].id],
};

describe('ButtonCreateDashboard', () => {
  beforeEach(() => {
    mockUsePutRequest.mockRestore();
    mockUseSwrAxios.mockRestore();
    mockUseSwrAxios.mockRestore();
  });

  it('renders nothing when current user has insufficient permission', () => {
    mockCurrentUser();

    const { container } = render(<ButtonCreateDashboard onSuccess={jest.fn()} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('opens a dialog to create a Dashboard', async () => {
    const makeRequest = jest.fn().mockImplementation(({ onSuccess }) => onSuccess({}, {}));
    const onSuccess = jest.fn();
    mockUsePostRequest.mockReturnValue({ data: undefined, isLoading: false, makeRequest });
    mockUsePutRequest.mockReturnValue({ data: undefined, isLoading: false, makeRequest: jest.fn() });
    mockUseSwrAxios.mockReturnValue({ data: undefined, error: undefined, isValidating: false });

    mockCurrentUser({ permissions: { HYP_ENVIRONMENT_V2: 'EDIT' } });

    const { queryByTestId } = render(
      <MemoryRouter>
        <GlobalSnackbar>
          <ButtonCreateDashboard onSuccess={onSuccess} />
        </GlobalSnackbar>
      </MemoryRouter>
    );

    expect(queryByTestId(dataTestIds.button)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.dialog)).not.toBeInTheDocument();

    await actAndAwait(() => queryByTestId(dataTestIds.button).click());

    expect(queryByTestId(dataTestIds.dialog)).toBeInTheDocument();

    // -> Initial Values
    expect(getInputByName('name')).toHaveValue('');

    // -> Submit the form
    await actAndAwait(() => queryByTestId(getSubmitButton()).click());

    // -> Validations
    expectErrorOn('name');

    // -> Fill the form
    await actAndAwait(() => changeTextField('name', values.name));

    // -> No Errors
    expectNoErrorOn('name');

    // -> Submit the form
    await actAndAwait(() => queryByTestId(getSubmitButton()).click());

    expect(makeRequest).toHaveBeenCalledWith({
      data: {
        name: values.name,
        createdBy: 'olittle',
      },
      url: EVS_URLS.dashboards.createUrl(),
      onSuccess: expect.any(Function),
      onError: expect.any(Function),
    });
    expect(onSuccess).toHaveBeenCalled();
  }, 10000);
});

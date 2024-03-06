import '@plentyag/core/src/yup/extension';
import { mockDashboards } from '@plentyag/app-environment/src/common/test-helpers';
import { EVS_URLS } from '@plentyag/app-environment/src/common/utils';
import { GlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar';
import { changeTextField, getInputByName, getSubmitButton } from '@plentyag/brand-ui/src/test-helpers';
import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { usePostRequest, usePutRequest, useSwrAxios } from '@plentyag/core/src/hooks';
import { mockUseFetchObservationGroups } from '@plentyag/core/src/hooks/use-fetch-observation-groups/test-helpers';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { ButtonEditDashboard, dataTestIdsButtonEditDashboard as dataTestIds } from '.';

jest.mock('@plentyag/core/src/hooks/use-axios');
jest.mock('@plentyag/core/src/hooks/use-swr-axios');

const mockUsePostRequest = usePostRequest as jest.Mock;
const mockUsePutRequest = usePutRequest as jest.Mock;
const mockUseSwrAxios = useSwrAxios as jest.Mock;
const onSuccess = jest.fn();

const [dashboard] = mockDashboards;
const newValues = {
  name: 'New Dashboard Name',
};

mockUseFetchObservationGroups();

describe('ButtonEditDashboard', () => {
  beforeEach(() => {
    mockUsePostRequest.mockRestore();
    mockUsePutRequest.mockRestore();
    mockUseSwrAxios.mockRestore();
  });

  it('renders nothing when current user has insufficient permission', () => {
    mockCurrentUser();

    const { container } = render(<ButtonEditDashboard onSuccess={onSuccess} dashboard={dashboard} disabled={false} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('opens a dialog to update a Dashboard', async () => {
    const makeRequest = jest.fn().mockImplementation(({ onSuccess }) => onSuccess({}, {}));
    mockUsePostRequest.mockReturnValue({ data: undefined, isLoading: false, makeRequest: jest.fn() });
    mockUsePutRequest.mockReturnValue({ data: undefined, isLoading: false, makeRequest });
    mockUseSwrAxios.mockReturnValue({ data: undefined, error: undefined, isValidating: false });

    mockCurrentUser({ permissions: { HYP_ENVIRONMENT_V2: 'FULL' } });

    const { queryByTestId } = render(
      <MemoryRouter>
        <GlobalSnackbar>
          <ButtonEditDashboard onSuccess={onSuccess} dashboard={dashboard} disabled={false} />
        </GlobalSnackbar>
      </MemoryRouter>
    );

    // -> Dialog is not visible
    expect(queryByTestId(dataTestIds.button)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.dialog)).not.toBeInTheDocument();

    // -> Click on Edit
    await actAndAwait(() => queryByTestId(dataTestIds.button).click());

    // -> Dialog is visible
    expect(queryByTestId(dataTestIds.dialog)).toBeInTheDocument();

    // -> Initial Values
    expect(getInputByName('name')).toHaveValue(dashboard.name);

    // -> Update the form
    await actAndAwait(() => changeTextField('name', newValues.name));

    // -> Update the Dashboard
    await actAndAwait(() => queryByTestId(getSubmitButton()).click());

    expect(makeRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          name: newValues.name,
          updatedBy: 'olittle',
        }),
        url: EVS_URLS.dashboards.updateUrl(dashboard),
      })
    );
    expect(onSuccess).toHaveBeenCalled();
  });
});

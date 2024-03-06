import { mockPerceptionDeloymentObservationList } from '@plentyag/app-perception/src/common/test-helpers/mocks';
import { useGetObservations } from '@plentyag/core/src/hooks';
import { buildPaginatedResponse } from '@plentyag/core/src/test-helpers';
import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Route, Router } from 'react-router-dom';

import { PATHS } from '../paths';

import { dataTestIdsPerceptionDeploymentExpansionPage as dataTestIds, PerceptionDeploymentExpansionPage } from '.';

jest.mock('@plentyag/core/src/hooks/use-get-observations');

const mockUseGetPerceptionDeploymentHealthCheck = useGetObservations as jest.Mock;

function renderPerceptionDeploymentExpansionPage(path: string) {
  const initialEntries = [`${PATHS.deploymentPage(path)}`];

  const history = createMemoryHistory({ initialEntries });
  const result = render(
    <Router history={history}>
      <Route path={PATHS.deploymentPage(':path')} component={PerceptionDeploymentExpansionPage} />
    </Router>
  );

  return { history, ...result };
}
describe('PerceptionDeploymentExpansionPage', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('renders the expansion page correctly upon recieving the health check data', () => {
    mockUseGetPerceptionDeploymentHealthCheck.mockReturnValue({
      data: buildPaginatedResponse(mockPerceptionDeloymentObservationList),
      isValidating: false,
    });

    const { queryByTestId } = renderPerceptionDeploymentExpansionPage(mockPerceptionDeloymentObservationList[0].path);

    expect(queryByTestId(dataTestIds.perceptionDeploymentExpansionHeader)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.perceptionDeploymentExpansionHostName)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.perceptionDeploymentExpansionIsValidating)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.perceptionDeploymentExpansionErrorMsg)).not.toBeInTheDocument();
  });

  it('renders the progress when validating', () => {
    mockUseGetPerceptionDeploymentHealthCheck.mockReturnValue({
      data: null,
      isValidating: true,
    });

    const { queryByTestId } = renderPerceptionDeploymentExpansionPage(mockPerceptionDeloymentObservationList[0].path);

    expect(queryByTestId(dataTestIds.perceptionDeploymentExpansionHeader)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.perceptionDeploymentExpansionHostName)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.perceptionDeploymentExpansionIsValidating)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.perceptionDeploymentExpansionErrorMsg)).not.toBeInTheDocument();
  });

  it('renders the error message when data is not returned', () => {
    mockUseGetPerceptionDeploymentHealthCheck.mockReturnValue({
      data: null,
      isValidating: false,
    });

    const { queryByTestId } = renderPerceptionDeploymentExpansionPage(mockPerceptionDeloymentObservationList[0].path);

    expect(queryByTestId(dataTestIds.perceptionDeploymentExpansionHeader)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.perceptionDeploymentExpansionHostName)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.perceptionDeploymentExpansionIsValidating)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.perceptionDeploymentExpansionErrorMsg)).toBeInTheDocument();
  });
});

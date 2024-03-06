import { mockPerceptionDeloymentObservationList } from '@plentyag/app-perception/src/common/test-helpers/mocks';
import { useGetObservations } from '@plentyag/core/src/hooks';
import { buildPaginatedResponse } from '@plentyag/core/src/test-helpers';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { DashboardPage, dataTestIdsDashboardPage as dataTestIds } from './index';

jest.mock('@plentyag/core/src/hooks');

const mockUseGetPerceptionDeploymentHealthCheck = useGetObservations as jest.Mock;

const renderDasboard = () => {
  return render(<DashboardPage />, {
    wrapper: props => <MemoryRouter {...props} />,
  });
};

describe('DashboardPage', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('shows the list of online perception deployments based on observation results', () => {
    mockUseGetPerceptionDeploymentHealthCheck.mockReturnValue({
      data: buildPaginatedResponse(mockPerceptionDeloymentObservationList),
      isValidating: false,
    });

    const { queryByTestId } = renderDasboard();

    expect(queryByTestId(dataTestIds.perceptionHeader)).toBeInTheDocument();
    expect(
      queryByTestId(
        dataTestIds.listItemId('sites/LAX1/areas/VerticalGrow/lines/GrowRoom3/machines/GrowRoomTowerInspection')
      )
    ).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.isValidatingId)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.errorMsg)).not.toBeInTheDocument();
  });

  it('shows the progress when data is not available yet', () => {
    mockUseGetPerceptionDeploymentHealthCheck.mockReturnValue({
      data: null,
      isValidating: true,
    });

    const { queryByTestId } = renderDasboard();

    expect(queryByTestId(dataTestIds.isValidatingId)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.errorMsg)).not.toBeInTheDocument();
  });

  it('shows the error message when data is not returned', () => {
    mockUseGetPerceptionDeploymentHealthCheck.mockReturnValue({
      data: null,
      isValidating: false,
    });

    const { queryByTestId } = renderDasboard();

    expect(queryByTestId(dataTestIds.errorMsg)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.isValidatingId)).not.toBeInTheDocument();
  });
});

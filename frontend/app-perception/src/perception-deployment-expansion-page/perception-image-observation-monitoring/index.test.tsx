import { mockPerceptionDeloymentObservationList } from '@plentyag/app-perception/src/common/test-helpers/mocks';
import { useGetObservations } from '@plentyag/core/src/hooks';
import { buildPaginatedResponse } from '@plentyag/core/src/test-helpers';
import { render } from '@testing-library/react';

import {
  dataTestIdsPerceptionDeploymentImageObservationMonitor as dataTestIds,
  PerceptionDeploymentImageObservationMonitor,
} from './index';

jest.mock('@plentyag/core/src/hooks/use-get-observations');

const mockUseGetPerceptionDeploymentObservations = useGetObservations as jest.Mock;

const renderPerceptionDeploymentImageObservationMonitor = () => {
  return render(
    <PerceptionDeploymentImageObservationMonitor
      path={mockPerceptionDeloymentObservationList[0].path}
      hostName={mockPerceptionDeloymentObservationList[0].clientId}
    />
  );
};

describe('PerceptionDeploymentObservationPage', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('shows the obsevations summary based on observation results', () => {
    mockUseGetPerceptionDeploymentObservations.mockReturnValue({
      data: buildPaginatedResponse(mockPerceptionDeloymentObservationList),
      isValidating: false,
    });

    const { queryByTestId } = renderPerceptionDeploymentImageObservationMonitor();

    expect(queryByTestId(dataTestIds.perceptionDeploymentImageObservationsResults)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.perceptionDeploymentImageObservationsResultsDate)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.perceptionDeploymentImageObservationsResultsNumber)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.isValidatingId)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.errorMsg)).not.toBeInTheDocument();
  });

  it('shows the progress when data is not available yet', () => {
    mockUseGetPerceptionDeploymentObservations.mockReturnValue({
      data: null,
      isValidating: true,
    });

    const { queryByTestId } = renderPerceptionDeploymentImageObservationMonitor();

    expect(queryByTestId(dataTestIds.isValidatingId)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.errorMsg)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.perceptionDeploymentImageObservationsResults)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.perceptionDeploymentImageObservationsResultsDate)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.perceptionDeploymentImageObservationsResultsNumber)).not.toBeInTheDocument();
  });

  it('shows the error message when data is not returned', () => {
    mockUseGetPerceptionDeploymentObservations.mockReturnValue({
      data: null,
      isValidating: false,
    });

    const { queryByTestId } = renderPerceptionDeploymentImageObservationMonitor();

    expect(queryByTestId(dataTestIds.errorMsg)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.isValidatingId)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.perceptionDeploymentImageObservationsResults)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.perceptionDeploymentImageObservationsResultsDate)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.perceptionDeploymentImageObservationsResultsNumber)).not.toBeInTheDocument();
  });

  it('Do not show the last observation published date if no observation was found', () => {
    mockUseGetPerceptionDeploymentObservations.mockReturnValue({
      data: buildPaginatedResponse([]),
      isValidating: false,
    });

    const { queryByTestId } = renderPerceptionDeploymentImageObservationMonitor();

    expect(queryByTestId(dataTestIds.errorMsg)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.isValidatingId)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.perceptionDeploymentImageObservationsResults)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.perceptionDeploymentImageObservationsResultsDate)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.perceptionDeploymentImageObservationsResultsNumber)).toBeInTheDocument();
  });
});

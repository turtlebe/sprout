import {
  mockCameraTriggeredAtObservation,
  mockHealthCheckCamerasInfo,
  mockHealthCheckCamerasInfoWithLastTriggeredAtValue,
} from '@plentyag/app-perception/src/common/test-helpers/mocks';
import { useGetObservations } from '@plentyag/core/src/hooks';
import { buildPaginatedResponse } from '@plentyag/core/src/test-helpers';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { dataTestIdDetailCameraInfoPage as dataTestIds, DetailCameraInfoPage } from '.';

jest.mock('@plentyag/core/src/hooks/use-get-observations');

const mockUseGetCameraTriggeredAtTimeObservations = useGetObservations as jest.Mock;

function renderDetailCameraInfoPage(results) {
  return render(
    <MemoryRouter>
      <DetailCameraInfoPage results={results} />
    </MemoryRouter>
  );
}
describe('DetailCameraInfoPage', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('renders the detail camera info page correctly upon recieving the health check data without camera triggered at time', () => {
    mockUseGetCameraTriggeredAtTimeObservations.mockReturnValue({
      data: buildPaginatedResponse(mockCameraTriggeredAtObservation),
      isValidating: false,
    });
    const { queryByTestId } = renderDetailCameraInfoPage(mockHealthCheckCamerasInfo);

    expect(queryByTestId(dataTestIds.table)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.header)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.row(mockHealthCheckCamerasInfo[0].farm_def_id))).toBeInTheDocument();
    expect(mockUseGetCameraTriggeredAtTimeObservations).toBeCalledTimes(1);
  });

  it('renders the detail camera info page correctly upon recieving the health check data with camera triggered at time', () => {
    const { queryByTestId } = renderDetailCameraInfoPage(mockHealthCheckCamerasInfoWithLastTriggeredAtValue);

    expect(queryByTestId(dataTestIds.table)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.header)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.row(mockHealthCheckCamerasInfo[0].farm_def_id))).toBeInTheDocument();
    expect(mockUseGetCameraTriggeredAtTimeObservations).not.toBeCalled();
  });
});

import { mockCameraTriggeredAtObservation } from '@plentyag/app-perception/src/common/test-helpers/mocks';
import { useGetObservations } from '@plentyag/core/src/hooks';
import { buildPaginatedResponse } from '@plentyag/core/src/test-helpers';
import { render } from '@testing-library/react';

import { CameraLastTriggeredAtItem, dataTestIdCameraLastTriggeredAtItem as dataTestIds } from '.';

jest.mock('@plentyag/core/src/hooks/use-get-observations');

const mockUseGetCameraTriggeredAtTimeObservations = useGetObservations as jest.Mock;

function renderCameraLastTriggeredAtItem(locationPath) {
  return render(<CameraLastTriggeredAtItem locationPath={locationPath} />);
}
describe('CameraLastTriggeredAtItem', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('renders the camera last triggered at item', () => {
    mockUseGetCameraTriggeredAtTimeObservations.mockReturnValue({
      data: buildPaginatedResponse(mockCameraTriggeredAtObservation),
      isValidating: false,
    });
    const { queryByTestId } = renderCameraLastTriggeredAtItem(mockCameraTriggeredAtObservation[0].path);

    expect(queryByTestId(dataTestIds.validResult)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.isValidating)).not.toBeInTheDocument();
  });

  it('renders the progress waiting for data to be returned', () => {
    mockUseGetCameraTriggeredAtTimeObservations.mockReturnValue({
      data: null,
      isValidating: true,
    });
    const { queryByTestId } = renderCameraLastTriggeredAtItem(mockCameraTriggeredAtObservation[0].path);

    expect(queryByTestId(dataTestIds.validResult)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.isValidating)).toBeInTheDocument();
  });
});

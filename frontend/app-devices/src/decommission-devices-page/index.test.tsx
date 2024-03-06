import { useRedisJsonObjectApi } from '@plentyag/core/src/hooks';
import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Route, Router } from 'react-router-dom';

import { useGetDevicesByDeviceIds } from '../common/hooks/use-get-devices-by-device-ids';
import { ROUTES } from '../routes';

import { dataTestIdsDecommissionDevicesPage as dataTestIds, DecommissionDevicesPage } from '.';

jest.mock('./components/decommission-devices', () => ({
  DecommissionDevices: jest.fn(() => <span>mock-decommission-devices</span>),
}));
jest.mock('../common/hooks/use-get-devices-by-device-ids');
jest.mock('@plentyag/core/src/hooks/use-redis-json-object-api');

const mockUseRedisJsonObjectApi = useRedisJsonObjectApi as jest.Mock;
const mockUseGetDevicesByDeviceIds = useGetDevicesByDeviceIds as jest.Mock;

function renderDecommissionDevicesPage() {
  const history = createMemoryHistory({ initialEntries: [ROUTES.decommissionDevices('id')] });

  return render(
    <Router history={history}>
      <Route path={ROUTES.decommissionDevices(':redisObjectId')} component={DecommissionDevicesPage} />
    </Router>
  );
}

describe('DecommissionDevicesPage', () => {
  beforeEach(() => {
    mockUseRedisJsonObjectApi.mockRestore();
    mockUseGetDevicesByDeviceIds.mockRestore();
  });

  it('renders a loader', () => {
    mockUseRedisJsonObjectApi.mockReturnValue({ redisJsonObject: undefined, isLoading: true });
    mockUseGetDevicesByDeviceIds.mockReturnValue({ data: undefined, isValidating: true });

    const { queryByTestId, container } = renderDecommissionDevicesPage();

    expect(queryByTestId(dataTestIds.loader)).toBeInTheDocument();
    expect(container).not.toHaveTextContent('mock-decommission-devices');
  });

  it('renders a loader when one of the request is loading (redisObject)', () => {
    mockUseRedisJsonObjectApi.mockReturnValue({ redisJsonObject: undefined, isLoading: true });
    mockUseGetDevicesByDeviceIds.mockReturnValue({ data: undefined, isValidating: false });

    const { queryByTestId, container } = renderDecommissionDevicesPage();

    expect(queryByTestId(dataTestIds.loader)).toBeInTheDocument();
    expect(container).not.toHaveTextContent('mock-decommission-devices');
  });

  it('renders a loader when one of the request is loading (getDevices)', () => {
    mockUseRedisJsonObjectApi.mockReturnValue({
      redisJsonObject: { value: { deviceIds: [1, 2, 3] } },
      isLoading: false,
    });
    mockUseGetDevicesByDeviceIds.mockReturnValue({ data: undefined, isValidating: true });

    const { queryByTestId, container } = renderDecommissionDevicesPage();

    expect(queryByTestId(dataTestIds.loader)).toBeInTheDocument();
    expect(container).not.toHaveTextContent('mock-decommission-devices');
    expect(mockUseGetDevicesByDeviceIds).toHaveBeenCalledWith([1, 2, 3]);
  });

  it('renders the DecommissionDevices component', () => {
    mockUseRedisJsonObjectApi.mockReturnValue({
      redisJsonObject: { value: { deviceIds: [1, 2, 3] } },
      isLoading: false,
    });
    mockUseGetDevicesByDeviceIds.mockReturnValue({ data: [], isValidating: false });

    const { queryByTestId, container } = renderDecommissionDevicesPage();

    expect(queryByTestId(dataTestIds.loader)).not.toBeInTheDocument();
    expect(container).toHaveTextContent('mock-decommission-devices');
    expect(mockUseGetDevicesByDeviceIds).toHaveBeenCalledWith([1, 2, 3]);
  });
});

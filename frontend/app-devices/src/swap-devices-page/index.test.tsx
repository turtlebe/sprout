import { useRedisJsonObjectApi } from '@plentyag/core/src/hooks';
import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { useGetDevicesByDeviceIds } from '../common/hooks/use-get-devices-by-device-ids';

import { SwapDevicesPage } from '.';

jest.mock('./components/swap-devices', () => ({
  SwapDevices: jest.fn(() => <span>mock-swap-devices</span>),
}));
jest.mock('../common/hooks/use-get-devices-by-device-ids');
jest.mock('@plentyag/core/src/hooks');

const mockUseRedisJsonObjectApi = useRedisJsonObjectApi as jest.Mock;
const mockUseGetDevicesByDeviceIds = useGetDevicesByDeviceIds as jest.Mock;
const match = {
  isExact: true,
  params: {
    redisJsonObjectId: 'mockRedisJsonObjectId',
  },
  path: '/',
  url: '/',
};

describe('SwapDevicesPage', () => {
  beforeEach(() => {
    mockUseRedisJsonObjectApi.mockRestore();
    mockUseGetDevicesByDeviceIds.mockRestore();
  });

  it('renders', () => {
    mockUseRedisJsonObjectApi.mockReturnValue({
      isLoading: false,
      redisJsonObject: { value: { deviceIds: [1, 2, 3] } },
    });
    mockUseGetDevicesByDeviceIds.mockReturnValue({ isValidating: false, data: [] });
    const { container } = render(<SwapDevicesPage match={match} />, { wrapper: props => <MemoryRouter {...props} /> });

    expect(container).toHaveTextContent('Swap Devices');
    expect(container).toHaveTextContent('mock-swap-devices');

    expect(mockUseGetDevicesByDeviceIds).toHaveBeenCalledWith([1, 2, 3]);
  });
});

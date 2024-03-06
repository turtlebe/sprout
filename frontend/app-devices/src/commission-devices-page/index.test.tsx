import { useRedisJsonObjectApi } from '@plentyag/core/src/hooks';
import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { useGetDevicesByDeviceIds } from '../common/hooks/use-get-devices-by-device-ids';

import { CommissionDevicesPage } from '.';

jest.mock('./components/commission-devices', () => ({
  CommissionDevices: jest.fn(() => <span>mock-commission-devices</span>),
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

describe('CommissionDevicesPage', () => {
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
    const { container } = render(<CommissionDevicesPage match={match} />, {
      wrapper: props => <MemoryRouter {...props} />,
    });

    expect(container).toHaveTextContent('Commission Devices');
    expect(container).toHaveTextContent('mock-commission-devices');

    expect(mockUseGetDevicesByDeviceIds).toHaveBeenCalledWith([1, 2, 3]);
  });
});

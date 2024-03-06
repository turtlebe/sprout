import { mockDmsDevice } from '@plentyag/app-devices/src/common/test-helpers/devices';
import { render } from '@testing-library/react';
import React from 'react';

import { DeviceFirmware } from '.';

describe('DeviceFirmware', () => {
  it('renders null', () => {
    const { container } = render(<DeviceFirmware device={null} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders an empty state', () => {
    const { container } = render(
      <DeviceFirmware device={{ ...mockDmsDevice, appFirmwareVersion: '', bootloaderFirmwareVersion: '' }} />
    );

    expect(container).toHaveTextContent('Firmware: --');
  });

  it('renders the firmware versions', () => {
    const { container } = render(<DeviceFirmware device={mockDmsDevice} />);

    expect(container).toHaveTextContent(mockDmsDevice.appFirmwareVersion);
    expect(container).toHaveTextContent(mockDmsDevice.bootloaderFirmwareVersion);
  });
});

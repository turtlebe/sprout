import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { ROUTES } from '../../../routes';
import { mockDevices } from '../../test-helpers/devices';

import { DeviceTypeAndSerial } from '.';

const device = mockDevices[0];

describe('DeviceTypeAndSerial', () => {
  it('displays the device type and serial with a link', () => {
    const { container } = render(<DeviceTypeAndSerial device={device} />, {
      wrapper: props => <MemoryRouter {...props} />,
    });

    expect(container).toHaveTextContent(device.deviceTypeName);
    expect(container).toHaveTextContent(device.serial);
    expect(container.querySelector('a')).toBeInTheDocument();
    expect(container.querySelector('a')).toHaveProperty('href', `http://localhost${ROUTES.devicePage(device.id)}`);
  });
});

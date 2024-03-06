import { mockDmsDevice } from '@plentyag/app-devices/src/common/test-helpers/devices';
import { render } from '@testing-library/react';
import React from 'react';

import { DeviceState } from '.';

describe('DeviceState', () => {
  it('renders', () => {
    const { container } = render(<DeviceState device={null} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders a chip with a primary color', () => {
    const { container } = render(<DeviceState device={mockDmsDevice} />);

    expect(container).toHaveTextContent(mockDmsDevice.deviceState.toLocaleLowerCase());
  });
});

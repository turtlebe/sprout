import { mockDevices } from '@plentyag/app-devices/src/common/test-helpers/devices';
import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { IncompatibleDevices } from '.';

describe('IncompatibleDevices', () => {
  it('renders null', () => {
    const { container } = render(<IncompatibleDevices devices={[]} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders a list of devices', () => {
    const { container } = render(<IncompatibleDevices devices={[mockDevices[0], mockDevices[1]]} />, {
      wrapper: props => <MemoryRouter {...props} />,
    });

    expect(container).toHaveTextContent(mockDevices[0].serial);
    expect(container).toHaveTextContent(mockDevices[0].deviceTypeName);
    expect(container).toHaveTextContent(mockDevices[1].serial);
    expect(container).toHaveTextContent(mockDevices[1].deviceTypeName);
  });
});

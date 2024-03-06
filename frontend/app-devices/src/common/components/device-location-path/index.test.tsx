import { mockDevices } from '@plentyag/app-devices/src/common/test-helpers/devices';
import { getShortenedPath } from '@plentyag/core/src/utils';
import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsDeviceLocationPath as dataTestIds, DeviceLocationPath } from '.';

const [unplacedDevice, placedDevice] = mockDevices;

describe('DeviceLocationPath', () => {
  it('renders nothing', () => {
    const { container } = render(<DeviceLocationPath device={unplacedDevice} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders the device location path', () => {
    const { container, queryByTestId } = render(<DeviceLocationPath device={placedDevice} />);

    expect(container).toHaveTextContent(getShortenedPath(placedDevice.location.path));
    expect(queryByTestId(dataTestIds.copyToClipboard)).not.toBeInTheDocument();
  });

  it('renders a button to copy the device location path to the clipboard', () => {
    const copyToClipboard = jest.spyOn(window, 'prompt').mockImplementation(jest.fn());

    const { queryByTestId } = render(<DeviceLocationPath device={placedDevice} copyable />);

    queryByTestId(dataTestIds.copyToClipboard).click();

    expect(copyToClipboard).toHaveBeenCalled();
  });
});

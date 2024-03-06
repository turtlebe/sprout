import { mockDevices } from '@plentyag/app-devices/src/common/test-helpers/devices';
import { render } from '@testing-library/react';
import React from 'react';

import { TabPanelFiles } from '.';

const sprinkle = mockDevices[0];
const camera = mockDevices[2];

describe('TabPanelFiles', () => {
  it('renders FactoryTestResult only for a Sprinkle', () => {
    const { container } = render(<TabPanelFiles device={sprinkle} />);

    expect(container).toHaveTextContent('Files');
    expect(container).toHaveTextContent('Factory Test Result');
  });

  it('renders Calibration only for a Camera', () => {
    const { container } = render(<TabPanelFiles device={camera} />);

    expect(container).toHaveTextContent('Files');
    expect(container).toHaveTextContent('Calibration');
    expect(container).not.toHaveTextContent('Factory Test Result');
  });
});

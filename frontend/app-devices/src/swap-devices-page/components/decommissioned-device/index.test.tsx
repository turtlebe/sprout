import { render } from '@testing-library/react';
import React from 'react';

import { DecommissionedDevice } from '.';

describe('DecommissionedDevice', () => {
  it('renders', () => {
    const { container } = render(<DecommissionedDevice />);

    expect(container).toHaveTextContent('Decommissioned device');
  });
});

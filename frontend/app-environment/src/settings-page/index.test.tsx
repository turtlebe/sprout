import { render } from '@testing-library/react';
import React from 'react';

import { SettingsPage } from '.';

describe('SettingsPage', () => {
  it('renders', () => {
    const { container } = render(<SettingsPage />);

    expect(container).toHaveTextContent('Settings');
  });
});

import { render } from '@testing-library/react';
import React from 'react';

import { ButtonHome, dataTestIds } from '.';

describe('ButtonHome', () => {
  it('has a href="/" attribute', () => {
    const { getByTestId } = render(<ButtonHome />);
    expect(getByTestId(dataTestIds.root)).toHaveAttribute('href', '/');
  });
});

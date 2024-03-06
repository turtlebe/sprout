import { render } from '@testing-library/react';
import React from 'react';

import { NotFound } from '.';

describe('NotFound', () => {
  it('returns with a custom title', () => {
    const { container } = render(<NotFound title="Nothing here" />);

    expect(container).toHaveTextContent('Nothing here');
  });
});

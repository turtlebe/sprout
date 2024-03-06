import { render } from '@testing-library/react';
import React from 'react';

import { Loading } from './loading';

describe('Loading', () => {
  it('renders', () => {
    const { asFragment } = render(<Loading />);
    expect(asFragment()).toMatchSnapshot();
  });
});

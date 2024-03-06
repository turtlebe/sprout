import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsLegendColor as dataTestIds, LegendColor } from '.';

describe('LegendColor', () => {
  it('does not set the border or background colors', () => {
    const { queryByTestId } = render(<LegendColor />);

    expect(queryByTestId(dataTestIds.root)).toHaveStyle({ border: '', background: '' });
  });

  it('sets the borderColor and backgroundColor', () => {
    const { queryByTestId } = render(<LegendColor borderColor="#000000" backgroundColor="#ffffff" />);

    expect(queryByTestId(dataTestIds.root)).toHaveStyle({ border: '1px solid #000000', background: '#ffffff' });
  });

  it('sets the backgroundColor using a repeating-linear-gradient', () => {
    const { queryByTestId } = render(<LegendColor backgroundColorLinearGradient={['#000000', '#ffffff']} />);

    expect(queryByTestId(dataTestIds.root)).toHaveStyle({
      border: '',
      background: 'repeating-linear-gradient(to right, #000000, #000000 0.25rem, #ffffff 0.25rem, #ffffff 0.5rem',
    });
  });
});

import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsTabMetricsLabel as dataTestIds, TabMetricsLabel } from '.';

describe('TabMetricsLabel', () => {
  it('renders without a loader', () => {
    const { queryByTestId } = render(<TabMetricsLabel isLoading={false} />);

    expect(queryByTestId(dataTestIds.loader)).not.toBeInTheDocument();
  });

  it('renders with a loader', () => {
    const { queryByTestId } = render(<TabMetricsLabel isLoading />);

    expect(queryByTestId(dataTestIds.loader)).toBeInTheDocument();
  });
});

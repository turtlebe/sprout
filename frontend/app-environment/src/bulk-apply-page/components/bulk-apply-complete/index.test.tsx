import { mockMetrics } from '@plentyag/app-environment/src/common/test-helpers';
import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { BulkApplyComplete, dataTestIdsBulkApplyComplete as dataTestIds } from '.';

describe('BulkApplyComplete', () => {
  it('returns a link to each Metric page ', () => {
    const { queryByTestId } = render(
      <MemoryRouter>
        <BulkApplyComplete metrics={mockMetrics} />
      </MemoryRouter>
    );

    expect(mockMetrics.length).toBeGreaterThan(0);

    mockMetrics.forEach(metric => {
      expect(queryByTestId(dataTestIds.linkToMetric(metric))).toBeInTheDocument();
    });
    expect(queryByTestId(dataTestIds.linkToMetrics)).toBeInTheDocument();
  });
});

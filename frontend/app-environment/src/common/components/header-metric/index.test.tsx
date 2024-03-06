import { mockMetrics } from '@plentyag/app-environment/src/common/test-helpers';
import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { titleCase } from 'voca';

import { dataTestIdsHeaderMetric as dataTestIds, HeaderMetric } from '.';

const [metric] = mockMetrics;

mockCurrentUser();

describe('HeaderMetric', () => {
  it('renders a loader', () => {
    const { queryByTestId } = render(
      <HeaderMetric metric={undefined} isLoading={true}>
        <p data-testid="nested-component" />
      </HeaderMetric>,
      { wrapper: props => <MemoryRouter {...props} /> }
    );

    expect(queryByTestId(dataTestIds.loader)).toBeInTheDocument();
    expect(queryByTestId('nested-component')).toBeInTheDocument();
  });

  it('renders info about the Metric', () => {
    const { queryByTestId } = render(
      <HeaderMetric metric={metric} isLoading={false}>
        <p data-testid="nested-component" />
      </HeaderMetric>,
      { wrapper: props => <MemoryRouter {...props} /> }
    );

    expect(queryByTestId(dataTestIds.loader)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.description)).toHaveTextContent(titleCase(metric.measurementType));
    expect(queryByTestId(dataTestIds.description)).toHaveTextContent(metric.observationName);
    expect(queryByTestId('nested-component')).toBeInTheDocument();
  });
});

import { mockMetrics } from '@plentyag/app-environment/src/common/test-helpers';
import {
  DEFAULT_DATA_INTERPOLATION,
  DEFAULT_TIME_GRANULARITY,
} from '@plentyag/app-environment/src/common/utils/constants';
import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsMetricGraphNonNumerical as dataTestIds, MetricGraphNonNumerical } from '.';

const [metric] = mockMetrics;
const startDateTime = new Date('2022-01-01T00:00:00Z');
const endDateTime = new Date('2022-01-02T00:00:00Z');
const onTimeGranularityChange = jest.fn();

function renderMetricGraphNonNumerical(props: Partial<MetricGraphNonNumerical>, children = undefined) {
  return render(
    <MetricGraphNonNumerical
      {...props}
      metric={metric}
      observations={[]}
      startDateTime={startDateTime}
      endDateTime={endDateTime}
      isEditing={false}
      isLoading={false}
      previousTimeGranularity={DEFAULT_TIME_GRANULARITY}
      dataInterpolation={DEFAULT_DATA_INTERPOLATION}
      timeGranularity={DEFAULT_TIME_GRANULARITY}
      onTimeGranularityChange={onTimeGranularityChange}
    >
      {children}
    </MetricGraphNonNumerical>
  );
}

describe('MetricGraphNonNumerical', () => {
  it('renders without a title', () => {
    const { queryByTestId } = renderMetricGraphNonNumerical({});

    expect(queryByTestId(dataTestIds.header)).not.toBeInTheDocument();
  });

  it('renders with a title', () => {
    const { queryByTestId } = renderMetricGraphNonNumerical({ title: 'test' });

    expect(queryByTestId(dataTestIds.header)).toHaveTextContent('test');
  });

  it('renders with children', () => {
    const { queryByTestId } = renderMetricGraphNonNumerical({}, <div data-testid="children" />);

    expect(queryByTestId('children')).toBeInTheDocument();
  });
});

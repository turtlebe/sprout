import { mockMetrics, mockSchedules } from '@plentyag/app-environment/src/common/test-helpers';
import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { DashboardGraphLinks, dataTestIdsDashboardGraphLinks as dataTestIds } from '.';

describe('DashboardGraphLinks', () => {
  it('shows/hides a list of metric', () => {
    const { queryByTestId, queryAllByTestId } = render(
      <MemoryRouter>
        <DashboardGraphLinks metricsOrSchedules={mockMetrics} />
      </MemoryRouter>
    );

    expect(queryByTestId(dataTestIds.button)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.link(mockMetrics[0]))).not.toBeVisible();

    queryByTestId(dataTestIds.button).click();

    expect(queryByTestId(dataTestIds.link(mockMetrics[0]))).toBeVisible();
    expect(queryAllByTestId('legend-color-root')[0]).not.toHaveStyle('background: blue;');
  });

  it('uses the color passed in instead of the default ones list of metric', () => {
    const { queryByTestId, queryAllByTestId } = render(
      <MemoryRouter>
        <DashboardGraphLinks metricsOrSchedules={mockMetrics} colors={['blue', 'red', 'green']} />
      </MemoryRouter>
    );

    expect(queryByTestId(dataTestIds.button)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.link(mockMetrics[0]))).not.toBeVisible();

    queryByTestId(dataTestIds.button).click();

    expect(queryByTestId(dataTestIds.link(mockMetrics[0]))).toBeVisible();
    expect(queryAllByTestId('legend-color-root')[0]).toHaveStyle('background: blue;');
  });

  it('allows passing schedules', () => {
    const { queryByTestId, queryAllByTestId } = render(
      <MemoryRouter>
        <DashboardGraphLinks metricsOrSchedules={[mockSchedules[0]]} />
      </MemoryRouter>
    );

    expect(queryByTestId(dataTestIds.button)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.link(mockSchedules[0]))).not.toBeVisible();

    queryByTestId(dataTestIds.button).click();

    expect(queryByTestId(dataTestIds.link(mockSchedules[0]))).toBeVisible();
    expect(queryAllByTestId('legend-color-root')[0]).toHaveStyle('background: rgb(84, 71, 140);');
  });
});

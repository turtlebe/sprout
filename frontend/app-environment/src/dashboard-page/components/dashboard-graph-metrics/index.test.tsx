import { useFetchObservations } from '@plentyag/app-environment/src/common/hooks';
import { buildMetric, mockDashboards } from '@plentyag/app-environment/src/common/test-helpers';
import { getColorGenerator } from '@plentyag/app-environment/src/common/utils';
import { mockMeasurementTypes } from '@plentyag/core/src/farm-def/test-helpers';
import { mockUseFetchMeasurementTypes } from '@plentyag/core/src/hooks/use-fetch-measurement-types/test-helpers';
import { TooltipPositioning } from '@plentyag/core/src/types/environment';
import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { DashboardGraphMetrics, dataTestIdsDashboardGraphMetrics as dataTestIds } from '.';

jest.mock('@plentyag/app-environment/src/common/hooks/use-fetch-observations');
jest.mock('@plentyag/core/src/hooks/use-fetch-measurement-types');

const mockUseFetchObservations = useFetchObservations as jest.Mock;

const [dashboard] = mockDashboards;
const measurementType = mockMeasurementTypes.find(mt => mt.key === 'TEMPERATURE');
const metrics = [
  buildMetric({ measurementType: measurementType.key }),
  buildMetric({ measurementType: measurementType.key }),
];
const startDateTime = new Date('2023-01-01T00:00:00Z');
const endDateTime = new Date('2023-01-02T00:00:00Z');
const title = <div>title</div>;
const action = <div>action</div>;
const tooltipPositioning = TooltipPositioning.default;

function renderDashboardGraphMetrics() {
  return render(
    <MemoryRouter>
      <DashboardGraphMetrics
        dashboard={dashboard}
        metrics={metrics}
        measurementType={measurementType}
        startDateTime={startDateTime}
        endDateTime={endDateTime}
        title={title}
        action={action}
        tooltipPositioning={tooltipPositioning}
      />
    </MemoryRouter>
  );
}

describe('DashboardGraphMetrics', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseFetchMeasurementTypes();
  });

  it('allows the user to choose a Metric and see its Statistics Summary', () => {
    const colorGenerator = getColorGenerator();
    const metricsWithObservations = metrics.map(metric => ({
      observations: [],
      metric,
      colors: colorGenerator.next().value,
    }));

    mockUseFetchObservations.mockReturnValue({ data: metricsWithObservations, isValidating: false });

    const { queryByTestId } = renderDashboardGraphMetrics();

    expect(queryByTestId(dataTestIds.graphLegend.buttonMetric(metrics[0]))).toHaveAttribute('aria-selected', 'false');
    expect(queryByTestId(dataTestIds.graphLegend.buttonMetric(metrics[1]))).toHaveAttribute('aria-selected', 'false');
    expect(queryByTestId(dataTestIds.graphStatistics.root)).not.toBeInTheDocument();

    queryByTestId(dataTestIds.graphLegend.buttonMetric(metrics[1])).click();

    expect(queryByTestId(dataTestIds.graphLegend.buttonMetric(metrics[0]))).toHaveAttribute('aria-selected', 'false');
    expect(queryByTestId(dataTestIds.graphLegend.buttonMetric(metrics[1]))).toHaveAttribute('aria-selected', 'true');
    expect(queryByTestId(dataTestIds.graphStatistics.root)).toBeInTheDocument();
  });
});

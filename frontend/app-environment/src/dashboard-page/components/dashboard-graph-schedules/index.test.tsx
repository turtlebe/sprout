import { getGraphTooltipDataTestIds, GraphLegend, GraphTooltip } from '@plentyag/app-environment/src/common/components';
import { buildSchedule, buildScheduleDefinition } from '@plentyag/app-environment/src/common/test-helpers';
import { mockUseFetchMeasurementTypes } from '@plentyag/core/src/hooks/use-fetch-measurement-types/test-helpers';
import { TooltipPositioning } from '@plentyag/core/src/types/environment';
import { render } from '@testing-library/react';
import React from 'react';

import { DashboardGraphLinks, WarningMultipleMeasurementTypes } from '..';

import { DashboardGraphSchedules } from '.';

jest.mock('@plentyag/core/src/hooks/use-fetch-measurement-types');
jest.mock('@plentyag/app-environment/src/common/components/graph-legend');
jest.mock('@plentyag/app-environment/src/common/components/graph-tooltip');
jest.mock('@plentyag/app-environment/src/dashboard-page/components/dashboard-graph-links');
jest.mock('@plentyag/app-environment/src/dashboard-page/components/warning-multiple-measurement-types');

const mockGetGraphTooltipDataTestIds = getGraphTooltipDataTestIds as jest.Mock;
const MockGraphLegend = GraphLegend as jest.Mock;
const MockGraphTooltip = GraphTooltip as jest.Mock;
const MockDashboardGraphLinks = DashboardGraphLinks as jest.Mock;
const MockWarningMultipleMeasurementTypes = WarningMultipleMeasurementTypes as jest.Mock;
const action = <></>;

const schedules = [buildSchedule({}), buildSchedule({})];
const scheduleDefinitions = [
  buildScheduleDefinition({ actionDefinition: { from: 0, to: 0, measurementType: 'TEMPERATURE', graphable: true } }),
  buildScheduleDefinition({ actionDefinition: { from: 0, to: 0, measurementType: 'TEMPERATURE', graphable: true } }),
];
const startDateTime = new Date();
const endDateTime = new Date();
const title = 'title';

describe('DashboardGraphSchedules', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    mockUseFetchMeasurementTypes();

    mockGetGraphTooltipDataTestIds.mockReturnValue({ root: 'test-root' });
    MockGraphLegend.mockImplementation(() => <div />);
    MockGraphTooltip.mockImplementation(() => <div />);
    MockDashboardGraphLinks.mockImplementation(() => <div />);
    MockWarningMultipleMeasurementTypes.mockImplementation(() => <div />);
  });

  it('renders a graph for multiple schedules', () => {
    render(
      <DashboardGraphSchedules
        schedules={schedules}
        scheduleDefinitions={scheduleDefinitions}
        startDateTime={startDateTime}
        endDateTime={endDateTime}
        title={title}
        action={action}
        tooltipPositioning={TooltipPositioning.grid}
      />
    );

    expect(MockWarningMultipleMeasurementTypes).toHaveBeenCalledWith({ scheduleDefinitions }, {});
    expect(MockGraphLegend).toHaveBeenCalledWith({ schedules }, {});
    expect(MockDashboardGraphLinks).toHaveBeenCalledWith({ metricsOrSchedules: schedules }, {});
    expect(MockGraphTooltip).toHaveBeenCalledWith({ 'data-testid': 'test-root', schedules, scheduleDefinitions }, {});
  });
});

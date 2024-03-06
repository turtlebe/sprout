import { getGraphTooltipDataTestIds, GraphLegend, GraphTooltip } from '@plentyag/app-environment/src/common/components';
import { useGraphApi, useScale } from '@plentyag/app-environment/src/common/components/schedule-graph/hooks';
import { useOptimalYAxis, useUnitConversion } from '@plentyag/app-environment/src/common/hooks';
import { getGraphableActionDefinition, getScheduleColorGenerator } from '@plentyag/app-environment/src/common/utils';
import { Box, Card, CardHeader } from '@plentyag/brand-ui/src/material-ui/core';
import { ScheduleDefinition } from '@plentyag/core/src/farm-def/types';
import { useMeasure } from '@plentyag/core/src/hooks';
import { Schedule, TooltipPositioning } from '@plentyag/core/src/types/environment';
import { uuidv4 } from '@plentyag/core/src/utils';
import React from 'react';

import { DashboardGraphLinks, WarningMultipleMeasurementTypes } from '..';

import { useStyles } from './styles';

const dataTestIds = {};

export { dataTestIds as dataTestIdsDashboardGraphSchedules };

export interface DashboardGraphSchedules {
  schedules: Schedule[];
  scheduleDefinitions: ScheduleDefinition[];
  startDateTime: Date;
  endDateTime: Date;
  title: React.ReactNode;
  action: React.ReactNode;
  tooltipPositioning: TooltipPositioning;
}

export const DashboardGraphSchedules: React.FC<DashboardGraphSchedules> = ({
  schedules,
  scheduleDefinitions,
  startDateTime,
  endDateTime,
  title,
  action,
  tooltipPositioning,
}) => {
  // Miscellanous
  const classes = useStyles({});
  const { getPreferredUnit } = useUnitConversion();
  const unitSymbol = getPreferredUnit(
    getGraphableActionDefinition(scheduleDefinitions[0]).actionDefinition.measurementType
  ).symbol;
  const colorGenerator = getScheduleColorGenerator();

  // States
  const [graphTooltipSelectors] = React.useState(getGraphTooltipDataTestIds(`graph-tooltip-${uuidv4()}`));

  // D3 related hooks
  const { min, max } = useOptimalYAxis({ schedules, scheduleDefinitions });
  const ref = React.useRef<SVGSVGElement>(null);
  const refSize = useMeasure(ref);
  const scale = useScale({
    minY: min,
    maxY: max,
    scheduleDefinitions,
    width: refSize.width,
    height: 200,
    startDateTime,
    endDateTime,
  });
  const chartApi = useGraphApi({ ref, scale, schedules });

  // Effects
  React.useEffect(() => {
    chartApi.clear();
    chartApi.renderGraph({ unitSymbol });

    schedules.forEach(schedule => {
      chartApi.renderSchedule({
        schedule,
        scheduleDefinition: scheduleDefinitions.find(definition => definition.path === schedule.path),
        color: colorGenerator.next().value,
      });
    });

    chartApi.renderMouseOverEffect({
      schedules,
      scheduleDefinitions,
      unitSymbol,
      graphTooltipSelectors,
      tooltipPositioning,
    });
  }, [scale.minY, scale.maxY, scale.width, schedules, scheduleDefinitions, startDateTime, endDateTime]);

  return (
    <Card>
      <Box position="relative">
        <CardHeader title={title} action={action} classes={{ title: classes.title }} />
        <Box paddingX={2}>
          <WarningMultipleMeasurementTypes scheduleDefinitions={scheduleDefinitions} />

          <Box flex="1 1 0" display="flex" justifyContent="center" flexDirection="column" overflow="hidden">
            <svg ref={ref} viewBox={`0 0 ${scale.width} ${scale.height}`} />
          </Box>

          <GraphLegend schedules={schedules} />
        </Box>
        <DashboardGraphLinks metricsOrSchedules={schedules} />
      </Box>
      <GraphTooltip
        data-testid={graphTooltipSelectors.root}
        schedules={schedules}
        scheduleDefinitions={scheduleDefinitions}
      />
    </Card>
  );
};

import { UseRelatedMetricsAndObservationsReturn } from '@plentyag/app-environment/src/common/hooks';
import { adjustColor, getActionDefinitions } from '@plentyag/app-environment/src/common/utils';
import { dataTestIdsGraphTooltip as dataTestIds } from '@plentyag/app-environment/src/common/utils/constants';
import { Box, Card, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { ScheduleDefinition } from '@plentyag/core/src/farm-def/types';
import { RolledUpByTimeObservation } from '@plentyag/core/src/types';
import { AlertRule, Schedule } from '@plentyag/core/src/types/environment';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import React from 'react';

import { getColorGenerator, getScheduleColorGenerator } from '../../utils';
import { COLORS } from '../../utils/constants';

import { useStyles } from './styles';

export const getGraphTooltipDataTestIds = prefix => getScopedDataTestIds(dataTestIds, prefix);

export interface GraphTooltip {
  schedule?: Schedule;
  schedules?: Schedule[];
  scheduleDefinition?: ScheduleDefinition;
  scheduleDefinitions?: ScheduleDefinition[];
  alertRules?: AlertRule[];
  observations?: RolledUpByTimeObservation[];
  metricsWithObservations?: UseRelatedMetricsAndObservationsReturn['data'];
  'data-testid'?: string;
}

/**
 * This components renders a simple div. It is re-used by the d3 {@link renderMouseOverContainer} function as a tooltip on the
 * {@link MetricGraph} or {@link ScheduleGraph} when hovering with the mouse.
 *
 * It is simpler and cleaner to use React code for the html and css and let the d3 function simply update the content and the position of the tooltip
 * based on the mouse.
 */
export const GraphTooltip: React.FC<GraphTooltip> = ({
  schedule,
  scheduleDefinition,
  scheduleDefinitions,
  schedules,
  alertRules,
  observations,
  metricsWithObservations,
  'data-testid': dataTestId,
}) => {
  const dataTestIdsWithPrefix = getGraphTooltipDataTestIds(dataTestId);
  const classes = useStyles({});
  const colorGenerator = getColorGenerator();
  const scheduleColorGenerator = getScheduleColorGenerator();

  return (
    <Box
      id={dataTestIdsWithPrefix.root}
      data-testid="graph-tooltip"
      style={{ position: 'absolute', visibility: 'hidden', top: 0, left: 0 }}
    >
      <Card>
        <Box padding={2}>
          <Typography id={dataTestIdsWithPrefix.time} className={classes.time} />
          {alertRules &&
            alertRules.map(alertRule => (
              <Typography
                key={alertRule.id}
                id={dataTestIdsWithPrefix.alertRule(alertRule)}
                className={`${classes.alertRule} ${alertRule.alertRuleType}`}
              />
            ))}
          {observations && <Typography id={dataTestIdsWithPrefix.observation} className={classes.observation} />}
          {schedule &&
            scheduleDefinition &&
            getActionDefinitions(scheduleDefinition).map(({ key }, index) => (
              <Typography
                key={key ?? ''}
                id={dataTestIdsWithPrefix.scheduleWithKey(schedule, key)}
                className={classes.schedule}
                style={{
                  color: adjustColor(COLORS.schedule, index),
                }}
              />
            ))}
          {schedules &&
            scheduleDefinitions &&
            schedules.map((schedule, index) => (
              <Box key={schedule.id}>
                <Typography
                  id={dataTestIdsWithPrefix.scheduleHeader(schedule)}
                  className={classes.schedule}
                  style={{
                    color: scheduleColorGenerator.next().value,
                  }}
                />
                <Box className={classes.gridActionDefinitions}>
                  {getActionDefinitions(scheduleDefinitions[index]).map(({ key }) => (
                    <Box key={key ?? ''} id={dataTestIdsWithPrefix.scheduleWithKey(schedule, key)} />
                  ))}
                </Box>
              </Box>
            ))}
          {metricsWithObservations &&
            metricsWithObservations.map(metricWithObservations => (
              <Typography
                key={metricWithObservations.metric.id}
                id={dataTestIdsWithPrefix.metricWithObservations(metricWithObservations.metric)}
                className={classes.observation}
                style={{
                  color: colorGenerator.next().value[0],
                }}
              />
            ))}
        </Box>
      </Card>
    </Box>
  );
};

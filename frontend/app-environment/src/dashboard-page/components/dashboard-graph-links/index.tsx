import { ExpandMore } from '@material-ui/icons';
import { LinkMetric, LinkSchedule } from '@plentyag/app-environment/src/common/components';
import { getColorGenerator, getScheduleColorGenerator } from '@plentyag/app-environment/src/common/utils';
import { Box, CardContent, Collapse, IconButton } from '@plentyag/brand-ui/src/material-ui/core';
import { Metric, Schedule } from '@plentyag/core/src/types/environment';
import { isMetric } from '@plentyag/core/src/types/environment/type-guards';
import React from 'react';

const dataTestIds = {
  button: 'collapsable-metrics-links-button',
  link: (metricOrSchedule: Metric | Schedule) => `collapsable-metrics-links-button-${metricOrSchedule.id}`,
};

export { dataTestIds as dataTestIdsDashboardGraphLinks };

export interface DashboardGraphLinks {
  metricsOrSchedules: (Metric | Schedule)[];

  colors?: string[];
}

/**
 * Shows/hides a list of Metric/Schedule Links when clicking a CTA.
 */
export const DashboardGraphLinks: React.FC<DashboardGraphLinks> = ({
  metricsOrSchedules = [],

  colors,
}) => {
  const colorGenerator = getColorGenerator();
  const scheduleColorGenerator = getScheduleColorGenerator();

  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      <Box display="flex" width="100%" justifyContent="center" paddingBottom={1}>
        <IconButton
          size="small"
          color="default"
          onClick={handleExpandClick}
          icon={ExpandMore}
          aria-expanded={expanded}
          data-testid={dataTestIds.button}
        />
      </Box>

      <Collapse in={expanded}>
        <CardContent>
          {metricsOrSchedules.map((metricOrSchedule, index) =>
            isMetric(metricOrSchedule) ? (
              <LinkMetric
                key={metricOrSchedule.id}
                data-testid={dataTestIds.link(metricOrSchedule)}
                metric={metricOrSchedule}
                color={colors ? colors[index] : colorGenerator.next().value[0]}
              />
            ) : (
              <LinkSchedule
                key={metricOrSchedule.id}
                data-testid={dataTestIds.link(metricOrSchedule)}
                schedule={metricOrSchedule}
                color={colors ? colors[index] : scheduleColorGenerator.next().value}
              />
            )
          )}
        </CardContent>
      </Collapse>
    </>
  );
};

import { Warning } from '@material-ui/icons';
import { getActionDefinitions } from '@plentyag/app-environment/src/common/utils';
import { Show } from '@plentyag/brand-ui/src/components';
import { Chip } from '@plentyag/brand-ui/src/material-ui/core';
import { ScheduleDefinition } from '@plentyag/core/src/farm-def/types';
import { Metric } from '@plentyag/core/src/types/environment';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import { uniq } from 'lodash';
import React from 'react';

const dataTestIds = getScopedDataTestIds({ warning: 'warning' }, 'WarningMultipleMeasurementTypes');

export { dataTestIds as dataTestIdsWarningMultipleMeasurementTypes };

export interface WarningMultipleMeasurementTypes {
  metrics?: Metric[];
  scheduleDefinitions?: ScheduleDefinition[];
}

export const WarningMultipleMeasurementTypes: React.FC<WarningMultipleMeasurementTypes> = ({
  metrics = [],
  scheduleDefinitions = [],
}) => {
  const schedulesHaveMultipleMeasurementTypes = React.useMemo(
    () =>
      uniq(
        scheduleDefinitions.flatMap(scheduleDefinition =>
          getActionDefinitions(scheduleDefinition, { graphable: true }).map(
            ({ actionDefinition }) => actionDefinition.measurementType
          )
        )
      ).length > 1,
    [scheduleDefinitions]
  );

  const metricsHaveMultipleMeasurementTypes = React.useMemo(
    () => uniq(metrics.map(metric => metric.measurementType)).length > 1,
    [metrics]
  );

  const type = schedulesHaveMultipleMeasurementTypes
    ? 'Schedules'
    : metricsHaveMultipleMeasurementTypes
    ? 'Metrics'
    : undefined;

  return (
    <Show when={metricsHaveMultipleMeasurementTypes || schedulesHaveMultipleMeasurementTypes}>
      <Chip
        icon={<Warning />}
        label={`This widget has multiple ${type} with different Measurement Type. Please re-configure this widget to only have ${type} with the same Measurement Type.`}
        color="secondary"
        data-testid={dataTestIds.warning}
      />
    </Show>
  );
};

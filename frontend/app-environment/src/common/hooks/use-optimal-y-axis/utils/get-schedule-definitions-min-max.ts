import { getActionDefinitions, isNumericalMeasurementType } from '@plentyag/app-environment/src/common/utils';
import { ScheduleDefinition } from '@plentyag/core/src/farm-def/types';

export function getScheduleDefinitionsMinMax(scheduleDefinitions: ScheduleDefinition[]) {
  const mins = [];
  const maxs = [];

  scheduleDefinitions.filter(Boolean).forEach(scheduleDefinition => {
    getActionDefinitions(scheduleDefinition).forEach(({ actionDefinition }) => {
      if (!actionDefinition.graphable || !isNumericalMeasurementType(actionDefinition.measurementType)) {
        return;
      }

      actionDefinition.from && mins.push(actionDefinition.from);
      actionDefinition.to && maxs.push(actionDefinition.to);

      if (actionDefinition.oneOf) {
        actionDefinition.oneOf.forEach(oneOfItem => {
          const value = parseFloat(oneOfItem);
          mins.push(value);
          maxs.push(value);
        });
      }
    });
  });

  return {
    min: mins.length ? Math.min(...mins) : NaN,
    max: maxs.length ? Math.max(...maxs) : NaN,
  };
}

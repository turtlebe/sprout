import { ActionDefinition, ScheduleDefinition } from '@plentyag/core/src/farm-def/types';

export interface GetActionDefinitionsOptions {
  graphable: boolean;
}

export interface KeyAndActionDefinition {
  key: string;
  actionDefinition: ActionDefinition;
}

/**
 * Get an array of ActionDefinition for a given ScheduleDefinition.
 *
 * This function handles legacy/new ScheduleDefinitions and abstract that complexity for the rest of the code.
 *
 * Legacy Schedule Definition:
 *
 * The `supportedKeys` attribute in the ScheduleDefinition determines if we should use multiple or single value, it can be empty or
 * contain the expected keys for multiple values.
 *
 * When `supportedKeys` is empty, the schedule's setpoints has only one value. Example:
 *
 * "actions": [
 *   { "values": null, "valueType": "SINGLE_VALUE", "time": 3600, "value": '10' },
 *   { "values": null, "valueType": "SINGLE_VALUE", "time": 7200, "value": '20' }
 * ]
 *
 * When the `supportedKeys` is not empty, each key should be present in the `values` attribute of the Schedule's action.
 *
 * "actions": [
 *   { "values": { "zone2": "40","zone1": "20" }, "valueType": "MULTIPLE_VALUE", "time": 3600, "value": null },
 *   { "values": { "zone2": "60","zone1": "40" }, "valueType": "MULTIPLE_VALUE", "time": 7200, "value": null }
 * ]
 *
 * When using Single Values, we execute the callback once without a key. When using mutliple values
 *
 * New Schedule Definition:
 *
 * - When the scheduleDefinition has one ActionDefition under the `actionDefinition` attribute, we're dealing with a single value based schedule.
 * - When the scheduleDefinition has more than one ActionDefition under the `actionDefinitions` attribute, we're dealing with a multiple value based schedule.
 *
 */
export function getActionDefinitions(
  scheduleDefinition: ScheduleDefinition,
  options?: GetActionDefinitionsOptions
): KeyAndActionDefinition[] {
  if (!scheduleDefinition) {
    return [];
  }

  if (scheduleDefinition?.action?.supportedKeys?.length > 0) {
    const actionDefinition: ActionDefinition = {
      measurementType: scheduleDefinition.action.measurementType,
      graphable: true,
      defaultValue: undefined,
      ...scheduleDefinition.action.supportedValues,
    };
    return scheduleDefinition.action.supportedKeys.map(key => ({ key, actionDefinition }));
  } else if (scheduleDefinition.actionDefinitions) {
    const actionDefinitionsAndKeys = Object.keys(scheduleDefinition.actionDefinitions)
      .sort(
        // graphable should always be first.
        (a, b) =>
          Number(scheduleDefinition.actionDefinitions[b].graphable ?? true) -
          Number(scheduleDefinition.actionDefinitions[a].graphable ?? true)
      )
      .map(key => ({
        key,
        actionDefinition: scheduleDefinition.actionDefinitions[key],
      }));

    if (options) {
      return actionDefinitionsAndKeys.filter(
        ({ actionDefinition }) => actionDefinition.graphable === options.graphable
      );
    }

    return actionDefinitionsAndKeys;
  } else if (scheduleDefinition.actionDefinition) {
    return [
      {
        key: undefined,
        actionDefinition: scheduleDefinition.actionDefinition,
      },
    ];
  } else {
    const actionDefinition: ActionDefinition = {
      measurementType: scheduleDefinition.action.measurementType,
      graphable: true,
      defaultValue: undefined,
      ...scheduleDefinition.action.supportedValues,
    };
    return [{ key: undefined, actionDefinition }];
  }
}

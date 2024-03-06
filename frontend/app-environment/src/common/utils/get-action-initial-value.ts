import { ActionDefinition } from '@plentyag/core/src/farm-def/types';

export function getActionInitialValue(actionDefinition: ActionDefinition) {
  if (!actionDefinition) {
    return undefined;
  }

  if (actionDefinition.defaultValue) {
    return actionDefinition.defaultValue;
  }

  if (actionDefinition.oneOf && actionDefinition.oneOf.length > 0) {
    return actionDefinition.oneOf[0];
  }

  return actionDefinition.from.toString();
}

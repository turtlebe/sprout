import { AlertEventStatus } from '@plentyag/core/src/types/environment';

export function isTriggered(status: AlertEventStatus) {
  return [AlertEventStatus.triggered, AlertEventStatus.noDataTriggered].includes(status);
}

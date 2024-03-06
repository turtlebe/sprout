import { EVS_URLS } from '@plentyag/app-environment/src/common/utils';
import { useCoreStore } from '@plentyag/core/src/core-store';
import { Metric } from '@plentyag/core/src/types/environment';
import * as yup from 'yup';

export interface UseAlertRulesSnoozeFormGenConfig {
  metrics: Metric[];
}

export const useAlertRulesSnoozeFormGenConfig = ({ metrics }: UseAlertRulesSnoozeFormGenConfig): FormGen.Config => {
  const [coreState] = useCoreStore();
  // Get all alertRules associated with selected metrics, use flatMap to handle multi-alertRules per metric
  const alertRules = metrics.flatMap(metric => metric.alertRules);
  // Prepare updated alert rules structure to substitute the snoozedUntil value selected by the user
  const updatedAlertRules = snoozedUntil => {
    return alertRules.map(alertRule => ({
      ...alertRule,
      isEnabled: true,
      snoozedUntil,
      updatedBy: coreState.currentUser.username,
    }));
  };
  return {
    title: 'Snooze Alerts until',
    updateEndpoint: EVS_URLS.alertRules.bulkUpdateUrl(),
    serialize: values => ({ requests: updatedAlertRules(values.snoozedUntil) }),
    fields: [
      {
        type: 'KeyboardDateTimePicker',
        label: 'Snooze Until',
        name: 'snoozedUntil',
        validate: yup.string().required(),
      },
    ],
  };
};

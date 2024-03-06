import {
  useFetchAndConvertMetric,
  useFetchAndConvertScheduleWithDefinition,
  UseFetchAndConvertScheduleWithDefinitionReturn,
  useUnitConversion,
} from '@plentyag/app-environment/src/common/hooks';
import { convertUnitForAlertRule, EVS_URLS } from '@plentyag/app-environment/src/common/utils';
import { useGlobalSnackbar } from '@plentyag/brand-ui/src/components';
import { useCoreStore } from '@plentyag/core/src/core-store';
import { UseSwrAxiosReturn } from '@plentyag/core/src/hooks';
import { AlertRule, Metric } from '@plentyag/core/src/types/environment';
import { parseErrorMessage } from '@plentyag/core/src/utils';
import { axiosRequest } from '@plentyag/core/src/utils/request';
import { isEqual } from 'lodash';
import React from 'react';

import { copyAlertRule } from '../utils';

export interface UseMetricApi {
  metricId: string;
}

export interface UseMetricApiReturn {
  request: UseSwrAxiosReturn<Metric, unknown>;

  /**
   * The current Metric fetched from {@link request}.
   */
  metric: Metric;

  /**
   * The current AlertRules.
   */
  alertRules: AlertRule[];

  /**
   * The current Schedule and its ScheduleDefinition related to the current Metric.
   */
  scheduleAndDefinition: UseFetchAndConvertScheduleWithDefinitionReturn;

  /**
   * Return if the request to update AlertRules is currently pending.
   */
  isUpdating: boolean;

  /**
   * Update the AlertRules locally.
   *
   * This does not modify the AlertRules on the backend, to do so use {@see #persistAlertRules()} or {@see #updateAndPeristAlertRules()}
   */
  updateAlertRule: (alertRule: AlertRule) => void;

  /**
   * Update the AlertRules modified locally and persist the changes to the backend.
   */
  persistAlertRules: ({ onSuccess }: { onSuccess: () => void }) => void;

  /**
   * Update the AlertRules locally then persits the changes to the backend.
   */
  updateAndPersistAlertRules: (alertRules: AlertRule[], { onSuccess }: { onSuccess: () => void }) => void;

  /**
   * Restore the AlertRules to their state when they were loaded from the backend.
   */
  resetAlertRules: () => void;
}

export const useMetricApi = ({ metricId }: UseMetricApi): UseMetricApiReturn => {
  const [coreStore] = useCoreStore();
  const { convertToDefaultUnit } = useUnitConversion();
  const [initialAlertRules, setInitialAlertRules] = React.useState<AlertRule[]>([]);
  const [alertRules, setAlertRules] = React.useState<AlertRule[]>([]);
  const request = useFetchAndConvertMetric(metricId);
  const scheduleAndDefinition = useFetchAndConvertScheduleWithDefinition({ metric: request.data });
  const [isUpdating, setIsUpdating] = React.useState<boolean>(false);
  const snackbar = useGlobalSnackbar();

  React.useEffect(() => {
    if (request.data?.alertRules?.length > 0) {
      setInitialAlertRules(request.data.alertRules);
      setAlertRules(request.data.alertRules);
    }
  }, [request.data]);

  const updateAlertRule: UseMetricApiReturn['updateAlertRule'] = (newAlertRule: AlertRule) => {
    const updatedAlertRuleIndex = alertRules.findIndex(alertRule => alertRule.id === newAlertRule.id);

    setAlertRules([
      ...alertRules.slice(0, updatedAlertRuleIndex),
      { ...newAlertRule, updatedBy: coreStore.currentUser.username },
      ...alertRules.slice(updatedAlertRuleIndex + 1),
    ]);
  };

  const resetAlertRules: UseMetricApiReturn['resetAlertRules'] = () => {
    setAlertRules(initialAlertRules);
  };

  const updateAndPersistAlertRules: UseMetricApiReturn['updateAndPersistAlertRules'] = (
    newAlertRules,
    { onSuccess }
  ) => {
    setIsUpdating(true);
    // convert alertRules to use default unit and set updatedBy attribute.
    const newAlertRulesWithDefaultUnit = newAlertRules.map(alertRule => ({
      ...convertUnitForAlertRule(value => convertToDefaultUnit(value, request.data.measurementType))(alertRule),
      updatedBy: coreStore.currentUser.username,
    }));
    Promise.all(
      newAlertRulesWithDefaultUnit.map(async alertRule =>
        axiosRequest({ url: EVS_URLS.alertRules.updateUrl(alertRule), method: 'PUT', data: alertRule })
      )
    )
      .then(() => {
        void request.revalidate();
        snackbar.successSnackbar('Metric successfully updated.');
        onSuccess();
      })
      .catch(error => {
        snackbar.errorSnackbar({ message: parseErrorMessage(error) });
      })
      .finally(() => {
        setIsUpdating(false);
      });
  };

  const persistAlertRules: UseMetricApiReturn['persistAlertRules'] = ({ onSuccess }) => {
    const newAlertRules = alertRules
      .map(alertRule => copyAlertRule({ alertRule }))
      .filter((alertRule, index) => !isEqual(alertRule, initialAlertRules[index]));

    updateAndPersistAlertRules(newAlertRules, { onSuccess });
  };

  return {
    request,
    metric: request.data,
    alertRules,
    scheduleAndDefinition,
    isUpdating,
    persistAlertRules,
    resetAlertRules,
    updateAlertRule,
    updateAndPersistAlertRules,
  };
};

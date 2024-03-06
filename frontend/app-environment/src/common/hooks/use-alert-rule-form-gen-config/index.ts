import '@plentyag/core/src/yup/extension';
import { useUnitConversion } from '@plentyag/app-environment/src/common/hooks';
import {
  convertUnitForAlertRule,
  EVS_URLS,
  getAlertRuleTypeLabel,
  getAvailableAlertRuleTypes,
} from '@plentyag/app-environment/src/common/utils';
import { AlertRule, Metric } from '@plentyag/core/src/types/environment';
import { toMinutes, toSeconds } from '@plentyag/core/src/utils';
import * as yup from 'yup';

import { AlertRuleTypeTooltip } from './alert-rule-type-tooltip';
import { DurationWindowTooltip } from './duration-window-tooltip';
import { NoDataTimeoutTooltip } from './no-data-timeout-tooltip';
import { StatelessTooltip } from './stateless-tooltip';

export interface UseAlertRuleFormGenConfig {
  metric: Metric;
  alertRule?: AlertRule;
  username: string;
}

export interface UseAlertRuleFormGenConfigReturn extends FormGen.Config<AlertRule> {}

export const useAlertRuleFormGenConfig = ({
  metric,
  alertRule,
  username,
}: UseAlertRuleFormGenConfig): UseAlertRuleFormGenConfigReturn => {
  const { convertToDefaultUnit } = useUnitConversion();
  const isUpdating = Boolean(alertRule);
  const createdOrUpdatedBy = isUpdating ? 'updatedBy' : 'createdBy';

  return {
    title: isUpdating ? 'Edit AlertRule' : 'Create Alert Rule',
    createEndpoint: EVS_URLS.alertRules.createUrl(),
    updateEndpoint: EVS_URLS.alertRules.updateUrl(alertRule),
    serialize: values => {
      const observationKey =
        !isUpdating && values.includeBaseDerivedDefinitions
          ? { path: metric?.path, observationName: metric?.observationName }
          : undefined;

      const alertRule: AlertRule = {
        metricId: metric?.id,
        observationKey,
        ...values,
        durationWindowSize: toSeconds(values.durationWindowSize),
        durationWindowSizeResolve: toSeconds(values.durationWindowSizeResolve),
        noDataTimeout: toSeconds(values.noDataTimeout),
        [createdOrUpdatedBy]: username,
      };

      if (!isUpdating) {
        return alertRule;
      }

      // When Updating, convert AlertRule to use default unit.
      return convertUnitForAlertRule(value => convertToDefaultUnit(value, metric.measurementType))(alertRule);
    },
    deserialize: values => ({
      ...values,
      durationWindowSize: toMinutes(values.durationWindowSize),
      durationWindowSizeResolve: toMinutes(values.durationWindowSizeResolve),
      noDataTimeout: toMinutes(values.noDataTimeout),
    }),
    //
    // /!\ We don't need a deserializer to convert units here because the AlertRules are loaded with the Metric
    // with `useMetricApi` and unit conversion to preferred unit is already handled there.
    //
    fields: [
      {
        type: 'Select',
        name: 'alertRuleType',
        label: 'AlertRuleType',
        options: getAvailableAlertRuleTypes(metric).map(type => ({
          label: getAlertRuleTypeLabel(type),
          value: type,
        })),
        validate: yup.string().required(),
        tooltip: AlertRuleTypeTooltip,
      },
      {
        type: 'KeyboardDateTimePicker',
        name: 'startsAt',
        label: 'Start Time',
        validate: yup.string().noMomentError().required(),
        tooltip: AlertRuleTypeTooltip,
      },
      {
        type: 'KeyboardDateTimePicker',
        name: 'endsAt',
        label: 'End Time',
        validate: yup.string().noMomentError().nullable(),
      },
      {
        type: 'TextField',
        name: 'priority',
        label: 'Priority',
        textFieldProps: { type: 'number' },
        default: 1,
        validate: yup.number().moreThan(0).required(),
      },
      {
        type: 'Select',
        name: 'isEnabled',
        label: 'Enabled',
        default: true,
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false },
        ],
      },
      {
        type: 'TextField',
        name: 'description',
        label: 'Description',
      },
      {
        type: 'TextField',
        name: 'durationWindowSize',
        label: 'Duration Window (minutes)',
        textFieldProps: { type: 'number' },
        validate: yup.number().min(0).nullable(),
        tooltip: DurationWindowTooltip,
      },
      {
        type: 'TextField',
        name: 'durationWindowSizeResolve',
        label: 'Resolve Duration Window (minutes)',
        textFieldProps: { type: 'number' },
        validate: yup.number().min(0).nullable(),
        tooltip: DurationWindowTooltip,
      },
      {
        type: 'TextField',
        name: 'noDataTimeout',
        label: 'No Data Timeout (minutes)',
        textFieldProps: { type: 'number' },
        validate: yup.number().min(0).nullable(),
        tooltip: NoDataTimeoutTooltip,
      },
      {
        type: 'Checkbox',
        name: 'isStateless',
        label: 'Stateless',
        tooltip: StatelessTooltip,
      },
      {
        if: () => !isUpdating,
        fields: [
          {
            type: 'Checkbox',
            name: 'includeBaseDerivedDefinitions',
            label: 'Generate Base and Derived ObservationDefinitions?',
          },
        ],
      },
    ],
  };
};

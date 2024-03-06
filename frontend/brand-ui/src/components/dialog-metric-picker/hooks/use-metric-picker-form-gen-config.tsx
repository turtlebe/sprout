import { AlertRule, Metric } from '@plentyag/core/src/types/environment';
import * as yup from 'yup';

export interface UseMetricPickerFormGenConfig {
  renderAlertRule?: (alertRule: AlertRule) => React.ReactNode;
}

export interface UseMetricPickerFormGenConfigReturn extends FormGen.Config {}

export interface UseMetricPickerFormGenValues {
  path: string;
  measurementType: string;
  metric: Metric;
  alertRule?: AlertRule;
}

export const useMetricPickerFormGenConfig = ({ renderAlertRule }): UseMetricPickerFormGenConfigReturn => {
  return {
    deserialize: values => {
      return { ...values, metric: values };
    },
    fields: [
      {
        type: 'AutocompleteFarmDefObject',
        name: 'path',
        label: 'Path',
        onChange: object => object.path,
        validate: yup.string().required(),
      },
      {
        computed: values => {
          return [
            {
              type: 'AutocompleteMetricMeasurementType',
              name: 'measurementType',
              label: 'Measurement Type',
              validate: yup.string().required(),
              level: 'measurementType',
              path: values.path || '',
              autocompleteProps: { disabled: Boolean(!values.path) },
            },
          ];
        },
      },
      {
        computed: values => {
          return [
            {
              type: 'AutocompleteMetric',
              name: 'metric',
              label: 'Observation Name',
              validate: yup.mixed().required(),
              path: values.path,
              measurementType: values.measurementType,
              autocompleteProps: {
                disabled: Boolean(!values.measurementType),
              },
            },
          ];
        },
      },
      {
        computed: values => {
          return values?.metric?.alertRules?.length && renderAlertRule
            ? [
                {
                  type: 'Select',
                  name: 'alertRule',
                  label: 'Alert Rule',
                  options: values.metric?.alertRules?.map((alertRule: AlertRule) => ({
                    label: renderAlertRule(alertRule),
                    value: alertRule,
                  })),
                  validate: yup.mixed().required(),
                  selectProps: {
                    disabled: Boolean(!values.metric),
                  },
                },
              ]
            : [];
        },
      },
    ],
  };
};

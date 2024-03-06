import { useUnitConversion } from '@plentyag/app-environment/src/common/hooks';
import { EVS_URLS } from '@plentyag/app-environment/src/common/utils';
import { Metric } from '@plentyag/core/src/types/environment';
import { isEqual, omit } from 'lodash';
import * as yup from 'yup';

const inputContainerStyle = { width: '900px' };

export interface UseMetricFormGenConfig {
  metric?: Metric;
  username: string;
}

export interface UseMetricFormGenConfigReturn extends FormGen.Config {}

export const useMetricFormGenConfig = ({ metric, username }: UseMetricFormGenConfig): UseMetricFormGenConfigReturn => {
  const isUpdating = Boolean(metric);
  const createdOrUpdatedBy = isUpdating ? 'updatedBy' : 'createdBy';
  const { convertToDefaultUnit, getPreferredUnit } = useUnitConversion();

  return {
    title: isUpdating ? 'Edit Metric' : 'Create Metric',
    createEndpoint: EVS_URLS.metrics.createUrl(),
    updateEndpoint: EVS_URLS.metrics.updateUrl(metric),
    serialize: values => ({
      ...omit(values, ['min', 'max']),
      unitConfig: {
        min: convertToDefaultUnit(values.min, values.measurementType),
        max: convertToDefaultUnit(values.max, values.measurementType),
      },
      measurementType: values.measurementType,
      [createdOrUpdatedBy]: username,
    }),
    deserialize: values => {
      if (isEqual(values, {})) {
        return values;
      }

      return {
        ...omit(values, ['unitConfig']),
        //
        // /!\ We don't need to convert units here because the Metric is loaded with `useMetricApi`
        // and conversions to preferred unit are already handled there.
        //
        min: values?.unitConfig?.min,
        max: values?.unitConfig?.max,
      };
    },
    fields: [
      {
        type: 'AutocompleteFarmDefObject',
        name: 'path',
        label: 'Path',
        showObservationStats: true,
        onChange: object => object.path,
        validate: yup.string().required(),
        inputContainerStyle,
      },
      {
        computed: values => {
          return [
            {
              type: 'AutocompleteObservationGroup',
              name: 'measurementType',
              label: 'Measurement Type',
              validate: yup.string().required(),
              inputContainerStyle,
              level: 'measurementType',
              path: values.path,
              autocompleteProps: { disabled: Boolean(!values.path) },
            },
          ];
        },
      },
      {
        computed: values => {
          return [
            {
              type: 'AutocompleteObservationGroup',
              name: 'observationName',
              label: 'Observation Name',
              validate: yup.string().required(),
              inputContainerStyle,
              level: 'observationName',
              path: values.path,
              measurementType: values.measurementType,
              autocompleteProps: { disabled: Boolean(!values.path) },
            },
          ];
        },
      },
      {
        computed: values => {
          const preferredUnitSymbol =
            values.measurementType && getPreferredUnit(values.measurementType).symbol
              ? `(${getPreferredUnit(values.measurementType).symbol})`
              : '';

          return [
            {
              type: 'TextField',
              name: 'min',
              label: `Min ${preferredUnitSymbol}`,
              validate: yup.number().required(),
              textFieldProps: { disabled: Boolean(!values.measurementType) },
              inputContainerStyle,
            },
            {
              type: 'TextField',
              name: 'max',
              label: `Max ${preferredUnitSymbol}`,
              validate: yup.number().required(),
              textFieldProps: { disabled: Boolean(!values.measurementType) },
              inputContainerStyle,
            },
          ];
        },
      },
    ],
  };
};

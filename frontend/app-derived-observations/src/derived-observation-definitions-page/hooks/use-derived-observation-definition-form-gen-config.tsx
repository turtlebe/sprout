import { getWindowDurationLabel } from '@plentyag/app-derived-observations/src/common/utils';
import { useFetchMeasurementTypes } from '@plentyag/core/src/hooks';
import { DerivedObservationDefinition, Output, WindowDuration } from '@plentyag/core/src/types/derived-observations';
import { isEqual, omit } from 'lodash';
import * as yup from 'yup';

const createEndpoint =
  '/api/swagger/environment-service/derived-observation-definitions-api/create-derived-observation-definition';
const getUpdateEndpointUrl = (definition: DerivedObservationDefinition) =>
  `/api/swagger/environment-service/derived-observation-definitions-api/update-derived-observation-definition/${definition?.id}`;

export interface UseDerivedObservationDefinitionFormGenConfig {
  definition?: DerivedObservationDefinition;
  username: string;
}

export interface UseDerivedObservationDefinitionFormGenConfigReturn extends FormGen.Config {}

export const useDerivedObservationDefinitionFormGenConfig = ({
  definition,
  username,
}: UseDerivedObservationDefinitionFormGenConfig): UseDerivedObservationDefinitionFormGenConfigReturn => {
  const isUpdating = Boolean(definition);
  const createdOrUpdatedBy = isUpdating ? 'updatedBy' : 'createdBy';
  const { measurementTypes } = useFetchMeasurementTypes();

  return {
    title: isUpdating ? 'Edit Derived Observation Definition' : 'Create Derived Observation Definition',
    createEndpoint,
    updateEndpoint: getUpdateEndpointUrl(definition),
    serialize: values => {
      if (!values) {
        return values;
      }

      return {
        ...omit(values, ['outputMeasurementType', 'path', 'observationName']),
        observationKey: { path: values.path, observationName: values.observationName },
        outputMeasurementType: values.outputMeasurementType.key,
        [createdOrUpdatedBy]: username,
      };
    },
    deserialize: values => {
      if (isEqual(values, {})) {
        return {};
      }

      const outputMeasurementType = measurementTypes.find(
        measurementType => measurementType.key === values.outputMeasurementType
      );

      return {
        ...omit(values, ['observationKey', 'outputMeasurementType']),
        path: values.observationKey.path,
        observationName: values.observationKey.observationName,
        outputMeasurementType,
      };
    },
    fields: [
      {
        type: 'TextField',
        name: 'streamName',
        label: 'Stream Name',
        validate: yup.string().required(),
      },
      {
        type: 'Select',
        name: 'window',
        label: 'Window Duration',
        options: Object.values(WindowDuration).map(duration => ({
          label: getWindowDurationLabel(duration),
          value: duration,
        })),
        validate: yup.string().required(),
      },
      {
        computed: values => {
          const sourceStreamNames: FormGen.FieldAutocompleteObservationDefinition = {
            type: 'AutocompleteObservationDefinition',
            name: 'sourceStreamNames',
            label: 'Source Stream Names',
            valueSelector: 'streamName',
            window: values.window,
            autocompleteProps: { disabled: Boolean(!values.window), multiple: true, disableCloseOnSelect: true },
            validate: yup.mixed().required(),
            inputContainerStyle: isUpdating ? { borderTop: 'unset' } : undefined,
          };

          if (!isUpdating) {
            return [sourceStreamNames];
          }

          return [
            {
              type: 'Typography',
              name: 'previousSourceStreamNamesHeader',
              label: 'Current Source Stream Names:',
              typographyProps: { variant: 'subtitle1' },
              inputContainerStyle: { borderTop: 'unset', borderBottom: 'unset', paddingBottom: 0, marginBottom: 0 },
            },
            {
              type: 'Typography',
              name: 'previousSourceStreamNames',
              label: values?.sourceStreamNames?.join(', '),
              typographyProps: { variant: 'subtitle2' },
              inputContainerStyle: { borderTop: 'unset', borderBottom: 'unset', marginBottom: 0 },
            },
            sourceStreamNames,
          ];
        },
      },

      {
        type: 'TextField',
        name: 'expression',
        label: 'Expression',
        validate: yup.string().required(),
      },
      {
        type: 'Select',
        name: 'output',
        label: 'Output',
        options: Object.values(Output),
        validate: yup.string().required(),
      },
      {
        type: 'AutocompleteFarmDefObject',
        name: 'path',
        label: 'Output Path',
        onChange: object => object.path,
        validate: yup.mixed().required(),
      },
      {
        type: 'TextField',
        name: 'observationName',
        label: 'Output Observation Name',
        validate: yup
          .string()
          .required()
          .matches(/^[A-Z][a-z0-9]+(?:[A-Z][a-z0-9]+)*$/, {
            message: 'Please enter a valid Observation Name',
          }),
      },
      {
        type: 'AutocompleteFarmDefType',
        name: 'outputMeasurementType',
        label: 'Output Measurement Type',
        kind: 'measurementType',
        valueSelector: null,
        validate: yup.string().required(),
      },
      {
        computed: values => [
          {
            type: 'TextField',
            name: 'outputMeasurementTypeUnits',
            label: 'Output Unit',
            default: values.outputMeasurementType?.defaultUnit,
            textFieldProps: { disabled: true },
          },
        ],
      },
    ],
  };
};

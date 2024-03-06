import { getWindowDurationLabel } from '@plentyag/app-derived-observations/src/common/utils';
import { when } from '@plentyag/brand-ui/src/components/form-gen';
import { useFetchObservationGroups } from '@plentyag/core/src/hooks/use-fetch-observation-groups';
import {
  Aggregation,
  BaseObservationDefinition,
  Output,
  WindowDuration,
} from '@plentyag/core/src/types/derived-observations';
import { isEqual, omit } from 'lodash';
import * as yup from 'yup';

const createEndpoint =
  '/api/swagger/environment-service/derived-observation-definitions-api/create-base-observation-definition';
const getUpdateEndpointUrl = (definition: BaseObservationDefinition) =>
  `/api/swagger/environment-service/derived-observation-definitions-api/update-base-observation-definition/${definition?.id}`;

export interface UseBaseObservationDefinitionFormGenConfig {
  definition?: BaseObservationDefinition;
  username: string;
}

export interface UseBaseObservationDefinitionFormGenConfigReturn extends FormGen.Config {}

export const useBaseObservationDefinitionFormGenConfig = ({
  definition,
  username,
}: UseBaseObservationDefinitionFormGenConfig): UseBaseObservationDefinitionFormGenConfigReturn => {
  const isUpdating = Boolean(definition);
  const createdOrUpdatedBy = isUpdating ? 'updatedBy' : 'createdBy';
  const { observationGroups } = useFetchObservationGroups();

  return {
    title: `${isUpdating ? 'Edit' : 'Create'} Base Observation Definition`,
    createEndpoint,
    updateEndpoint: getUpdateEndpointUrl(definition),
    serialize: values => {
      if (!values) {
        return values;
      }

      const { path, observationName } = values;
      return {
        ...omit(values, ['path', 'measurementType', 'observationName']),
        observationKey: {
          path,
          observationName,
        },
        [createdOrUpdatedBy]: username,
      };
    },
    deserialize: values => {
      if (isEqual(values, {})) {
        return {};
      }

      const { path, observationName } = values.observationKey;
      const observationGroup = observationGroups.find(
        group => path === group.path && observationName === group.observationName
      );

      return {
        ...omit(values, ['observationKey']),
        path,
        measurementType: observationGroup.measurementType,
        observationName,
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
        type: 'AutocompleteObservationGroup',
        name: 'path',
        label: 'Path',
        level: 'path',
        validate: yup.string().required(),
      },
      {
        computed: values => [
          {
            type: 'AutocompleteObservationGroup',
            name: 'measurementType',
            label: 'Measurement Type',
            validate: yup.string().required(),
            level: 'measurementType',
            path: values.path,
            autocompleteProps: { disabled: Boolean(!values.path) },
          },
        ],
      },
      {
        computed: values => [
          {
            type: 'AutocompleteObservationGroup',
            name: 'observationName',
            label: 'Observation Name',
            validate: yup.string().required(),
            level: 'observationName',
            path: values.path,
            measurementType: values.measurementType,
            autocompleteProps: { disabled: Boolean(!values.measurementType) },
          },
        ],
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
        type: 'Select',
        name: 'output',
        label: 'Output',
        options: Object.values(Output),
        validate: yup.string().required(),
      },
      {
        type: 'Select',
        name: 'aggregation',
        label: 'Aggregation',
        options: Object.values(Aggregation),
        validate: yup.string().required(),
      },
      {
        if: when(['aggregation'], aggregation => aggregation === Aggregation.uptime),
        fields: [
          {
            type: 'TextField',
            name: 'uptimeRuleId',
            label: 'Uptime AlertRule ID',
            validate: yup.string().required(),
          },
        ],
      },
      {
        type: 'TextField',
        name: 'comment',
        label: 'Comment',
      },
    ],
  };
};

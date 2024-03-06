import { Tag } from '@plentyag/app-ignition-tag-registry/src/common/types';
import { useFetchMeasurementTypes } from '@plentyag/core/src/hooks';
import { get, isEqual, omit } from 'lodash';
import * as yup from 'yup';

import { useFetchTagProviders } from '.';

export interface UseTagsFormGenConfig {
  tag?: Tag;
  username: string;
}

export interface UseTagsFormGenConfigReturn extends FormGen.Config {}

export const useTagsFormGenConfig = ({ tag, username }: UseTagsFormGenConfig): UseTagsFormGenConfigReturn => {
  const isUpdating = Boolean(tag);
  const createdOrUpdatedBy = isUpdating ? 'updatedBy' : 'createdBy';
  const { measurementTypes, isLoading: isMeasurementTypesValidating } = useFetchMeasurementTypes();
  const { tagProviders, isLoading: isTagProvidersValidating } = useFetchTagProviders();

  return {
    isLoading: isTagProvidersValidating || isMeasurementTypesValidating,
    createEndpoint: '/api/swagger/farm-def-service/tags-api/create-tag',
    updateEndpoint: `/api/swagger/farm-def-service/tags-api/update-tag/${tag?.uid}`,
    serialize: values => {
      return {
        ...omit(values, ['measurementType']),
        measurementType: values['measurementType'].key,
        deviceType: '',
        [createdOrUpdatedBy]: username,
      };
    },
    deserialize: values => {
      if (isEqual(values, {})) {
        return values;
      }

      return {
        ...values,
        tags: values.tags.map(tag => ({
          ...tag,
          measurementType: measurementTypes.find(m => m.key === tag.measurementType),
        })),
      };
    },
    fields: [
      {
        type: 'group',
        enableCloning: true,
        name: 'tags',
        fields: groupIndex => [
          {
            type: 'AutocompleteFarmDefObject',
            name: 'path',
            label: 'Path',
            onChange: object => object.path,
            validate: yup.string().required(),
          },
          {
            type: 'Select',
            label: 'Tag Provider',
            name: 'tagProvider',
            validate: yup.string().required(),
            options: tagProviders,
            inputContainerStyle: { width: '300px' },
          },
          {
            computed: values => {
              const tagProvider = get(values, `tags[${groupIndex}].tagProvider`);

              return [
                {
                  type: 'AutocompleteRemote',
                  name: 'tagPath',
                  label: 'Tag Path',
                  url: `/api/swagger/ignition-ingest-service/ignition-tag-api/tag-paths/${tagProvider}`,
                  transformResponse: data => data || [],
                  validate: yup.string().required(),
                  inputContainerStyle: { width: '900px' },
                },
              ];
            },
          },
          {
            type: 'TextField',
            name: 'measurementName',
            label: 'Observation Name',
            validate: yup
              .string()
              .required()
              .matches(/^[A-Z]+[a-z0-9]*(?:[A-Z]+[a-z0-9]*)*$/, {
                message: 'Please enter a valid Observation Name',
              }),
            inputContainerStyle: { width: '200px' },
          },
          {
            type: 'AutocompleteFarmDefType',
            kind: 'measurementType',
            label: 'Measurement Type',
            name: 'measurementType',
            valueSelector: null,
            validate: yup.string().required(),
            inputContainerStyle: { width: '200px' },
          },
          {
            computed: values => {
              const measurementType = get(values, `tags[${groupIndex}].measurementType`);
              const options = measurementType ? Object.keys(measurementType.supportedUnits) : [];

              return [
                {
                  type: 'Select',
                  name: 'measurementUnit',
                  label: 'Unit',
                  validate: yup.string().required(),
                  options,
                  inputContainerStyle: { width: '100px' },
                },
              ];
            },
          },
          {
            type: 'TextField',
            name: 'min',
            label: 'Min',
            validate: yup.number().optional(),
            inputContainerStyle: { width: '175px' },
          },
          {
            type: 'TextField',
            name: 'max',
            label: 'Max ',
            validate: yup.number().optional(),
            inputContainerStyle: { width: '175px' },
          },
        ],
      },
    ],
  };
};

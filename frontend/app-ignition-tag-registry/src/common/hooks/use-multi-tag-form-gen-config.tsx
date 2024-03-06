import { tagsTableCols } from '@plentyag/app-ignition-tag-registry/src/common/types';
import { TooltipColumnDescription } from '@plentyag/brand-ui/src/components';
import { useFetchMeasurementTypes } from '@plentyag/core/src/hooks';
import { isEqual, omit } from 'lodash';
import * as yup from 'yup';

import { useFetchTagProviders } from '.';

export interface UseMultiTagFormGenConfig {
  username: string;
}

export interface UseMultiTagFormGenConfigReturn extends FormGen.Config {}

export const useMultiTagFormGenConfig = ({ username }: UseMultiTagFormGenConfig): UseMultiTagFormGenConfigReturn => {
  const createdOrUpdatedBy = 'createdBy';
  const { measurementTypes, isLoading: isMeasurementTypesValidating } = useFetchMeasurementTypes();
  const { tagProviders, isLoading: isTagProvidersValidating } = useFetchTagProviders();

  return {
    isLoading: isTagProvidersValidating || isMeasurementTypesValidating,
    createEndpoint: '/api/swagger/farm-def-service/tags-api/create-tag',
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
      const measurementTypeObj = measurementTypes.find(m => m.key === values.measurementType);

      return {
        ...values,
        measurementType: measurementTypeObj,
      };
    },
    fields: [
      {
        type: 'Select',
        label: 'Tag Provider',
        name: 'tagProvider',
        validate: yup.string().required(),
        options: tagProviders,
      },
      {
        computed: values => {
          const tagProvider = values.tagProvider;

          return [
            {
              type: 'AutocompleteRemote',
              name: 'tagPath',
              label: 'Tag Path',
              url: `/api/swagger/ignition-ingest-service/ignition-tag-api/tag-paths/${tagProvider}`,
              transformResponse: data => data || [],
              validate: yup.string().required(),
              autocompleteProps: { multiple: true },
            },
          ];
        },
      },
      {
        type: 'AutocompleteFarmDefObject',
        name: 'path',
        label: 'Path',
        onChange: object => object.path,
        validate: yup.string(),
      },
      {
        type: 'TextField',
        name: 'measurementName',
        label: 'Observation Name',
        validate: yup.string().matches(/^[A-Z]+[a-z0-9]*(?:[A-Z]+[a-z0-9]*)*$/, {
          message: 'Please enter a valid Observation Name',
        }),
        tooltip: TooltipColumnDescription,
      },
      {
        type: 'AutocompleteFarmDefType',
        kind: 'measurementType',
        label: 'Measurement Type',
        name: 'measurementType',
        valueSelector: null,
        validate: yup.string(),
      },
      {
        computed: values => {
          const measurementType = values.measurementType;
          const options = measurementType ? Object.keys(measurementType.supportedUnits) : [];

          return [
            {
              type: 'Select',
              name: 'measurementUnit',
              label: 'Measurement Unit',
              validate: yup.string(),
              options,
            },
          ];
        },
      },
      {
        type: 'TextField',
        name: 'min',
        label: 'Min',
        validate: yup.number().optional(),
      },
      {
        type: 'TextField',
        name: 'max',
        label: 'Max ',
        validate: yup.number().optional(),
      },
    ],
    context: { tableCols: tagsTableCols },
  };
};

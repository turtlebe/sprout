import { mockMeasurementTypes } from '@plentyag/core/src/farm-def/test-helpers';
import { sortBy } from 'lodash';
import React from 'react';

import { AutocompleteRemote } from '../autocomplete-remote';
import { makeOptions, renderFormGenInputAsync } from '../test-helpers';

import { AutocompleteFarmDefType, transformFarmDefTypeData } from '.';

jest.mock('../autocomplete-remote');

const MockAutocompleteRemote = AutocompleteRemote as any;

const options = makeOptions({});

describe('transformData', () => {
  it('extracts name and description from the MeasurementType', () => {
    expect(transformFarmDefTypeData()(mockMeasurementTypes)).toEqual(
      sortBy(
        mockMeasurementTypes.map(measurementType => ({
          label: measurementType.description,
          value: measurementType.name,
        })),
        ['label']
      )
    );
  });

  it('sets the value as the key', () => {
    expect(transformFarmDefTypeData({ valueSelector: 'key' })(mockMeasurementTypes)).toEqual(
      sortBy(
        mockMeasurementTypes.map(measurementType => ({
          label: measurementType.description,
          value: measurementType.key,
        })),
        ['label']
      )
    );
  });

  it('sets the value as the MeasurementType object', () => {
    expect(transformFarmDefTypeData({ valueSelector: null })(mockMeasurementTypes)).toEqual(
      sortBy(
        mockMeasurementTypes.map(measurementType => ({
          label: measurementType.description,
          value: measurementType,
        })),
        ['label']
      )
    );
  });
});

describe('AutocompleteFarmDefType', () => {
  it('forwards properties to AutocompleteRemote', async () => {
    MockAutocompleteRemote.type.mockImplementation(({ formGenField }) => {
      expect(formGenField.type).toBe('AutocompleteRemote');
      expect(formGenField.url).toContain('/farm-def-service/search-measurement-types');
      expect(formGenField.transformResponse).toBeDefined();

      return <></>;
    });

    await renderFormGenInputAsync(AutocompleteFarmDefType, options({ formGenField: { kind: 'measurementType' } }));

    expect.assertions(3);
  });

  it('forwards properties to AutocompleteRemote (kind: skuType)', async () => {
    MockAutocompleteRemote.type.mockImplementation(({ formGenField }) => {
      expect(formGenField.type).toBe('AutocompleteRemote');
      expect(formGenField.url).toContain('/farm-def-service/search-sku-types');
      expect(formGenField.transformResponse).toBeDefined();

      return <></>;
    });

    await renderFormGenInputAsync(AutocompleteFarmDefType, options({ formGenField: { kind: 'skuType' } }));

    expect.assertions(3);
  });
});

import React from 'react';

import { AutocompleteRemote } from '../autocomplete-remote';
import { makeOptions, renderFormGenInputAsync } from '../test-helpers';

import { AutocompleteMetricMeasurementType, getMeasurementTypesUrl, transformData } from '.';

jest.mock('../autocomplete-remote');

const MockAutocompleteRemote = AutocompleteRemote as any;

const options = makeOptions({});

describe('transformData', () => {
  it('converts the array to an array of FormGen.ValueLabel', () => {
    expect(transformData()(['TEMPERATURE'])).toEqual([{ label: 'TEMPERATURE', value: 'TEMPERATURE' }]);
  });
});

describe('AutocompleteFarmDefType', () => {
  it('forwards properties to AutocompleteRemote', async () => {
    MockAutocompleteRemote.type.mockImplementation(({ formGenField }) => {
      expect(formGenField.type).toBe('AutocompleteRemote');
      expect(formGenField.url).toContain(getMeasurementTypesUrl('sites/SSF2'));
      expect(formGenField.transformResponse).toBeDefined();

      return <></>;
    });

    await renderFormGenInputAsync(AutocompleteMetricMeasurementType, options({ formGenField: { path: 'sites/SSF2' } }));

    expect.assertions(3);
  });
});

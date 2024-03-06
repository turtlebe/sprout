import { buildPaginatedResponse } from '@plentyag/core/src/test-helpers';
import { Metric } from '@plentyag/core/src/types/environment';
import React from 'react';

import { AutocompleteRemote } from '../autocomplete-remote';
import { makeOptions, renderFormGenInputAsync } from '../test-helpers';

import { AutocompleteMetric, getMetricsSearchUrl, transformData } from '.';

jest.mock('../autocomplete-remote');

const MockAutocompleteRemote = AutocompleteRemote as any;

const options = makeOptions({});

const metrics = [
  { id: 1, observationName: 'PodTemperature' } as unknown as Metric,
  { id: 2, observationName: 'AirTemperature' } as unknown as Metric,
];

describe('transformData', () => {
  it('uses the observationName as label', () => {
    expect(transformData({})(buildPaginatedResponse(metrics))).toEqual([
      { label: 'AirTemperature', value: metrics[1] },
      { label: 'PodTemperature', value: metrics[0] },
    ]);
  });

  it('supports valueSelector', () => {
    expect(transformData({ valueSelector: 'observationName' })(buildPaginatedResponse(metrics))).toEqual([
      { label: 'AirTemperature', value: 'AirTemperature' },
      { label: 'PodTemperature', value: 'PodTemperature' },
    ]);
  });
});

describe('AutocompleteFarmDefType', () => {
  it('forwards properties to AutocompleteRemote', async () => {
    MockAutocompleteRemote.type.mockImplementation(({ formGenField }) => {
      expect(formGenField.type).toBe('AutocompleteRemote');
      expect(formGenField.url).toContain(getMetricsSearchUrl('sites/SSF2', 'TEMPERATURE'));
      expect(formGenField.transformResponse).toBeDefined();

      return <></>;
    });

    await renderFormGenInputAsync(
      AutocompleteMetric,
      options({ formGenField: { path: 'sites/SSF2', measurementType: 'TEMPERATURE' } })
    );

    expect.assertions(3);
  });
});

import React from 'react';

import { AutocompleteRemote } from '../autocomplete-remote';
import { makeOptions, renderFormGenInputAsync } from '../test-helpers';

import { AutocompleteCrop, transformVisData, VIS_ENDPOINT } from '.';

jest.mock('../autocomplete-remote');

const MockAutocompleteRemote = AutocompleteRemote as any;

const MOCK_VARIETAL_RESPONSE = {
  varietals: {
    B10: { crop: 'Baby Kale' },
    B11: { crop: 'Baby Kale (WHR)' },
    B20: { crop: 'Baby Arugula' },
  },
};

const options = makeOptions({});

describe('transformData', () => {
  it('sorts VIS data by crop', () => {
    expect(transformVisData()(MOCK_VARIETAL_RESPONSE)).toEqual([
      { label: 'Baby Arugula B20', value: 'B20' },
      { label: 'Baby Kale (WHR) B11', value: 'B11' },
      { label: 'Baby Kale B10', value: 'B10' },
    ]);
  });

  it('filters VIS data based on an allowList', () => {
    expect(
      transformVisData({
        allowList: ['B20', 'B10'],
      })(MOCK_VARIETAL_RESPONSE)
    ).toEqual([
      { label: 'Baby Arugula B20', value: 'B20' },
      { label: 'Baby Kale B10', value: 'B10' },
    ]);
  });

  it('allows extra crop', () => {
    expect(
      transformVisData({
        allowList: ['B20', 'B10'],
        extra: ['Other'],
      })(MOCK_VARIETAL_RESPONSE)
    ).toEqual([
      { label: 'Baby Arugula B20', value: 'B20' },
      { label: 'Baby Kale B10', value: 'B10' },
      { label: 'Other', value: 'Other' },
    ]);
  });

  it('allows extra crop as FormGen.ValueLabel', () => {
    expect(
      transformVisData({
        allowList: ['B20', 'B10'],
        extra: [{ label: 'Other', value: 'other' }],
      })(MOCK_VARIETAL_RESPONSE)
    ).toEqual([
      { label: 'Baby Arugula B20', value: 'B20' },
      { label: 'Baby Kale B10', value: 'B10' },
      { label: 'Other', value: 'other' },
    ]);
  });
});

describe('AutocompleteCrop', () => {
  it('forwards properties to AutocompleteRemote', async () => {
    MockAutocompleteRemote.type.mockImplementation(({ formGenField }) => {
      expect(formGenField.type).toBe('AutocompleteRemote');
      expect(formGenField.url).toBe(VIS_ENDPOINT);
      expect(formGenField.transformResponse).toBeDefined();

      return <></>;
    });

    await renderFormGenInputAsync(AutocompleteCrop, options());

    expect.assertions(3);
  });

  it('allows to pass extra crop', async () => {
    MockAutocompleteRemote.type.mockImplementation(({ formGenField }) => {
      expect(formGenField.type).toBe('AutocompleteRemote');
      expect(formGenField.url).toBe(VIS_ENDPOINT);
      expect(formGenField.transformResponse(MOCK_VARIETAL_RESPONSE)).toContainEqual({ label: 'Other', value: 'Other' });

      return <></>;
    });

    await renderFormGenInputAsync(
      AutocompleteCrop,
      options({
        formGenField: { extra: ['Other'] },
      })
    );

    expect.assertions(3);
  });

  it('allows to pass extra crop as FormGen.ValueLabel', async () => {
    MockAutocompleteRemote.type.mockImplementation(({ formGenField }) => {
      expect(formGenField.type).toBe('AutocompleteRemote');
      expect(formGenField.url).toBe(VIS_ENDPOINT);
      expect(formGenField.transformResponse(MOCK_VARIETAL_RESPONSE)).toContainEqual({ label: 'Other', value: 'other' });

      return <></>;
    });

    await renderFormGenInputAsync(
      AutocompleteCrop,
      options({
        formGenField: { extra: [{ label: 'Other', value: 'other' }] },
      })
    );

    expect.assertions(3);
  });
});

import { FarmDefCrop } from '@plentyag/core/src/farm-def/types';
import { toQueryParams } from '@plentyag/core/src/utils/to-query-params';
import React from 'react';

import { AutocompleteRemote } from '../autocomplete-remote';
import { makeOptions, renderFormGenInputAsync } from '../test-helpers';

import { AutocompleteFarmDefCrop, SEARCH_CROP_BY_FARM_PATH_URL, SEARCH_CROPS_URL, transformFarmDefCropData } from '.';

jest.mock('../autocomplete-remote');

const MockAutocompleteRemote = AutocompleteRemote as any;

const MOCK_FARM_DEF_CROP_RESPONSE: FarmDefCrop[] = [
  {
    name: 'BTC',
    commonName: 'BTC',
    path: 'crops/BTC',
    description: ' ',
    displayName: 'BTC - Beet - Fresh Start - coir',
    displayAbbreviation: 'BTC',
    seedPartNumbers: [],
    cropTypeName: 'LeafyGreens',
    childCrops: [],
    media: 'coir',
    cultivar: 'Fresh Start',
    properties: {
      scientificName: 'Beta vulgaris ',
    },
    isSeedable: true,
  },
  {
    name: 'B11',
    commonName: 'B11',
    path: 'crops/B11',
    description: ' ',
    displayName: 'B11 - Baby Kale - White Russian  - FPX',
    displayAbbreviation: 'WHR',
    seedPartNumbers: [],
    cropTypeName: 'LeafyGreens',
    childCrops: [],
    media: 'FPX',
    cultivar: 'White Russian ',
    properties: {
      scientificName: 'Brassica oleracea',
      plannedGrowDays: 10.0,
    },
    isSeedable: true,
  },
  {
    name: 'B20',
    commonName: 'B20',
    path: 'crops/B20',
    description: ' ',
    displayName: 'B20 - Baby Arugula - Eruca - FPX',
    displayAbbreviation: 'BAR',
    seedPartNumbers: [],
    cropTypeName: 'LeafyGreens',
    childCrops: [],
    media: 'FPX',
    cultivar: 'Eruca',
    properties: {
      scientificName: 'Eruca sativa',
      plannedGrowDays: 12.0,
    },
    isSeedable: true,
  },
];

const options = makeOptions({});

describe('transformData', () => {
  it('sorts data by crop', () => {
    expect(transformFarmDefCropData()(MOCK_FARM_DEF_CROP_RESPONSE)).toEqual([
      { label: 'B11 - Baby Kale - White Russian  - FPX', value: 'B11' },
      { label: 'B20 - Baby Arugula - Eruca - FPX', value: 'B20' },
      { label: 'BTC - Beet - Fresh Start - coir', value: 'BTC' },
    ]);
  });

  it('filters data based on an allowList', () => {
    expect(
      transformFarmDefCropData({
        allowList: ['B20', 'B11'],
      })(MOCK_FARM_DEF_CROP_RESPONSE)
    ).toEqual([
      { label: 'B11 - Baby Kale - White Russian  - FPX', value: 'B11' },
      { label: 'B20 - Baby Arugula - Eruca - FPX', value: 'B20' },
    ]);
  });

  it('allows extra crop', () => {
    expect(
      transformFarmDefCropData({
        allowList: ['B20', 'B11'],
        extra: ['Other'],
      })(MOCK_FARM_DEF_CROP_RESPONSE)
    ).toEqual([
      { label: 'B11 - Baby Kale - White Russian  - FPX', value: 'B11' },
      { label: 'B20 - Baby Arugula - Eruca - FPX', value: 'B20' },
      { label: 'Other', value: 'Other' },
    ]);
  });

  it('allows extra crop as FormGen.ValueLabel', () => {
    expect(
      transformFarmDefCropData({
        allowList: ['B20', 'B11'],
        extra: [{ label: 'Other', value: 'other' }],
      })(MOCK_FARM_DEF_CROP_RESPONSE)
    ).toEqual([
      { label: 'B11 - Baby Kale - White Russian  - FPX', value: 'B11' },
      { label: 'B20 - Baby Arugula - Eruca - FPX', value: 'B20' },
      { label: 'Other', value: 'other' },
    ]);
  });

  it("allows to set the FormGen.ValueLabel's value as the FarmDefCrop object", () => {
    const findCrop = cropName => MOCK_FARM_DEF_CROP_RESPONSE.find(crop => crop.name === cropName);
    expect(
      transformFarmDefCropData({
        valueSelector: null,
        extra: [{ label: 'Other', value: { field: 'other' } }],
      })(MOCK_FARM_DEF_CROP_RESPONSE)
    ).toEqual([
      { label: 'B11 - Baby Kale - White Russian  - FPX', value: findCrop('B11') },
      { label: 'B20 - Baby Arugula - Eruca - FPX', value: findCrop('B20') },
      { label: 'BTC - Beet - Fresh Start - coir', value: findCrop('BTC') },
      { label: 'Other', value: { field: 'other' } },
    ]);
  });

  it('supports optional "labelSelector"', () => {
    expect(
      transformFarmDefCropData({
        labelSelector: 'name',
        extra: [{ label: 'Other', value: 'other' }],
      })(MOCK_FARM_DEF_CROP_RESPONSE)
    ).toEqual([
      { label: 'B11', value: 'B11' },
      { label: 'B20', value: 'B20' },
      { label: 'BTC', value: 'BTC' },
      { label: 'Other', value: 'other' },
    ]);
  });

  it('supports "allowList" being a function to filter crops', () => {
    expect(
      transformFarmDefCropData({
        allowList: crops => crops.filter(crop => crop.name.startsWith('B1')),
        extra: [{ label: 'Other', value: 'other' }],
      })(MOCK_FARM_DEF_CROP_RESPONSE)
    ).toEqual([
      { label: 'B11 - Baby Kale - White Russian  - FPX', value: 'B11' },
      { label: 'Other', value: 'other' },
    ]);
  });
});

describe('AutocompleteFarmDefCrop', () => {
  it('forwards properties to AutocompleteRemote', async () => {
    MockAutocompleteRemote.type.mockImplementation(({ formGenField }) => {
      expect(formGenField.type).toBe('AutocompleteRemote');
      expect(formGenField.url).toBe(`${SEARCH_CROPS_URL}`);
      expect(formGenField.transformResponse).toBeDefined();

      return <></>;
    });

    await renderFormGenInputAsync(AutocompleteFarmDefCrop, options());

    expect.assertions(3);
  });

  it('uses correct url when farmPath is provided and crop should be packable anywhere', async () => {
    const farmPath = 'sites/SSF2/farms/Tigris';
    const isPackableAnywhere = true;
    MockAutocompleteRemote.type.mockImplementation(({ formGenField }) => {
      expect(formGenField.type).toBe('AutocompleteRemote');
      expect(formGenField.url).toBe(
        `${SEARCH_CROP_BY_FARM_PATH_URL}${toQueryParams(
          { farmPath, isPackableAnywhere },
          { encodeKeyUsingSnakeCase: true }
        )}`
      );
      expect(formGenField.transformResponse).toBeDefined();

      return <></>;
    });

    await renderFormGenInputAsync(
      AutocompleteFarmDefCrop,
      options({
        formGenField: { farmPath, isPackableAnywhere: true },
      })
    );

    expect.assertions(3);
  });

  it('uses correct url when farmPath is provided and crop should be packable in the related farm', async () => {
    const farmPath = 'sites/SSF2/farms/Tigris';
    const isPackableInFarm = true;
    MockAutocompleteRemote.type.mockImplementation(({ formGenField }) => {
      expect(formGenField.type).toBe('AutocompleteRemote');
      expect(formGenField.url).toBe(
        `${SEARCH_CROP_BY_FARM_PATH_URL}${toQueryParams(
          { farmPath, isPackableInFarm },
          { encodeKeyUsingSnakeCase: true }
        )}`
      );
      expect(formGenField.transformResponse).toBeDefined();

      return <></>;
    });

    await renderFormGenInputAsync(
      AutocompleteFarmDefCrop,
      options({
        formGenField: { farmPath, isPackableInFarm: true },
      })
    );

    expect.assertions(3);
  });

  it('allows to pass extra crop', async () => {
    const isPackable = true;
    MockAutocompleteRemote.type.mockImplementation(({ formGenField }) => {
      expect(formGenField.type).toBe('AutocompleteRemote');
      expect(formGenField.url).toBe(`${SEARCH_CROPS_URL}${toQueryParams({ isPackable })}`);
      expect(formGenField.transformResponse(MOCK_FARM_DEF_CROP_RESPONSE)).toContainEqual({
        label: 'Other',
        value: 'Other',
      });

      return <></>;
    });

    await renderFormGenInputAsync(
      AutocompleteFarmDefCrop,
      options({
        formGenField: { extra: ['Other'], isPackable: true },
      })
    );

    expect.assertions(3);
  });

  it('allows to pass extra crop as FormGen.ValueLabel', async () => {
    MockAutocompleteRemote.type.mockImplementation(({ formGenField }) => {
      expect(formGenField.type).toBe('AutocompleteRemote');
      expect(formGenField.url).toBe(`${SEARCH_CROPS_URL}`);
      expect(formGenField.transformResponse(MOCK_FARM_DEF_CROP_RESPONSE)).toContainEqual({
        label: 'Other',
        value: 'other',
      });

      return <></>;
    });

    await renderFormGenInputAsync(
      AutocompleteFarmDefCrop,
      options({
        formGenField: { extra: [{ label: 'Other', value: 'other' }] },
      })
    );

    expect.assertions(3);
  });
});

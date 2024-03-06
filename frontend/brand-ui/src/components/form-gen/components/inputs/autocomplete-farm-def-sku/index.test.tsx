import { toQueryParams } from '@plentyag/core/src/utils/to-query-params';
import React from 'react';

import { AutocompleteRemote } from '../autocomplete-remote';
import { makeOptions, renderFormGenInputAsync } from '../test-helpers';

import { AutocompleteFarmDefSku, SEARCH_SKU_BY_FARM_PATH_URL, SEARCH_SKUS_URL, transformFarmDefSkuData } from '.';

import { MOCK_FARM_DEF_SKU_RESPONSE } from './test-mocks';

jest.mock('../autocomplete-remote');

const MockAutocompleteRemote = AutocompleteRemote as any;

const options = makeOptions({});

describe('transformData', () => {
  it('sorts data by crop', () => {
    expect(transformFarmDefSkuData()(MOCK_FARM_DEF_SKU_RESPONSE)).toEqual([
      { label: 'BAC Baby Arugula 6ct Case of Clamshells 4.5oz', value: 'B20Case6Clamshell4o5oz' },
      { label: 'BAC Baby Arugula Clamshell 4.5oz', value: 'B20Clamshell4o5oz' },
      { label: 'E31 Mizuna Mix Case 6 Clamshell 4.50z', value: 'E31Case6Clamshell4o5oz' },
      { label: 'E31 Mizuna Mix Clamshell 4.5oz', value: 'E31Clamshell4o5oz' },
    ]);
  });

  it('filters data based on an allowList', () => {
    expect(
      transformFarmDefSkuData({
        allowList: ['E31Clamshell4o5oz', 'B20Clamshell4o5oz'],
      })(MOCK_FARM_DEF_SKU_RESPONSE)
    ).toEqual([
      { label: 'BAC Baby Arugula Clamshell 4.5oz', value: 'B20Clamshell4o5oz' },
      { label: 'E31 Mizuna Mix Clamshell 4.5oz', value: 'E31Clamshell4o5oz' },
    ]);
  });

  it('filters data based on an allowList', () => {
    expect(
      transformFarmDefSkuData({
        allowedSkuTypeNames: ['Clamshell4o5oz'],
      })(MOCK_FARM_DEF_SKU_RESPONSE)
    ).toEqual([
      { label: 'BAC Baby Arugula Clamshell 4.5oz', value: 'B20Clamshell4o5oz' },
      { label: 'E31 Mizuna Mix Clamshell 4.5oz', value: 'E31Clamshell4o5oz' },
    ]);
  });

  it('allows extra crop', () => {
    expect(
      transformFarmDefSkuData({
        allowList: ['E31Clamshell4o5oz', 'B20Clamshell4o5oz'],
        extra: ['Other'],
      })(MOCK_FARM_DEF_SKU_RESPONSE)
    ).toEqual([
      { label: 'BAC Baby Arugula Clamshell 4.5oz', value: 'B20Clamshell4o5oz' },
      { label: 'E31 Mizuna Mix Clamshell 4.5oz', value: 'E31Clamshell4o5oz' },
      { label: 'Other', value: 'Other' },
    ]);
  });

  it('allows extra crop as FormGen.ValueLabel', () => {
    expect(
      transformFarmDefSkuData({
        allowList: ['E31Clamshell4o5oz', 'B20Clamshell4o5oz'],
        extra: [{ label: 'Other', value: 'other' }],
      })(MOCK_FARM_DEF_SKU_RESPONSE)
    ).toEqual([
      { label: 'BAC Baby Arugula Clamshell 4.5oz', value: 'B20Clamshell4o5oz' },
      { label: 'E31 Mizuna Mix Clamshell 4.5oz', value: 'E31Clamshell4o5oz' },
      { label: 'Other', value: 'other' },
    ]);
  });
});

describe('AutocompleteFarmDefSku', () => {
  it('forwards properties to AutocompleteRemote', async () => {
    MockAutocompleteRemote.type.mockImplementation(({ formGenField }) => {
      expect(formGenField.type).toBe('AutocompleteRemote');
      expect(formGenField.url).toBe(SEARCH_SKUS_URL);
      expect(formGenField.transformResponse).toBeDefined();

      return <></>;
    });

    await renderFormGenInputAsync(AutocompleteFarmDefSku, options());

    expect.assertions(3);
  });

  it('uses correct url when farmPath is provided', async () => {
    const farmPath = 'sites/SSF2/farms/Tigris';
    MockAutocompleteRemote.type.mockImplementation(({ formGenField }) => {
      expect(formGenField.type).toBe('AutocompleteRemote');
      expect(formGenField.url).toBe(
        `${SEARCH_SKU_BY_FARM_PATH_URL}${toQueryParams({ farmPath }, { encodeKeyUsingSnakeCase: true })}`
      );
      expect(formGenField.transformResponse).toBeDefined();

      return <></>;
    });

    await renderFormGenInputAsync(
      AutocompleteFarmDefSku,
      options({
        formGenField: { farmPath },
      })
    );

    expect.assertions(3);
  });

  it('uses correct url when farmPath and skuTypeClass are provided', async () => {
    const farmPath = 'sites/SSF2/farms/Tigris';
    const skuTypeClass = 'Case';
    MockAutocompleteRemote.type.mockImplementation(({ formGenField }) => {
      expect(formGenField.type).toBe('AutocompleteRemote');
      expect(formGenField.url).toBe(
        `${SEARCH_SKU_BY_FARM_PATH_URL}${toQueryParams({ farmPath, skuTypeClass }, { encodeKeyUsingSnakeCase: true })}`
      );
      expect(formGenField.transformResponse).toBeDefined();

      return <></>;
    });

    await renderFormGenInputAsync(
      AutocompleteFarmDefSku,
      options({
        formGenField: { farmPath, skuTypeClass },
      })
    );

    expect.assertions(3);
  });

  it('uses correct url when skuTypeClass is provided', async () => {
    const skuTypeClass = 'Case';
    MockAutocompleteRemote.type.mockImplementation(({ formGenField }) => {
      expect(formGenField.type).toBe('AutocompleteRemote');
      expect(formGenField.url).toBe(
        `${SEARCH_SKUS_URL}${toQueryParams({ skuTypeClass }, { encodeKeyUsingSnakeCase: true })}`
      );
      expect(formGenField.transformResponse).toBeDefined();

      return <></>;
    });

    await renderFormGenInputAsync(
      AutocompleteFarmDefSku,
      options({
        formGenField: { skuTypeClass },
      })
    );

    expect.assertions(3);
  });

  it('allows to pass extra crop', async () => {
    MockAutocompleteRemote.type.mockImplementation(({ formGenField }) => {
      expect(formGenField.type).toBe('AutocompleteRemote');
      expect(formGenField.url).toBe(SEARCH_SKUS_URL);
      expect(formGenField.transformResponse(MOCK_FARM_DEF_SKU_RESPONSE)).toContainEqual({
        label: 'Other',
        value: 'Other',
      });

      return <></>;
    });

    await renderFormGenInputAsync(
      AutocompleteFarmDefSku,
      options({
        formGenField: { extra: ['Other'] },
      })
    );

    expect.assertions(3);
  });

  it('allows to pass extra crop as FormGen.ValueLabel', async () => {
    MockAutocompleteRemote.type.mockImplementation(({ formGenField }) => {
      expect(formGenField.type).toBe('AutocompleteRemote');
      expect(formGenField.url).toBe(SEARCH_SKUS_URL);
      expect(formGenField.transformResponse(MOCK_FARM_DEF_SKU_RESPONSE)).toContainEqual({
        label: 'Other',
        value: 'other',
      });

      return <></>;
    });

    await renderFormGenInputAsync(
      AutocompleteFarmDefSku,
      options({
        formGenField: { extra: [{ label: 'Other', value: 'other' }] },
      })
    );

    expect.assertions(3);
  });
});

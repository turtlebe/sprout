import React from 'react';

import { AutocompleteRemote } from '../autocomplete-remote';
import { makeOptions, renderFormGenInputAsync } from '../test-helpers';

import { AutocompleteFirmwareVersion, SEARCH_DEVICE_FIRMWARE, transformFirmwareVersions } from '.';

import { mockFirmwareVersions } from './test-mocks';

jest.mock('../autocomplete-remote');

const MockAutocompleteRemote = AutocompleteRemote as any;

const options = makeOptions({});

describe('transformData', () => {
  it('sorts data by crop', () => {
    expect(transformFirmwareVersions()(mockFirmwareVersions)).toEqual([
      {
        label: 'APP - 0.1.3-3',
        value: { firmwareVersion: '0.1.3-3', binaryType: 'APP' },
      },
      {
        label: 'APP - 0.4.0-0',
        value: { firmwareVersion: '0.4.0-0', binaryType: 'APP' },
      },
      {
        label: 'BOOTLOADER - 0.4.1-0',
        value: { firmwareVersion: '0.4.1-0', binaryType: 'BOOTLOADER' },
      },
      {
        label: 'BOOTLOADER - 0.4.1-1',
        value: { firmwareVersion: '0.4.1-1', binaryType: 'BOOTLOADER' },
      },
    ]);
  });

  it('filters data for a given deviceType', () => {
    expect(
      transformFirmwareVersions({
        deviceType: 'Sprinkle2Base',
      })(mockFirmwareVersions)
    ).toEqual([
      {
        label: 'APP - 0.4.0-0',
        value: { firmwareVersion: '0.4.0-0', binaryType: 'APP' },
      },
      {
        label: 'BOOTLOADER - 0.4.1-0',
        value: { firmwareVersion: '0.4.1-0', binaryType: 'BOOTLOADER' },
      },
    ]);
  });
});

describe('AutocompleteFirmwareVersion', () => {
  it('forwards properties to AutocompleteRemote', async () => {
    MockAutocompleteRemote.type.mockImplementation(({ formGenField }) => {
      expect(formGenField.type).toBe('AutocompleteRemote');
      expect(formGenField.url).toBe(SEARCH_DEVICE_FIRMWARE);
      expect(formGenField.transformResponse).toBeDefined();

      return <></>;
    });

    await renderFormGenInputAsync(AutocompleteFirmwareVersion, options());

    expect.assertions(3);
  });
});

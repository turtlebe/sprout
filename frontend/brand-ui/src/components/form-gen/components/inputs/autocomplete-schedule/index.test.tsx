import { buildPaginatedResponse } from '@plentyag/core/src/test-helpers';
import { Schedule } from '@plentyag/core/src/types/environment';
import React from 'react';

import { AutocompleteRemote } from '../autocomplete-remote';
import { makeOptions, renderFormGenInputAsync } from '../test-helpers';

import { AutocompleteSchedule, getSchedulesSearchUrl, transformData } from '.';

jest.mock('../autocomplete-remote');

const MockAutocompleteRemote = AutocompleteRemote as any;

const options = makeOptions({});

const schedules = [
  { id: 1, path: 'sites/SSF2/scheduleDefinitions/SetTemperature' } as unknown as Schedule,
  { id: 2, path: 'sites/SSF2/scheduleDefinitions/SetCo2' } as unknown as Schedule,
  { id: 3, path: 'sites/SSF2/areas/VerticalGrow/scheduleDefinitions/SetCo2' } as unknown as Schedule,
];

describe('transformData', () => {
  it('uses a truncated path as label', () => {
    expect(transformData({ parentPath: 'sites/SSF2' })(buildPaginatedResponse(schedules))).toEqual([
      { label: 'SetCo2', value: schedules[1] },
      { label: 'SetTemperature', value: schedules[0] },
      { label: 'VerticalGrow/SetCo2', value: schedules[2] },
    ]);
  });

  it('supports valueSelector', () => {
    expect(
      transformData({ parentPath: 'sites/SSF2', valueSelector: 'path' })(buildPaginatedResponse(schedules))
    ).toEqual([
      { label: 'SetCo2', value: 'sites/SSF2/scheduleDefinitions/SetCo2' },
      { label: 'SetTemperature', value: 'sites/SSF2/scheduleDefinitions/SetTemperature' },
      { label: 'VerticalGrow/SetCo2', value: 'sites/SSF2/areas/VerticalGrow/scheduleDefinitions/SetCo2' },
    ]);
  });
});

describe('AutocompleteFarmDefType', () => {
  it('forwards properties to AutocompleteRemote', async () => {
    MockAutocompleteRemote.type.mockImplementation(({ formGenField }) => {
      expect(formGenField.type).toBe('AutocompleteRemote');
      expect(formGenField.url).toContain(getSchedulesSearchUrl('sites/SSF2'));
      expect(formGenField.transformResponse).toBeDefined();

      return <></>;
    });

    await renderFormGenInputAsync(AutocompleteSchedule, options({ formGenField: { path: 'sites/SSF2' } }));

    expect.assertions(3);
  });
});

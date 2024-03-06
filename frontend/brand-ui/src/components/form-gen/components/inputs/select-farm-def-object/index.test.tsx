import React from 'react';

import { SelectRemote } from '../select-remote';
import { makeOptions, renderFormGenInputAsync } from '../test-helpers';

import { SEARCH_OBJECT_URL, SelectFarmDefObject, transformFarmDefObjects } from '.';

import { MOCK_SEARCH_OBJECT_RESPONSE } from './test-mock';

jest.mock('../select-remote');

const MockSelectRemote = SelectRemote as any;

const options = makeOptions({});

describe('transformFarmDefObjects', () => {
  it('sorts FarmDef data by label', () => {
    expect(transformFarmDefObjects()(MOCK_SEARCH_OBJECT_RESPONSE)).toEqual([
      { label: 'TestFarm1', value: 'sites/TEST/farms/TestFarm1' },
      { label: 'Tigris', value: 'sites/SSF2/farms/Tigris' },
    ]);
  });

  it('filters FarmDef data based on an allowedPaths', () => {
    expect(
      transformFarmDefObjects({
        allowedPaths: ['sites/SSF2/farms/Tigris'],
      })(MOCK_SEARCH_OBJECT_RESPONSE)
    ).toEqual([{ label: 'Tigris', value: 'sites/SSF2/farms/Tigris' }]);
  });
});

describe('SelectFarmDefObject', () => {
  it('forwards properties to SelectRemote', async () => {
    MockSelectRemote.type.mockImplementation(({ formGenField }) => {
      expect(formGenField.type).toBe('SelectRemote');
      expect(formGenField.url).toBe(SEARCH_OBJECT_URL);
      expect(formGenField.transformResponse).toBeDefined();

      return <></>;
    });

    await renderFormGenInputAsync(SelectFarmDefObject, options());

    expect.assertions(3);
  });

  it('allows to pass queryParams to the endpoint', async () => {
    MockSelectRemote.type.mockImplementation(({ formGenField }) => {
      expect(formGenField.type).toBe('SelectRemote');
      expect(formGenField.url).toContain(SEARCH_OBJECT_URL);
      expect(formGenField.url).toContain('kind=farm');
      expect(formGenField.url).toContain('site=sites%2FSSF2');
      expect(formGenField.transformResponse).toBeDefined();

      return <></>;
    });

    await renderFormGenInputAsync(SelectFarmDefObject, options({ formGenField: { kind: 'farm', site: 'sites/SSF2' } }));

    expect.assertions(5);
  });
});

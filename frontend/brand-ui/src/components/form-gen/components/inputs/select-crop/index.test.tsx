import React from 'react';

import { VIS_ENDPOINT } from '../autocomplete-crop';
import { SelectRemote } from '../select-remote';
import { makeOptions, renderFormGenInputAsync } from '../test-helpers';

import { SelectCrop } from '.';

jest.mock('../select-remote');

const MockSelectRemote = SelectRemote as any;

const options = makeOptions({});

describe('SelectCrop', () => {
  it('forwards properties to Autocomplete', async () => {
    MockSelectRemote.type.mockImplementation(({ formGenField }) => {
      expect(formGenField.type).toBe('SelectRemote');
      expect(formGenField.url).toBe(VIS_ENDPOINT);
      expect(formGenField.transformResponse).toBeDefined();

      return <></>;
    });

    await renderFormGenInputAsync(SelectCrop, options());

    expect.assertions(3);
  });

  it('allows to pass extra crop', async () => {
    MockSelectRemote.type.mockImplementation(({ formGenField }) => {
      expect(formGenField.type).toBe('SelectRemote');
      expect(formGenField.url).toBe(VIS_ENDPOINT);
      expect(formGenField.transformResponse([])).toContainEqual({ label: 'Other', value: 'Other' });

      return <></>;
    });

    await renderFormGenInputAsync(SelectCrop, options({ formGenField: { extra: ['Other'] } }));

    expect.assertions(3);
  });

  it('allows to pass extra crop as FormGen.ValueLabel', async () => {
    MockSelectRemote.type.mockImplementation(({ formGenField }) => {
      expect(formGenField.type).toBe('SelectRemote');
      expect(formGenField.url).toBe(VIS_ENDPOINT);
      expect(formGenField.transformResponse([])).toContainEqual({ label: 'Other', value: 'other' });

      return <></>;
    });

    await renderFormGenInputAsync(
      SelectCrop,
      options({ formGenField: { extra: [{ label: 'Other', value: 'other' }] } })
    );

    expect.assertions(3);
  });
});

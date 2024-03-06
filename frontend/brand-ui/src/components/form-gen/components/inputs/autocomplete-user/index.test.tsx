import { User } from '@plentyag/core/src/core-store/types';
import React from 'react';

import { AutocompleteRemote } from '../autocomplete-remote';
import { makeOptions, renderFormGenInputAsync } from '../test-helpers';

import { AutocompleteUser, GET_USERS_URL, transformUserData } from '.';

jest.mock('../autocomplete-remote');
const MockAutocompleteRemote = AutocompleteRemote as any;

const options = makeOptions({});

const MOCK_GET_USERS_RESPONSE: User[] = [
  {
    username: 'jsmith',
    firstName: 'john',
    lastName: 'smith',
  },
  {
    username: 'cjohnson',
    firstName: 'cloris',
    lastName: 'johnson',
  },
];

describe('AutocompleteUser', () => {
  it('sorts list of users', () => {
    const users = transformUserData(MOCK_GET_USERS_RESPONSE);
    expect(users).toHaveLength(2);
    expect(users[0].value).toBe(MOCK_GET_USERS_RESPONSE[1].username);
    expect(users[1].value).toBe(MOCK_GET_USERS_RESPONSE[0].username);
  });

  it('passes optional filter parameters to AutocompleteRemote', async () => {
    const farmPath = 'sites/SSF2/farms/Tigris';
    const roles = ['hyp-production-supervistor', 'hyp-production-grower'];

    MockAutocompleteRemote.type.mockImplementation(({ formGenField }) => {
      expect(formGenField.type).toBe('AutocompleteRemote');
      expect(formGenField.url).toBe(GET_USERS_URL);
      expect(formGenField.urlQueryParams).toEqual({ farmPath, roles });
      return <></>;
    });

    await renderFormGenInputAsync(
      AutocompleteUser,
      options({
        formGenField: { farmPath, roles },
      })
    );
  });
});

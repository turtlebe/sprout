import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { renderHook } from '@testing-library/react-hooks';

import { getSite, isSubsite, useAllowedSites } from '.';

mockCurrentUser();

describe('useAllowedSites', () => {
  it('returns the primary site and a list of allowed sites', () => {
    const { result } = renderHook(() => useAllowedSites());

    expect(result.current.primarySite).toEqual('TIGRIS');
    expect(result.current.allowedSites).toEqual(['LAR1', 'SANDBOX', 'SSF1', 'TIGRIS']);
  });

  it('returns the primary site and a list of allowed sites (with subsites)', () => {
    const { result } = renderHook(() => useAllowedSites({ subsite: true }));

    expect(result.current.primarySite).toEqual('TIGRIS');
    expect(result.current.allowedSites).toEqual(['LAR1', 'SANDBOX', 'SSF1', 'SSF1_MTR', 'SSF1_NARW', 'TIGRIS']);
  });
});

describe('isSubsite', () => {
  it('returns false', () => {
    expect(isSubsite('SSF1')).toBe(false);
  });

  it('returns false', () => {
    expect(isSubsite('SSF1_unkown')).toBe(false);
  });

  it('returns true', () => {
    expect(isSubsite('SSF1_MTR')).toBe(true);
  });
});

describe('getSite', () => {
  it('returns undefined', () => {
    expect(getSite('SSF1')).toBeUndefined();
  });

  it('returns SSF1', () => {
    expect(getSite('SSF1_MTR')).toBe('SSF1');
  });
});

import { getCookie } from './get-cookie';

const mockCookieValue = 'cookie1=test1; cookie2=test2; cookie3=test3';

describe('getCookie', () => {
  beforeEach(() => {
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: mockCookieValue,
    });
  });

  it('returns undefined when no such cookie is present', () => {
    expect(getCookie('cookie')).toBeUndefined();
    expect(getCookie('cookiE1')).toBeUndefined();
    expect(getCookie('test1')).toBeUndefined();
  });

  it('returns cookie when present', () => {
    expect(getCookie('cookie2')).toEqual('test2');
  });

  it('returns cookie when present at beginning', () => {
    expect(getCookie('cookie1')).toEqual('test1');
  });

  it('returns cookie when present at end', () => {
    expect(getCookie('cookie3')).toEqual('test3');
  });
});

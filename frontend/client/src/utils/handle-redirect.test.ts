import { handleRedirect } from '.';

describe('handleRedirect', () => {
  it('redirects to farmDefPath overriding farm def path in current url', () => {
    const urlPath = '/production/sites/SSF2/farms/Tigris/actions';
    const search = '?test=1';
    const farmPath = 'sites/LAX1/farms/LAX1';
    const redirect = handleRedirect(urlPath, search, farmPath);
    expect(redirect.props).toEqual({ to: '/production/sites/LAX1/farms/LAX1/actions?test=1' });
  });

  it('redirects to farmDefPath overriding farm def path in current url - no search or trailing path', () => {
    const urlPath = '/production/sites/SSF2/farms/Tigris';
    const search = undefined;
    const farmPath = 'sites/LAX1/farms/LAX1';
    const redirect = handleRedirect(urlPath, search, farmPath);
    expect(redirect.props).toEqual({ to: '/production/sites/LAX1/farms/LAX1' });
  });

  it('redirects to farmDefPath when no farm def path is present in url', () => {
    const urlPath = '/production/actions';
    const search = '?test=1';
    const farmPath = 'sites/LAX1/farms/LAX1';
    const redirect = handleRedirect(urlPath, search, farmPath);
    expect(redirect.props).toEqual({ to: '/production/sites/LAX1/farms/LAX1/actions?test=1' });
  });

  it('redirects to basePath without any trailing path', () => {
    const urlPath = '/production';
    const search = '?test=1';
    const farmPath = 'sites/LAX1/farms/LAX1';
    const redirect = handleRedirect(urlPath, search, farmPath);
    expect(redirect.props).toEqual({ to: '/production/sites/LAX1/farms/LAX1?test=1' });
  });

  it('redirects without search', () => {
    const urlPath = '/production';
    const search = undefined;
    const farmPath = 'sites/LAX1/farms/LAX1';
    const redirect = handleRedirect(urlPath, search, farmPath);
    expect(redirect.props).toEqual({ to: '/production/sites/LAX1/farms/LAX1' });
  });
});

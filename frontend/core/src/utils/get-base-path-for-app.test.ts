import { getBasePathForApp } from './get-base-path-for-app';

describe('getBasePathForApp', () => {
  it('should return a well-formed url given the base path and app name', () => {
    // ARRANGE
    const currentBasePath = '/production/sites/LAX1/farms/LAX1';

    // ACT
    const result = getBasePathForApp(currentBasePath, 'crop');

    // ASSERT
    expect(result).toEqual('/crop');
  });

  it('should include the global site farm context', () => {
    // ARRANGE
    const currentBasePath = '/production/sites/LAX1/farms/LAX1';

    // ACT
    const result = getBasePathForApp(currentBasePath, 'quality', true);

    // ASSERT
    expect(result).toEqual('/quality/sites/LAX1/farms/LAX1');
  });

  it('should error out if base path passed in is malformed ', () => {
    // ARRANGE
    const currentBasePath = 'not/a/wellformed/url';

    // ACT
    try {
      getBasePathForApp(currentBasePath, 'quality', true);
    } catch (e) {
      // ASSERT
      expect(e.message).toEqual('Base path "not/a/wellformed/url" is malformed');
    }
  });
});

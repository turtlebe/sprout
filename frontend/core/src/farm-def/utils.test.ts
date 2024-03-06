import { deviceLocation, deviceLocationGroup } from '../farm-def/test-helpers';

import {
  getDeviceLocationPath,
  getDeviceLocationRefFromChildDeviceLocationRef,
  getKindFromPath,
  isChildDeviceLocationRef,
  isValidKind,
} from './utils';

const testPath = 'sites/SSF2/areas/PrimaryPostHarvest/lines/ProductPacking/machines/Blender';

describe('getKindFromPath()', () => {
  it('returns null when parameters are not provided', () => {
    expect(getKindFromPath(undefined, 'sites')).toBe(null);
    expect(getKindFromPath('sites/ssf2', null)).toBe(null);
  });

  it('returns site value', () => {
    expect(getKindFromPath(testPath, 'sites')).toBe('SSF2');
  });

  it('returns area value', () => {
    expect(getKindFromPath(testPath, 'areas')).toBe('PrimaryPostHarvest');
  });

  it('returns line value', () => {
    expect(getKindFromPath(testPath, 'lines')).toBe('ProductPacking');
  });

  it('returns machine value', () => {
    expect(getKindFromPath(testPath, 'machines')).toBe('Blender');
  });

  it('returns null when malformed path given', () => {
    // area --> should be --> areas
    const badPath = 'sites/SSF2/area/PrimaryPostHarvest';
    expect(getKindFromPath(badPath, 'areas')).toBe(null);

    const shortenedPath = 'SSF2/PrimaryPostHarvest/ProductPacking/Blender';
    expect(getKindFromPath(shortenedPath, 'lines')).toBe(null);
  });
});

describe('isValidKind', () => {
  it('returns false', () => {
    expect(isValidKind('foobar')).toBe(false);
    expect(isValidKind('site')).toBe(false);
    expect(isValidKind('sites', 'singular')).toBe(false);
  });

  it('returns true', () => {
    expect(isValidKind('site', 'singular')).toBe(true);
    expect(isValidKind('sites', 'plural')).toBe(true);
    expect(isValidKind('sites')).toBe(true);
  });
});

describe('isChildDeviceLocationRef', () => {
  it('returns true', () => {
    expect(
      isChildDeviceLocationRef('32d60718-2753-4b35-b67c-58fcb88422e8:deviceLocation-SprinkleGroup:SprinkleSp1p1')
    ).toBe(true);
  });

  it('returns false', () => {
    expect(isChildDeviceLocationRef('32d60718-2753-4b35-b67c-58fcb88422e8:deviceLocation-SprinkleGroup:')).toBe(false);
    expect(isChildDeviceLocationRef('32d60718-2753-4b35-b67c-58fcb88422e8:deviceLocation-SprinkleGroup')).toBe(false);
    expect(isChildDeviceLocationRef('32d60718-2753-4b35-b67c-58fcb88422e8:deviceLocation-')).toBe(false);
    expect(isChildDeviceLocationRef('32d60718-2753-4b35-b67c-58fcb88422e8:')).toBe(false);
    expect(isChildDeviceLocationRef('')).toBe(false);
  });
});

describe('getDeviceLocationRefFromChildDeviceLocationRef', () => {
  it('returns the deviceLocation ref', () => {
    expect(
      getDeviceLocationRefFromChildDeviceLocationRef(
        '32d60718-2753-4b35-b67c-58fcb88422e8:deviceLocation-SprinkleGroup:SprinkleSp1p1'
      )
    ).toBe('32d60718-2753-4b35-b67c-58fcb88422e8:deviceLocation-SprinkleGroup');
  });

  it('returns null', () => {
    expect(getDeviceLocationRefFromChildDeviceLocationRef('invalid-ref')).toBe(null);
  });
});

describe('getDeviceLocationPath', () => {
  it('returns undefined', () => {
    expect(getDeviceLocationPath(null)).toBeUndefined();
    expect(getDeviceLocationPath(undefined)).toBeUndefined();
  });

  it('returns the path when the device location is not a group', () => {
    expect(getDeviceLocationPath(deviceLocation)).toBe(deviceLocation.path);
  });

  it('returns the path when the device location is a group with one child device location', () => {
    expect(getDeviceLocationPath(deviceLocationGroup)).toBe(deviceLocationGroup.locations['SprinkleSp1p1'].path);
  });
});

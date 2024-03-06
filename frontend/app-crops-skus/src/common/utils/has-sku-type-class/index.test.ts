import { SkuTypeClasses } from '@plentyag/core/src/farm-def/types';

import { mockSkuTypes } from '../../../common/test-helpers';

import { hasSkuTypeClass } from '.';

describe('hasSkuTypeClass', () => {
  it('returns false', () => {
    expect(hasSkuTypeClass('bad-sku-type-name', mockSkuTypes, [SkuTypeClasses.Clamshell])).toBe(false);
    expect(hasSkuTypeClass(SkuTypeClasses.Case, mockSkuTypes, [SkuTypeClasses.Clamshell])).toBe(false);
  });

  it('returns true', () => {
    expect(hasSkuTypeClass(SkuTypeClasses.Clamshell, mockSkuTypes, [SkuTypeClasses.Clamshell])).toBe(false);
  });
});

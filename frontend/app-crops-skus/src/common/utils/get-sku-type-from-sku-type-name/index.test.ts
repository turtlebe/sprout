import { mockSkuTypes } from '../../../common/test-helpers';

import { getSkuTypeFromSkuTypeName } from '.';

describe('getSkuTypeFromSkuTypeName', () => {
  it('returns undefined when name not found', () => {
    expect(getSkuTypeFromSkuTypeName(mockSkuTypes, 'invalid')).toBe(undefined);
  });

  it('returns sku type name object', () => {
    expect(getSkuTypeFromSkuTypeName(mockSkuTypes, 'Clamshell4oz')).toBe(mockSkuTypes[0]);
  });
});

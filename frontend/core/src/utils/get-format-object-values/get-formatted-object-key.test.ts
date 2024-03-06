import { getFormattedObjectKey } from './get-formatted-object-key';

describe('getFormattedObjectKey', () => {
  it('converts camel case object keys to human readable title', () => {
    // ACT
    const result = getFormattedObjectKey('loadedInGermAt');

    // ASSERT
    expect(result).toEqual('Loaded In Germ At');
  });

  it('capitalizes a normal string', () => {
    // ACT
    const result = getFormattedObjectKey('normal string');

    // ASSERT
    expect(result).toEqual('Normal string');
  });
});

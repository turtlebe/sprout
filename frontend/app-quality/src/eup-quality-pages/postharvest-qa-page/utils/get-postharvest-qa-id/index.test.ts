import { getPostharvestQaId } from '.';

describe('getPostharvestQaId', () => {
  it('returns combined string ID based on lot and sku', () => {
    const result = getPostharvestQaId({
      lot: '5-LAX1-CRS-276',
      sku: 'CRSCase6Clamshell4o5ozPlenty',
    });

    expect(result).toEqual('5-LAX1-CRS-276_CRSCase6Clamshell4o5ozPlenty');
  });
});

import { buildPostharvestIngestRequest } from '.';

describe('buildPostharvestIngestRequest', () => {
  it('returns postharvest ingest request model', () => {
    // ACT
    const result = buildPostharvestIngestRequest({
      username: 'bishopthesprinkler',
      siteName: 'LAX1',
      farmName: 'LAX1',
      lotName: '5-LAX1-CRC-123',
      skuName: 'KC1Clamshell4o5ozPlenty4.5oz',
    });

    // ASSERT
    expect(result).toEqual({
      createdBy: 'bishopthesprinkler',
      site: 'LAX1',
      farm: 'LAX1',
      lot: '5-LAX1-CRC-123',
      sku: 'KC1Clamshell4o5ozPlenty4.5oz',
      path: 'sites/LAX1/areas/PrimaryPostHarvest/lines/Packaging',
    });
  });
});

import { Level } from '@plentyag/brand-ui/src/components/status-label/types';

import { getIngestStatus } from '.';

describe('getIngestStatus ', () => {
  it('returns status level PASSED', () => {
    const result = getIngestStatus({
      status: 'PASS',
      id: '4e6ebade-e862-4a81-942b-5c64fd2eee24',
      createdAt: '2023-04-06T09:43:55.933033Z',
      createdBy: 'pmisra',
      failureReason: '',
      updatedAt: '2023-04-06T09:43:55.933033Z',
      updatedBy: 'pmisra',
      site: 'LAX1',
      farm: 'LAX1',
      lot: '6-LAX1-C11-94',
      netSuiteItem: '5-003-0004-05',
      path: 'sites/LAX1/areas/PrimaryPostHarvest/lines/Packaging',
      observationsCreatedAt: '2023-04-06T09:43:55.242Z',
      observationsPublished: 1,
      sku: 'C11Case6Clamshell4o5ozMarketside4.0oz',
      tallyResults: null,
    });

    expect(result).toEqual(Level.PASSED);
  });

  it('returns status level FAILED', () => {
    const result = getIngestStatus({
      status: 'FAIL',
      id: '4e6ebade-e862-4a81-942b-5c64fd2eee24',
      createdAt: '2023-04-06T09:43:55.933033Z',
      createdBy: 'pmisra',
      failureReason: '',
      updatedAt: '2023-04-06T09:43:55.933033Z',
      updatedBy: 'pmisra',
      site: 'LAX1',
      farm: 'LAX1',
      lot: '6-LAX1-C11-94',
      netSuiteItem: '5-003-0004-05',
      path: 'sites/LAX1/areas/PrimaryPostHarvest/lines/Packaging',
      observationsCreatedAt: '2023-04-06T09:43:55.242Z',
      observationsPublished: 1,
      sku: 'C11Case6Clamshell4o5ozMarketside4.0oz',
      tallyResults: null,
    });

    expect(result).toEqual(Level.FAILED);
  });
});

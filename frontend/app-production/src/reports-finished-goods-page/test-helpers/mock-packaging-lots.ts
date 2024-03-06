import { PackagingLot, PackagingLotTestStatus } from '@plentyag/core/src/types';

export const mockPackagingLot: PackagingLot = {
  createdAt: '2022-08-07T00:00:20.052Z',
  id: '54688a82-1a2e-4750-ad09-e7205896e110',
  lotName: '5-LAX1-C11-219',
  materialType: 'PACKAGING_LOT',
  product: 'C11',
  properties: {
    farmName: 'LAX1',
    overriddenLtStatus: PackagingLotTestStatus.NONE,
    overriddenQaStatus: PackagingLotTestStatus.NONE,
    packDate: '2022-08-07',
    passedLtStatus: PackagingLotTestStatus.NONE,
    passedQaStatus: PackagingLotTestStatus.NONE,
    releasedAt: null,
    siteName: 'LAX1',
  },
  updatedAt: '2022-08-07T01:46:06.262Z',
};

export const mockPackagingLotWithReleaseDetails: PackagingLot = {
  createdAt: '2022-08-07T00:00:20.052Z',
  id: '54688a82-1a2e-4750-ad09-e7205896e110',
  lotName: '5-LAX1-C11-219',
  materialType: 'PACKAGING_LOT',
  product: 'C11',
  properties: {
    farmName: 'LAX1',
    overriddenLtStatus: PackagingLotTestStatus.NONE,
    overriddenQaStatus: PackagingLotTestStatus.NONE,
    packDate: '2022-08-07',
    passedLtStatus: PackagingLotTestStatus.NONE,
    passedQaStatus: PackagingLotTestStatus.NONE,
    releasedAt: null,
    siteName: 'LAX1',
    skuReleaseDetails: [
      {
        nsItem: '5-003-0004-06',
        overriddenLtStatus: PackagingLotTestStatus.NONE,
        overriddenQaStatus: PackagingLotTestStatus.NONE,
        passedLtStatus: PackagingLotTestStatus.NONE,
        passedQaStatus: PackagingLotTestStatus.NONE,
        releasedAt: null,
      },
    ],
  },
  updatedAt: '2022-08-07T01:46:06.262Z',
};

export const mockReleasedPackagingLot: PackagingLot = {
  createdAt: '2022-08-11T00:04:04.876Z',
  id: 'a65efb1f-2ad2-4c20-8ac8-a3b1a7909f99',
  lotName: '5-LAX1-KC1-223',
  materialType: 'PACKAGING_LOT',
  product: 'KC1',
  properties: {
    farmName: 'LAX1',
    overriddenLtStatus: PackagingLotTestStatus.NONE,
    overriddenQaStatus: PackagingLotTestStatus.NONE,
    packDate: '2022-08-11',
    packageComponents: [],
    passedLtStatus: PackagingLotTestStatus.NONE,
    passedQaStatus: PackagingLotTestStatus.NONE,
    releasedAt: '2022-08-11T00:04:04.876Z',
    siteName: 'LAX1',
  },
  updatedAt: '2022-08-11T00:04:04.876Z',
};

export const mockReleasedPackagingLotWithReleaseDetails: PackagingLot = {
  createdAt: '2022-08-11T00:04:04.876Z',
  id: 'a65efb1f-2ad2-4c20-8ac8-a3b1a7909f99',
  lotName: '5-LAX1-KC1-223',
  materialType: 'PACKAGING_LOT',
  product: 'KC1',
  properties: {
    farmName: 'LAX1',
    overriddenLtStatus: PackagingLotTestStatus.NONE,
    overriddenQaStatus: PackagingLotTestStatus.NONE,
    packDate: '2022-08-11',
    packageComponents: [],
    passedLtStatus: PackagingLotTestStatus.NONE,
    passedQaStatus: PackagingLotTestStatus.NONE,
    releasedAt: '2022-08-11T00:04:04.876Z',
    siteName: 'LAX1',
    skuReleaseDetails: [
      {
        nsItem: '5-005-0004-07',
        overriddenLtStatus: PackagingLotTestStatus.NONE,
        overriddenQaStatus: PackagingLotTestStatus.NONE,
        passedLtStatus: PackagingLotTestStatus.PASS,
        passedQaStatus: PackagingLotTestStatus.PASS,
        releasedAt: '2022-08-11T00:04:04.876Z',
      },
    ],
  },
  updatedAt: '2022-08-11T00:04:04.876Z',
};

export const mockPackagingLotWithHold: PackagingLot = {
  createdAt: '2022-08-11T00:04:04.876Z',
  id: 'a65efb1f-2ad2-4c20-8ac8-a3b1a7909f99',
  lotName: '5-LAX1-KC1-223',
  materialType: 'PACKAGING_LOT',
  product: 'KC1',
  properties: {
    farmName: 'LAX1',
    overriddenLtStatus: PackagingLotTestStatus.NONE,
    overriddenQaStatus: PackagingLotTestStatus.NONE,
    packDate: '2022-08-11',
    packageComponents: [],
    passedLtStatus: PackagingLotTestStatus.HOLD,
    passedQaStatus: PackagingLotTestStatus.NONE,
    releasedAt: null,
    siteName: 'LAX1',
  },
  updatedAt: '2022-08-11T00:04:04.876Z',
};

export const mockPackagingLotWithOverride: PackagingLot = {
  createdAt: '2022-09-02T00:08:11.773Z',
  id: '0c914f7e-4cbe-4a80-96e3-cfde8048e4d0',
  lotName: '5-LAX1-C11-245',
  materialType: 'PACKAGING_LOT',
  product: 'C11',
  properties: {
    farmName: 'LAX1',
    overriddenLtAuthor: 'otapia',
    overriddenLtNotes:
      'Testing lab test long string in the notes section to see how is the behavior in the UI in toggle view',
    overriddenLtStatus: PackagingLotTestStatus.FAIL,
    overriddenLtUpdatedAt: '2022-09-02T13:12:37.587Z',
    overriddenQaAuthor: 'otapia',
    overriddenQaNotes:
      'Testing QA long string in the notes section to see how is the behavior in the UI in toggle view',
    overriddenQaStatus: PackagingLotTestStatus.HOLD,
    overriddenQaUpdatedAt: '2022-09-02T13:12:23.751Z',
    packDate: '2022-09-02',
    packageComponents: {
      empty: true,
      traversableAgain: true,
    },
    passedLtStatus: PackagingLotTestStatus.NONE,
    passedQaStatus: PackagingLotTestStatus.NONE,
    releasedAt: null,
    siteName: 'LAX1',
  },
  updatedAt: '2022-09-02T13:12:36.333Z',
};

export const mockPackagingLotWithReleaseDetailsOverride: PackagingLot = {
  createdAt: '2022-09-02T00:08:11.773Z',
  id: '0c914f7e-4cbe-4a80-96e3-cfde8048e4d0',
  lotName: '5-LAX1-C11-245',
  materialType: 'PACKAGING_LOT',
  product: 'C11',
  properties: {
    farmName: 'LAX1',
    overriddenLtStatus: PackagingLotTestStatus.NONE,
    overriddenQaStatus: PackagingLotTestStatus.NONE,
    packDate: '2022-09-02',
    packageComponents: {
      empty: true,
      traversableAgain: true,
    },
    passedLtStatus: PackagingLotTestStatus.NONE,
    passedQaStatus: PackagingLotTestStatus.NONE,
    releasedAt: null,
    siteName: 'LAX1',
    skuReleaseDetails: [
      {
        nsItem: '5-003-0004-06',
        overriddenLtAuthor: 'otapia',
        overriddenLtNotes:
          'Testing lab test long string in the notes section to see how is the behavior in the UI in toggle view',
        overriddenLtStatus: PackagingLotTestStatus.FAIL,
        overriddenLtUpdatedAt: '2022-09-02T13:12:37.587Z',
        overriddenQaAuthor: 'otapia',
        overriddenQaNotes:
          'Testing QA long string in the notes section to see how is the behavior in the UI in toggle view',
        overriddenQaStatus: PackagingLotTestStatus.HOLD,
        overriddenQaUpdatedAt: '2022-09-02T13:12:23.751Z',
        passedLtStatus: PackagingLotTestStatus.NONE,
        passedQaStatus: PackagingLotTestStatus.NONE,
        releasedAt: null,
      },
    ],
  },
  updatedAt: '2022-09-02T13:12:36.333Z',
};

export const mockPackagingLots: PackagingLot[] = [
  mockPackagingLot,
  mockPackagingLotWithOverride,
  mockReleasedPackagingLot,
];

export const mockPackagingLotsWithReleaseDetails: PackagingLot[] = [
  mockPackagingLotWithReleaseDetails,
  mockPackagingLotWithReleaseDetailsOverride,
  mockReleasedPackagingLotWithReleaseDetails,
];

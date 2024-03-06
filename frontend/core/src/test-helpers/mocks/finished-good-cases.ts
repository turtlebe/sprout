import { FinishedGoodCase, PackagingLot, PackagingLotTestStatus } from '@plentyag/core/src/types';

export const mockFinishedGoodCasesSku: FinishedGoodCase = {
  createdAt: '2022-08-11T21:32:45.290Z',
  id: '30828428-75d5-451d-8c01-043bf691a345',
  lotName: '1234567',
  materialType: 'FINISHED_GOOD',
  product: 'C11',
  properties: {
    sku: 'C11Case6Clamshell4o5oz',
    ptiLabelQrCodeContent: {
      caseId: '1234567',
      lot: '5-LAX1-C11-219',
      item: '5-003-0004-06',
      packageType: 'Case6Clamshell4o5oz',
    },
  },
  updatedAt: '2022-08-11T21:32:45.290Z',
};

export const mockFinishedGoodCasesCrop: FinishedGoodCase = {
  createdAt: '2022-08-02T16:37:50.975Z',
  id: '948425de-7231-472c-96f9-e78f1e2a49be',
  lotName: 'b5ebeab7-4692-4369-96f6-a5ec69398987-1050004',
  materialType: 'FINISHED_GOOD',
  product: 'BRN',
  properties: {
    previousProduct: 'JCC',
    version: 2.0,
  },
  updatedAt: '2022-08-02T18:27:04.419Z',
};

export const mockFinishedGoodsCases: FinishedGoodCase[] = [mockFinishedGoodCasesSku, mockFinishedGoodCasesCrop];

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

export const mockPackagingLotWithReleaseDetailsAndHold: PackagingLot = {
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
        passedLtStatus: PackagingLotTestStatus.HOLD,
        passedQaStatus: PackagingLotTestStatus.HOLD,
        releasedAt: null,
      },
    ],
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

export const mockPackagingLotWithReleaseDetailsAndHoldOverride: PackagingLot = {
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
        overriddenLtStatus: PackagingLotTestStatus.HOLD,
        overriddenQaStatus: PackagingLotTestStatus.HOLD,
        passedLtStatus: PackagingLotTestStatus.NONE,
        passedQaStatus: PackagingLotTestStatus.FAIL,
        releasedAt: null,
      },
    ],
  },
  updatedAt: '2022-08-11T00:04:04.876Z',
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

export const mockPackagingLotsRecord: Record<string, PackagingLot> = {
  [mockPackagingLot.lotName]: mockPackagingLot,
  [mockPackagingLotWithOverride.lotName]: mockPackagingLotWithOverride,
  [mockReleasedPackagingLot.lotName]: mockReleasedPackagingLot,
};

export const mockPackagingLotsWithReleaseDetails: PackagingLot[] = [
  mockPackagingLotWithReleaseDetails,
  mockPackagingLotWithReleaseDetailsOverride,
  mockReleasedPackagingLotWithReleaseDetails,
];

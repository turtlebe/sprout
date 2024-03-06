import { PostharvestSkuTally, PostharvestTally } from '../types';

export const mockPostharvestTallyMultipleSku: PostharvestTally = {
  site: 'LAX1',
  farm: 'LAX1',
  lot: '5-LAX1-CRS-276',
  skuTallies: [
    {
      sku: 'CRSCase6Clamshell4o5ozPlenty',
      tallyResults: {
        assessmentTally: [
          {
            name: 'tubWeight',
            values: {
              PASS: 1,
              FAIL: 1,
            },
          },
          {
            name: 'lotCodeCorrect',
            values: {
              PASS: 2,
              FAIL: 0,
            },
          },
        ],
        firstAuditAt: '2023-02-25T19:09:01.786450Z',
        lastAuditAt: '2023-02-25T19:09:01.863029Z',
        totalAudits: 2,
      },
    },
    {
      sku: 'KC1Clamshell4o5ozPlenty4.5oz',
      tallyResults: {
        assessmentTally: [
          {
            name: 'tubWeight',
            values: {
              PASS: 1,
              FAIL: 2,
            },
          },
          {
            name: 'lotCodeCorrect',
            values: {
              PASS: 3,
            },
          },
        ],
        firstAuditAt: '2023-02-25T19:09:01.786450Z',
        lastAuditAt: '2023-02-25T19:09:01.863029Z',
        totalAudits: 3,
      },
    },
  ],
  totalTally: {
    assessmentTally: [
      {
        name: 'tubWeight',
        values: {
          PASS: 2,
          FAIL: 3,
        },
      },
      {
        name: 'lotCodeCorrect',
        values: {
          PASS: 5,
        },
      },
    ],
    firstAuditAt: '2023-02-25T19:09:01.786450Z',
    lastAuditAt: '2023-02-25T19:09:01.909777Z',
    totalAudits: 5,
  },
};

export const mockPostharvestTallyOneSku: PostharvestTally = {
  site: 'LAX1',
  farm: 'LAX1',
  lot: '5-LAX1-C11-287',
  skuTallies: [
    {
      sku: 'KC1Clamshell4o5ozPlenty4.5oz',
      tallyResults: {
        assessmentTally: [
          {
            name: 'tubWeight',
            values: {
              PASS: 1,
              FAIL: 2,
            },
          },
          {
            name: 'lotCodeCorrect',
            values: {
              PASS: 3,
            },
          },
          {
            name: 'bestByDateCorrect',
            values: {
              PASS: 3,
            },
          },
          {
            name: 'fullSealAssessment',
            values: {
              PASS: 3,
            },
          },
          {
            name: 'labelCorrectAndAligned',
            values: {
              PASS: 3,
            },
          },
          {
            name: 'moldDecay',
            values: {
              PASS: 3,
            },
          },
          {
            name: 'largeLeaves',
            values: {
              PASS: 3,
            },
          },
          {
            name: 'longStems',
            values: {
              FAIL: 3,
            },
          },
          {
            name: 'edema',
            values: {
              PASS: 3,
            },
          },
          {
            name: 'extraneousVegetativeMaterial',
            values: {
              PASS: 3,
            },
          },
          {
            name: 'plantHealth',
            values: {
              PASS: 3,
            },
          },
          {
            name: 'foreignMaterial',
            values: {
              PASS: 3,
            },
          },
        ],
        firstAuditAt: '2023-02-25T19:09:01.786450Z',
        lastAuditAt: '2023-02-25T19:09:01.863029Z',
        totalAudits: 3,
      },
    },
  ],
  totalTally: {
    assessmentTally: [
      {
        name: 'tubWeight',
        values: {
          PASS: 1,
          FAIL: 2,
        },
      },
      {
        name: 'lotCodeCorrect',
        values: {
          PASS: 3,
        },
      },
      {
        name: 'bestByDateCorrect',
        values: {
          PASS: 3,
        },
      },
      {
        name: 'fullSealAssessment',
        values: {
          PASS: 3,
        },
      },
      {
        name: 'labelCorrectAndAligned',
        values: {
          PASS: 3,
        },
      },
      {
        name: 'moldDecay',
        values: {
          PASS: 3,
        },
      },
      {
        name: 'largeLeaves',
        values: {
          PASS: 3,
        },
      },
      {
        name: 'longStems',
        values: {
          FAIL: 3,
        },
      },
      {
        name: 'edema',
        values: {
          PASS: 3,
        },
      },
      {
        name: 'extraneousVegetativeMaterial',
        values: {
          PASS: 3,
        },
      },
      {
        name: 'plantHealth',
        values: {
          PASS: 3,
        },
      },
      {
        name: 'foreignMaterial',
        values: {
          PASS: 3,
        },
      },
    ],
    firstAuditAt: '2023-02-25T19:09:01.786450Z',
    lastAuditAt: '2023-02-25T19:09:01.909777Z',
    totalAudits: 3,
  },
};

export const mockPostharvestSkuTally: PostharvestSkuTally = {
  site: 'LAX1',
  farm: 'LAX1',
  lot: '5-LAX1-C11-287',
  sku: 'KC1Clamshell4o5ozPlenty4.5oz',
  tallyResults: {
    assessmentTally: [
      {
        name: 'tubWeight',
        values: {
          PASS: 1,
          FAIL: 2,
        },
      },
      {
        name: 'lotCodeCorrect',
        values: {
          PASS: 3,
        },
      },
      {
        name: 'bestByDateCorrect',
        values: {
          PASS: 3,
        },
      },
      {
        name: 'fullSealAssessment',
        values: {
          PASS: 3,
        },
      },
      {
        name: 'labelCorrectAndAligned',
        values: {
          PASS: 3,
        },
      },
      {
        name: 'moldDecay',
        values: {
          PASS: 3,
        },
      },
      {
        name: 'largeLeaves',
        values: {
          PASS: 3,
        },
      },
      {
        name: 'longStems',
        values: {
          FAIL: 3,
        },
      },
      {
        name: 'edema',
        values: {
          PASS: 3,
        },
      },
      {
        name: 'extraneousVegetativeMaterial',
        values: {
          PASS: 3,
        },
      },
      {
        name: 'plantHealth',
        values: {
          PASS: 3,
        },
      },
      {
        name: 'foreignMaterial',
        values: {
          PASS: 3,
        },
      },
    ],
    firstAuditAt: '2023-02-25T19:09:01.786450Z',
    lastAuditAt: '2023-02-25T19:09:01.863029Z',
    totalAudits: 3,
  },
};

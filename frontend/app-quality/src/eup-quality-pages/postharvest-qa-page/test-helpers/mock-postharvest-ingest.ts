import { PostharvestIngest } from '../types';
import { getPostharvestQaId } from '../utils/get-postharvest-qa-id';

export const mockPostharvestIngest: PostharvestIngest = {
  id: 'c640148f-e9ca-4101-9d01-0f27613ad7b4',
  createdAt: '2023-02-25T20:03:05.592041Z',
  createdBy: 'jvu',
  updatedAt: '2023-02-25T20:03:05.592041Z',
  updatedBy: 'jvu',
  site: 'LAX1',
  farm: 'LAX1',
  status: 'PASS',
  lot: '5-LAX1-CRS-276',
  sku: 'CRSCase6Clamshell4o5ozPlenty',
  path: 'sites/LAX1/areas/PrimaryPostHarvest/lines/Packaging',
  observationsCreatedAt: '2023-02-25T20:03:05.704Z',
  observationsPublished: 4,
  failureReason: '',
  netSuiteItem: '5-003-0004-05',
  tallyResults: {
    assessmentTally: [
      {
        name: 'tubWeight',
        values: {
          PASS: 2,
          FAIL: 1,
        },
      },
      {
        name: 'lotCodeIsCorrect',
        values: {
          PASS: 1,
          FAIL: 2,
        },
      },
    ],
    firstAuditAt: '2023-02-25T19:43:39.139821Z',
    lastAuditAt: '2023-02-25T19:43:39.214827Z',
    totalAudits: 3,
  },
};

export const mockPostharvestIngestWithSevenAudits: PostharvestIngest = {
  id: 'c640148f-e9ca-4101-9d01-0f27613ad7b4',
  createdAt: '2023-02-25T20:03:05.592041Z',
  createdBy: 'jvu',
  updatedAt: '2023-02-25T20:03:05.592041Z',
  updatedBy: 'jvu',
  site: 'LAX1',
  farm: 'LAX1',
  status: 'PASS',
  lot: '5-LAX1-C11-380',
  sku: 'C11Clamshell4o5ozPlenty8.5oz',
  path: 'sites/LAX1/areas/PrimaryPostHarvest/lines/Packaging',
  observationsCreatedAt: '2023-02-25T20:03:05.704Z',
  observationsPublished: 4,
  failureReason: '',
  netSuiteItem: '5-003-0004-05',
  tallyResults: {
    assessmentTally: [
      {
        name: 'tubWeight',
        values: {
          PASS: 4,
          FAIL: 3,
        },
      },
      {
        name: 'lotCodeIsCorrect',
        values: {
          PASS: 2,
          FAIL: 5,
        },
      },
    ],
    firstAuditAt: '2023-02-25T19:43:39.139821Z',
    lastAuditAt: '2023-02-25T19:43:39.214827Z',
    totalAudits: 7,
  },
};

export const mockPostharvestIngestList: PostharvestIngest[] = [
  mockPostharvestIngest,
  mockPostharvestIngestWithSevenAudits,
];

export const mockPostharvestIngestRecord: Record<string, PostharvestIngest> = {
  [getPostharvestQaId(mockPostharvestIngest)]: mockPostharvestIngest,
  [getPostharvestQaId(mockPostharvestIngestWithSevenAudits)]: mockPostharvestIngestWithSevenAudits,
};

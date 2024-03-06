import { PostharvestAuditSummary, PostharvestQaAudit } from '../types';

export const mockPostharvestQaAudits: PostharvestQaAudit[] = [
  {
    id: '35d07805-6c54-4894-a2dc-00b0b3d3af45',
    createdAt: '2022-11-08T19:04:19.997128Z',
    createdBy: 'bishopthesprinkler',
    updatedAt: '2022-11-08T19:04:19.997128Z',
    updatedBy: 'bishopthesprinkler',
    assessments: [
      {
        name: 'lotCodeIsCorrect',
        value: 'PASS',
      },
      {
        name: 'tubWeight',
        value: 16.0,
      },
    ],
    farm: 'LAX1',
    lot: '5-LAX1-CRS-276',
    site: 'LAX1',
    sku: 'CRSCase6Clamshell4o5ozPlenty',
  },
  {
    id: 'b4cbed5d-f9f1-46d5-939f-1713c258585a',
    createdAt: '2022-11-08T19:04:19.997128Z',
    createdBy: 'bishopthesprinkler',
    updatedAt: '2022-11-08T19:04:19.997128Z',
    updatedBy: 'bishopthesprinkler',
    assessments: [
      {
        name: 'lotCodeIsCorrect',
        value: 'FAIL',
      },
      {
        name: 'tubWeight',
        value: 7.59,
      },
    ],
    farm: 'LAX1',
    lot: '5-LAX1-CRS-276',
    site: 'LAX1',
    sku: 'KC1Clamshell4o5ozPlenty4.5oz',
  },
  {
    id: 'a5014d5d-5967-4f6a-b113-a4ab6bfbe02a',
    createdAt: '2022-11-22T21:52:02.253727Z',
    createdBy: 'jvu',
    updatedAt: '2022-11-22T21:52:02.253727Z',
    updatedBy: 'jvu',
    assessments: [
      {
        name: 'tubWeight',
        value: '9.2',
      },
      {
        name: 'lotCodeCorrect',
        value: 'PASS',
      },
      {
        name: 'bestByDateCorrect',
        value: 'PASS',
      },
      {
        name: 'fullSealAssessment',
        value: 'PASS',
      },
      {
        name: 'labelCorrectAndAligned',
        value: 'PASS',
      },
      {
        name: 'moldDecay',
        value: 'PASS',
      },
      {
        name: 'largeLeaves',
        value: 'PASS',
      },
      {
        name: 'longStems',
        value: 'FAIL',
      },
      {
        name: 'edema',
        value: 'PASS',
      },
      {
        name: 'extraneousVegetativeMaterial',
        value: 'PASS',
      },
      {
        name: 'plantHealth',
        value: 'PASS',
      },
      {
        name: 'foreignMaterial',
        value: 'PASS',
      },
    ],
    farm: 'LAX1',
    lot: '5-LAX1-C11-287',
    site: 'LAX1',
    sku: 'KC1Clamshell4o5ozPlenty4.5oz',
  },
  {
    id: '7de37219-bdf5-431b-9847-b7ebe1321d0d',
    createdAt: '2022-11-22T21:52:03.791967Z',
    createdBy: 'jvu',
    updatedAt: '2022-11-22T21:52:03.791967Z',
    updatedBy: 'jvu',
    assessments: [
      {
        name: 'tubWeight',
        value: '5.2',
      },
      {
        name: 'lotCodeCorrect',
        value: 'PASS',
      },
      {
        name: 'bestByDateCorrect',
        value: 'PASS',
      },
      {
        name: 'fullSealAssessment',
        value: 'PASS',
      },
      {
        name: 'labelCorrectAndAligned',
        value: 'PASS',
      },
      {
        name: 'moldDecay',
        value: 'PASS',
      },
      {
        name: 'largeLeaves',
        value: 'FAIL',
      },
      {
        name: 'longStems',
        value: 'FAIL',
      },
      {
        name: 'edema',
        value: 'PASS',
      },
      {
        name: 'extraneousVegetativeMaterial',
        value: 'PASS',
      },
      {
        name: 'plantHealth',
        value: 'PASS',
      },
      {
        name: 'foreignMaterial',
        value: 'FAIL',
      },
    ],
    farm: 'LAX1',
    lot: '5-LAX1-C11-287',
    site: 'LAX1',
    sku: 'KC1Clamshell4o5ozPlenty4.5oz',
  },
  {
    id: 'cb7b8c16-fb96-48e6-add4-0cb6f855a68f',
    createdAt: '2022-11-22T21:52:04.878394Z',
    createdBy: 'jvu',
    updatedAt: '2022-11-22T21:52:04.878394Z',
    updatedBy: 'jvu',
    assessments: [
      {
        name: 'tubWeight',
        value: '9.2',
      },
      {
        name: 'lotCodeCorrect',
        value: 'PASS',
      },
      {
        name: 'bestByDateCorrect',
        value: 'PASS',
      },
      {
        name: 'fullSealAssessment',
        value: 'PASS',
      },
      {
        name: 'labelCorrectAndAligned',
        value: 'PASS',
      },
      {
        name: 'moldDecay',
        value: 'PASS',
      },
      {
        name: 'largeLeaves',
        value: 'PASS',
      },
      {
        name: 'longStems',
        value: 'FAIL',
      },
      {
        name: 'edema',
        value: 'PASS',
      },
      {
        name: 'extraneousVegetativeMaterial',
        value: 'PASS',
      },
      {
        name: 'plantHealth',
        value: 'PASS',
      },
      {
        name: 'foreignMaterial',
        value: 'PASS',
      },
    ],
    farm: 'LAX1',
    lot: '5-LAX1-C11-287',
    site: 'LAX1',
    sku: 'KC1Clamshell4o5ozPlenty4.5oz',
  },
  {
    id: '3397943e-6773-4138-a2ce-336155edc333',
    createdAt: '2022-11-22T21:52:18.891253Z',
    createdBy: 'jvu',
    updatedAt: '2022-11-22T21:52:18.891253Z',
    updatedBy: 'jvu',
    assessments: [
      {
        name: 'tubWeight',
        value: '9.2',
      },
      {
        name: 'lotCodeCorrect',
        value: 'FAIL',
      },
      {
        name: 'bestByDateCorrect',
        value: 'PASS',
      },
      {
        name: 'fullSealAssessment',
        value: 'PASS',
      },
      {
        name: 'labelCorrectAndAligned',
        value: 'PASS',
      },
      {
        name: 'moldDecay',
        value: 'FAIL',
      },
      {
        name: 'largeLeaves',
        value: 'PASS',
      },
      {
        name: 'longStems',
        value: 'FAIL',
      },
      {
        name: 'edema',
        value: 'PASS',
      },
      {
        name: 'extraneousVegetativeMaterial',
        value: 'PASS',
      },
      {
        name: 'plantHealth',
        value: 'PASS',
      },
      {
        name: 'foreignMaterial',
        value: 'PASS',
      },
    ],
    farm: 'LAX1',
    lot: '5-LAX1-C11-193',
    site: 'LAX1',
    sku: 'C11Clamshell4o5ozPlenty8.5oz',
  },
  {
    id: 'a2b78dc0-c35d-4b94-9c68-a7f3bf496a7b',
    createdAt: '2022-11-22T21:52:19.906056Z',
    createdBy: 'jvu',
    updatedAt: '2022-11-22T21:52:19.906056Z',
    updatedBy: 'jvu',
    assessments: [
      {
        name: 'tubWeight',
        value: '9.2',
      },
      {
        name: 'lotCodeCorrect',
        value: 'PASS',
      },
      {
        name: 'bestByDateCorrect',
        value: 'PASS',
      },
      {
        name: 'fullSealAssessment',
        value: 'PASS',
      },
      {
        name: 'labelCorrectAndAligned',
        value: 'PASS',
      },
      {
        name: 'moldDecay',
        value: 'PASS',
      },
      {
        name: 'largeLeaves',
        value: 'PASS',
      },
      {
        name: 'longStems',
        value: 'FAIL',
      },
      {
        name: 'edema',
        value: 'PASS',
      },
      {
        name: 'extraneousVegetativeMaterial',
        value: 'FAIL',
      },
      {
        name: 'plantHealth',
        value: 'PASS',
      },
      {
        name: 'foreignMaterial',
        value: 'PASS',
      },
    ],
    farm: 'LAX1',
    lot: '5-LAX1-C11-193',
    site: 'LAX1',
    sku: 'C11Clamshell4o5ozPlenty8.5oz',
  },
  {
    id: '2682c109-a3f1-466d-9f7f-2d976cb381f2',
    createdAt: '2022-11-22T21:52:20.780015Z',
    createdBy: 'jvu',
    updatedAt: '2022-11-22T21:52:20.780015Z',
    updatedBy: 'jvu',
    assessments: [
      {
        name: 'tubWeight',
        value: '9.2',
      },
      {
        name: 'lotCodeCorrect',
        value: 'PASS',
      },
      {
        name: 'bestByDateCorrect',
        value: 'PASS',
      },
      {
        name: 'fullSealAssessment',
        value: 'FAIL',
      },
      {
        name: 'labelCorrectAndAligned',
        value: 'PASS',
      },
      {
        name: 'moldDecay',
        value: 'PASS',
      },
      {
        name: 'largeLeaves',
        value: 'PASS',
      },
      {
        name: 'longStems',
        value: 'FAIL',
      },
      {
        name: 'edema',
        value: 'PASS',
      },
      {
        name: 'extraneousVegetativeMaterial',
        value: 'PASS',
      },
      {
        name: 'plantHealth',
        value: 'FAIL',
      },
      {
        name: 'foreignMaterial',
        value: 'PASS',
      },
    ],
    farm: 'LAX1',
    lot: '5-LAX1-C11-193',
    site: 'LAX1',
    sku: 'C11Clamshell4o5ozPlenty8.5oz',
  },
];

export const mockPostharvestAuditSummary: PostharvestAuditSummary[] = [
  {
    site: 'LAX1',
    farm: 'LAX1',
    lot: '5-LAX1-CRS-276',
    sku: 'CRSCase6Clamshell4o5ozPlenty',
    totalAudits: 1,
  },
  {
    site: 'LAX1',
    farm: 'LAX1',
    lot: '5-LAX1-CRS-276',
    sku: 'KC1Clamshell4o5ozPlenty4.5oz',
    totalAudits: 1,
  },
  {
    site: 'LAX1',
    farm: 'LAX1',
    lot: '5-LAX1-C11-287',
    sku: 'KC1Clamshell4o5ozPlenty4.5oz',
    totalAudits: 3,
  },
  {
    site: 'LAX1',
    farm: 'LAX1',
    lot: '5-LAX1-C11-193',
    sku: 'C11Clamshell4o5ozPlenty8.5oz',
    totalAudits: 3,
  },
];

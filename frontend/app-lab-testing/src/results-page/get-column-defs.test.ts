import { getColumnDefs } from './get-column-defs';

const SeedTests = new Map([
  ['APC', { range: '.*', units: 'cfu/g' }],
  ['ECC', { range: '<10', units: 'cfu/g' }],
]);
const SoilTests = new Map([
  ['Listeria spp', { range: 'negative', units: '10g' }],
  ['E. coli O157', { range: 'negative', units: '10g' }],
]);

const test1ResultsSchema = new Map([
  ['Seed', SeedTests],
  ['Soil', SoilTests],
]);
const test1SubmissionSchema = new Map([
  ['Seed', ['APC', 'ECC']],
  ['Soil', ['Listeria spp', 'E. coli O157']],
]);

const test2ResultsSchema = new Map([['Seed', SeedTests]]);
const test2SubmissionSchema = new Map([['Seed', ['APC', 'ECC']]]);

const mockLabTestTypes: LT.LabTestType[] = [
  {
    createdAt: '2020-04-01T21:50:33Z',
    createdByUsername: 'test_user',
    labTestKind: 'Human Pathogen',
    labTestName: 'IEH_Human Pathogen',
    labTestProvider: 'IEH',
    labTestTypeId: '73789208-5449-4504-a20f-8917c8c6b25c',
    schemaSubmissionFormBySampleType: test1SubmissionSchema,
    schemaResultsAndThreholdsBySampleType: test1ResultsSchema,
    updatedAt: '2020-04-01T21:51:01Z',
    updatedByUsername: 'test_user',
    allowDifferentSampleTypeCreation: false,
  },
  {
    createdAt: '2020-04-01T21:50:33Z',
    createdByUsername: 'test_user',
    labTestKind: 'Seed Pathogen',
    labTestName: 'IEH_Seed Pathogen',
    labTestProvider: 'IEH',
    labTestTypeId: '28293ec4-56e7-431e-834b-669a9b38306b',
    schemaSubmissionFormBySampleType: test2SubmissionSchema,
    schemaResultsAndThreholdsBySampleType: test2ResultsSchema,
    updatedAt: '2020-04-01T21:51:01Z',
    updatedByUsername: 'test_user',
    allowDifferentSampleTypeCreation: false,
  },
];

describe('getColumnDefs()', () => {
  it('empty labTestType array should return empty array', () => {
    expect(getColumnDefs([], false)).toEqual([]);
  });

  it('should be three test columns', () => {
    const colDefs = getColumnDefs(mockLabTestTypes, false);
    const testCols = colDefs.filter(col => col.groupId === 'tests_results');
    expect(testCols).toHaveLength(3);
  });
});

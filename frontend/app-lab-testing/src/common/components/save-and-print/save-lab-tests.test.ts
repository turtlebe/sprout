import { axiosRequest } from '@plentyag/core/src/utils/request';

import { DumpRefillStatus, HealthStatus } from '../../types/interface-types';

import { saveLabTests } from './save-lab-tests';

jest.mock('@plentyag/core/src/utils/request');

const mockAxiosRequest = axiosRequest as jest.Mock;

function mockFail(mockFailResult) {
  return { isAxiosError: true, response: { data: mockFailResult } };
}

const mockValuesToSave = [
  {
    id: '1',
    username: 'test-user',
    sampleDate: new Date(),
    sampleTime: new Date(),
    labTestKind: 'Seed Pathogen',
    labTestProvider: 'IEH',
    sampleType: 'Seed',
    location: {
      path: 'sites/SSF2',
      id: 'cacbd544-6143-48c3-8a72-f2d09bc2fbb7',
    },
    subLocation: 'sub-loc-1',
    labelDetails: 'some details',
    harvestDates: undefined,
    productCodes: [{ name: 'C11', displayName: 'Sweet Sunrise' }],
    lotCodes: ['lc1', 'lc2'],
    notes: 'note1',
    tests: [
      { name: 'test1', selected: true },
      { name: 'test2', selected: false },
    ],
    trialIds: '1,2',
    treatmentIds: '4,5',
    harvestCycle: '2',
    healthStatus: HealthStatus.Unhealthy,
    materialLot: 'xyz',
    containerId: '123',
    nutrientStage: '',
    dumpRefillStatus: DumpRefillStatus.post,
    providerSampleId: '',
  },
  {
    id: '2',
    username: 'test-user',
    sampleDate: new Date(),
    sampleTime: new Date(),
    labTestKind: 'Seed Pathogen',
    labTestProvider: 'IEH',
    sampleType: 'Seed',
    location: {
      path: 'sites/SSF2',
      id: 'cacbd544-6143-48c3-8a72-f2d09bc2fbb7',
    },
    subLocation: '',
    labelDetails: '',
    harvestDates: undefined,
    productCodes: [],
    lotCodes: [],
    notes: '',
    tests: [],
    trialIds: '',
    treatmentIds: '',
    harvestCycle: '',
    healthStatus: HealthStatus.Empty,
    materialLot: null,
    containerId: undefined,
    nutrientStage: '',
    dumpRefillStatus: DumpRefillStatus.Intermittent,
    providerSampleId: '',
  },
];

describe('saveLabTests', () => {
  afterEach(() => {
    mockAxiosRequest.mockReset();
  });

  it('success getting data', async () => {
    const mockResult = {
      success: true,
      details: [
        {
          index: 1,
          lab_test_sample_id: '5691-4C0A-BF1E',
          lab_test_submission_form_id: '952cb984-fdb5-4a1d-82d7-2e1b4d62c5b0',
        },
        {
          index: 2,
          lab_test_sample_id: '5691-4C0A-BF1F',
          lab_test_submission_form_id: '952cb984-fdb5-4a1d-82d7-2e1b4d62c5b0',
        },
      ],
    };
    mockAxiosRequest.mockResolvedValue({ data: mockResult });

    const result = await saveLabTests(mockValuesToSave, false);
    expect(result).toEqual({
      status: true,
      sampleIds: ['5691-4C0A-BF1E', '5691-4C0A-BF1F'],
      submissionFormId: '952cb984-fdb5-4a1d-82d7-2e1b4d62c5b0',
    });
  });

  it('saves proper data for both create and edit', async () => {
    async function testSendingProperData(isEditing: boolean) {
      const mockResult = {
        success: true,
        details: [
          // not needed for this test
        ],
      };
      mockAxiosRequest.mockResolvedValue({ data: mockResult });
      await saveLabTests(mockValuesToSave, isEditing);

      // date matcher.
      const matchDate = expect.stringMatching(/\d{4}-\d{1,2}-\d{1,2}/);
      const matchTime = expect.stringMatching(/\d{2}:\d{2}/);

      // note: data here has some fields missing from mockValuesToSave as falsely values should be filtered.
      const expectedDataToSave = [
        {
          lab_test_sample_id: '1',
          notes: 'note1',
          label_details: 'some details',
          lab_test_kind: 'Seed Pathogen',
          sample_type: 'Seed',
          farm_def_id: 'cacbd544-6143-48c3-8a72-f2d09bc2fbb7',
          lab_test_limited_to_fields: ['test1'],
          farm_def_path: 'sites/SSF2',
          product_codes: ['C11'],
          sample_date: matchDate,
          sample_time: matchTime,
          lab_test_provider: 'IEH',
          plenty_username: 'test-user',
          lot_codes: ['lc1', 'lc2'],
          sub_location: 'sub-loc-1',
          trial_ids: ['1', '2'],
          treatment_ids: ['4', '5'],
          harvest_cycle: 2,
          health_status: 'Unhealthy',
          material_lot: 'xyz',
          container_id: '123',
          dump_refill_status: 'post',
        },
        {
          lab_test_sample_id: '2',
          lab_test_kind: 'Seed Pathogen',
          sample_type: 'Seed',
          farm_def_id: 'cacbd544-6143-48c3-8a72-f2d09bc2fbb7',
          farm_def_path: 'sites/SSF2',
          sample_date: matchDate,
          sample_time: matchTime,
          lab_test_provider: 'IEH',
          plenty_username: 'test-user',
          dump_refill_status: 'Intermittent',
        },
      ];

      // for creating, lab_test_sample_id should not be included.
      if (!isEditing) {
        delete expectedDataToSave[0].lab_test_sample_id;
        delete expectedDataToSave[1].lab_test_sample_id;
      }

      expect(mockAxiosRequest).toHaveBeenCalledWith({
        data: expectedDataToSave,
        method: isEditing ? 'put' : 'post',
        url: isEditing
          ? '/api/plentyservice/lab-testing-service/update-lab-test-samples'
          : '/api/plentyservice/lab-testing-service/create-lab-test-samples',
      });
    }

    await testSendingProperData(true);
    await testSendingProperData(false);
  });

  describe('error cases', () => {
    it('gives error if backend returns 200 OK without success', async () => {
      const mockResult = {
        success: false,
      };
      mockAxiosRequest.mockResolvedValue({ data: mockResult });
      const result = await saveLabTests(mockValuesToSave, false);
      expect(result.status).toBe(false);
      expect(result.errors).toBeTruthy();
    });

    it('returns two error messages when error details provide error with field name', async () => {
      const mockResult = {
        err_code: 400,
        message: {
          details: [
            {
              error: {
                farm_def_id: [
                  'Farm Def ID is invalid, it must be a valid UUID associated with a Location (Farm Def Path)',
                ],
              },
              index: 1,
              input: {
                farm_def_id: 'abcdef',
                farm_def_path: 'sites/TEST',
                lab_test_kind: 'Seed Pathogen',
                lab_test_limited_to_fields: ['Bacterial ID 16S', 'Fungal ID ITS'],
                lab_test_provider: 'IEH',
                lot_codes: [],
                notes: '',
                plenty_username: 'lneir',
                product_codes: [],
                sample_date: '2020-6-15',
                sample_type: 'Seed',
                sub_location: '',
                label_details: '',
              },
            },
          ],
          error: 'Unable to create lab test sample(s)',
        },
      };
      mockAxiosRequest.mockRejectedValue(mockFail(mockResult));
      const result = await saveLabTests(mockValuesToSave, false);

      expect(result.status).toBe(false);
      expect(result.errors).toHaveLength(2);
      expect(result.errors && result.errors[0]).toBe('Error: Unable to create lab test sample(s)');
      expect(result.errors && result.errors[1]).toBe(
        'Row # 1, Field Name: farm_def_id, Error: Farm Def ID is invalid, it must be a valid UUID associated with a Location (Farm Def Path).\n'
      );
    });

    it('returns two error messages when error details provides no field name', async () => {
      const mockResult = {
        err_code: 400,
        message: {
          details: [
            {
              error: 'some error here',
              index: 1,
              input: {
                farm_def_id: 'abcdef',
                farm_def_path: 'sites/TEST',
                lab_test_kind: 'Seed Pathogen',
                lab_test_limited_to_fields: ['Bacterial ID 16S', 'Fungal ID ITS'],
                lab_test_provider: 'IEH',
                lot_codes: [],
                notes: '',
                plenty_username: 'lneir',
                product_codes: [],
                sample_date: '2020-6-15',
                sample_type: 'Seed',
                sub_location: '',
                label_details: '',
              },
            },
          ],
          error: 'Unable to create lab test sample(s)',
        },
      };
      mockAxiosRequest.mockRejectedValue(mockFail(mockResult));
      const result = await saveLabTests(mockValuesToSave, false);

      expect(result.status).toBe(false);
      expect(result.errors).toHaveLength(2);
      expect(result.errors && result.errors[0]).toBe('Error: Unable to create lab test sample(s)');
      expect(result.errors && result.errors[1]).toBe('Row # 1, Error: some error here.\n');
    });

    it('returns one error message when no error details provided.', async () => {
      const mockResult = {
        err_code: 400,
        message: {
          error: 'Unable to create lab test sample(s)',
        },
      };
      mockAxiosRequest.mockRejectedValue(mockFail(mockResult));
      const result = await saveLabTests(mockValuesToSave, false);

      expect(result.status).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors && result.errors[0]).toBe('Unable to create lab test sample(s)');
    });
  });
});

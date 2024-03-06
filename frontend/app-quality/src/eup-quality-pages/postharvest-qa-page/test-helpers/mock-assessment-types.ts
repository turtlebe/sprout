import { AssessmentTypes, TallyType, ValueType } from '../types';

export const mockAssessmentTypesRecord: Record<string, AssessmentTypes> = {
  tubWeight: {
    id: '101b3314-5590-4f3d-8342-776249607bc3',
    createdAt: '2022-11-22T17:23:03.161033Z',
    createdBy: 'jvu',
    updatedAt: '2022-11-22T17:23:03.161033Z',
    updatedBy: 'jvu',
    label: 'Tub Weight (oz)',
    name: 'tubWeight',
    validation: {
      min: 0,
      max: 10,
      required: true,
    },
    valueType: ValueType.FLOAT,
    uiOrder: 1,
    instructions: {
      tooltip: '5% of the total number of tubs to be inspected in CPT.',
    },
  },
  notes: {
    id: '35d07805-6c54-4894-a2dc-00b0b3d3af45',
    createdAt: '2022-11-22T17:23:03.161033Z',
    createdBy: 'jvu',
    updatedAt: '2022-11-22T17:23:03.161033Z',
    updatedBy: 'jvu',
    label: 'Notes',
    name: 'notes',
    validation: {
      minLength: 5,
      maxLength: 20,
      required: false,
    },
    valueType: ValueType.TEXT,
    uiOrder: 4,
    instructions: null,
  },
  largeLeaves: {
    id: '7ceefd77-f073-4675-a781-7c48f42e9c24',
    createdAt: '2022-11-22T17:23:03.161033Z',
    createdBy: 'jvu',
    updatedAt: '2022-11-22T17:23:03.161033Z',
    updatedBy: 'jvu',
    label: 'Large Leaves',
    name: 'largeLeaves',
    validation: {
      choices: [
        {
          name: 'PASS',
          label: 'Pass',
        },
        {
          name: 'FAIL',
          label: 'Fail',
        },
      ],
      required: true,
    },
    valueType: ValueType.SINGLE_CHOICE,
    uiOrder: 8,
    instructions: {
      tooltip:
        '15% of large leaves reject tub. For 4.5oz, 19+ leaves. For 8oz, 38 leaves. 5% of tubs inspected rejected per lot, switch to destructive testing',
      labelOverride: [
        {
          discriminate: {
            assessmentType: 'skuWeight',
            validation: {
              min: 4,
              max: 6,
            },
          },
          labels: {
            PASS: '0-18 leaves',
            FAIL: '19+ leaves',
          },
        },
        {
          discriminate: {
            assessmentType: 'skuWeight',
            validation: {
              min: 8,
              max: 10,
            },
          },
          labels: {
            PASS: '0-37 leaves',
            FAIL: '38+ leaves',
          },
        },
      ],
    },
  },
  bestByDateCorrect: {
    id: 'e0d8a8cb-211a-48ab-92cd-388c98dd0618',
    createdAt: '2022-12-01T04:35:00.235012Z',
    createdBy: 'jvu',
    updatedAt: '2022-12-06T20:59:37.126337Z',
    updatedBy: 'jvu',
    label: 'Best By Date Correct',
    name: 'bestByDateCorrect',
    validation: {
      choices: [
        {
          name: 'PASS',
          label: 'Pass',
        },
        {
          name: 'FAIL',
          label: 'Fail',
        },
      ],
      required: true,
    },
    valueType: ValueType.SINGLE_CHOICE,
    uiOrder: 9,
    instructions: {
      titleOverride: [
        {
          discriminate: {
            assessmentType: 'bestByDate',
            validation: {
              minLength: 1,
            },
          },
          title: 'Best By {bestByDate}',
        },
      ],
    },
  },
  timestamp: {
    id: 'b573ecdd-92c6-4f36-bd67-2587f3ca27ac',
    createdAt: '2022-12-01T04:35:00.235012Z',
    createdBy: 'jvu',
    updatedAt: '2022-12-06T20:59:37.126337Z',
    updatedBy: 'jvu',
    label: 'Timestamp',
    name: 'timestamp',
    validation: {
      minDateTime: '2018-10-20T16:55:30.00Z',
      maxDateTime: '2022-10-20T16:55:30.00Z',
      required: true,
    },
    valueType: ValueType.DATE_TIME,
    uiOrder: 20,
  },
  timewithseconds: {
    id: 'dad75884-c712-4fd4-863d-57603db2c8aa',
    createdAt: '2022-12-01T04:35:00.235012Z',
    createdBy: 'jvu',
    updatedAt: '2022-12-06T20:59:37.126337Z',
    updatedBy: 'jvu',
    label: 'Time with Seconds',
    name: 'timewithseconds',
    validation: {
      format: 'TIME_WITH_SECONDS',
      required: false,
    },
    valueType: ValueType.DATE_TIME,
    uiOrder: 22,
  },
  tubWeightFloatChoice: {
    id: 'b9a796c5-490f-492f-b646-0fe442da447c',
    createdAt: '2022-11-22T17:23:03.161033Z',
    createdBy: 'jvu',
    updatedAt: '2022-11-22T17:23:03.161033Z',
    updatedBy: 'jvu',
    label: 'Tub Weight Float Choice (oz)',
    name: 'tubWeightFloatChoice',
    validation: {
      required: true,
      choicethresholds: [
        {
          value: TallyType.PASS,
          discriminate: {
            skukey: 'productWeightOz',
            skuvalue: '4',
            validation: {
              max: 10,
              min: 3.76,
            },
          },
        },
        {
          value: TallyType.PASS,
          discriminate: {
            skukey: 'productWeightOz',
            skuvalue: '4.5',
            validation: {
              max: 10,
              min: 4.26,
            },
          },
        },
        {
          value: TallyType.FAIL,
          discriminate: {
            skukey: 'productWeightOz',
            skuvalue: '4',
            validation: {
              max: 3.75,
              min: 0,
            },
          },
        },
        {
          value: TallyType.FAIL,
          discriminate: {
            skukey: 'productWeightOz',
            skuvalue: '4.5',
            validation: {
              max: 4.25,
              min: 0,
            },
          },
        },
      ],
    },
    valueType: ValueType.FLOAT_CHOICE,
    uiOrder: 23,
    instructions: {
      tooltip: '5% of the total number of tubs to be inspected in CPT.',
    },
  },
};

export const mockAssessmentTypes: AssessmentTypes[] = Object.values(mockAssessmentTypesRecord);

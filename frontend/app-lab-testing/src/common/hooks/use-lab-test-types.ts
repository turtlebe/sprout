import { useSwrAxios } from '@plentyag/core/src/hooks/use-swr-axios';
import { isEqual } from 'lodash';
import React from 'react';

const url = '/api/plentyservice/lab-testing-service/list-lab-test-types';

function getLabTestData(labTests: any) {
  const tests = new Map<LT.LabTestName, LT.Schema>();
  Object.keys(labTests).forEach(schemaName => {
    const schemaValue = labTests[schemaName];
    // some schema have null, see: SD-6058.  range and unit will be empty.
    const acceptableRanges = schemaValue?.acceptable_ranges || {};
    let index = 0;
    let range = '';
    Object.keys(acceptableRanges).forEach(rangeKey => {
      const rangeValue = acceptableRanges[rangeKey];
      const lcRangeKey = rangeKey.toLowerCase();
      if (index > 0) {
        range += ', ';
      }
      switch (lcRangeKey) {
        case 'gt':
          range += `>${rangeValue}`;
          break;
        case 'lt':
          range += `<${rangeValue}`;
          break;
        case 'eq':
          // see: SD-6009
          if (rangeValue === '.*') {
            range += 'Always pass';
          } else {
            range += rangeValue;
          }
          break;
        default:
          throw new Error('Invalid range type, must be one of: lt, gt, eq');
      }
      index++;
    });
    const labTestData: LT.Schema = {
      range,
      units: schemaValue?.units || '',
    };
    tests.set(schemaName, labTestData);
  });

  return tests;
}

export const labTestDataProcessor = (data: any): LT.LabTestType[] => {
  if (!data || !data.details || !data.details.lab_test_types) {
    return [];
  }

  return data.details.lab_test_types.map(labType => {
    const schemaResultsBySampleType = new Map<LT.SampleTypeName, Map<LT.LabTestName, LT.Schema>>();
    Object.keys(labType.schema_results_and_thresholds_by_sample_type).forEach(sampleTypeName => {
      schemaResultsBySampleType.set(
        sampleTypeName,
        getLabTestData(labType.schema_results_and_thresholds_by_sample_type[sampleTypeName])
      );
    });

    const schemaSubmissionBySampleType = new Map<LT.SampleTypeName, LT.LabTestName[]>();
    Object.keys(labType.schema_submission_form_by_sample_type).forEach(sampleTypeName => {
      const tests = labType.schema_submission_form_by_sample_type[sampleTypeName];
      schemaSubmissionBySampleType.set(sampleTypeName, tests);
    });

    const labTestTypeItem: LT.LabTestType = {
      createdAt: labType.created_at,
      createdByUsername: labType.created_by_username,
      labTestKind: labType.lab_test_kind,
      labTestName: labType.lab_test_name,
      labTestProvider: labType.lab_test_provider,
      labTestTypeId: labType.lab_test_type_id,
      updatedAt: labType.updated_at,
      updatedByUsername: labType.updated_by_username,
      schemaResultsAndThreholdsBySampleType: schemaResultsBySampleType,
      schemaSubmissionFormBySampleType: schemaSubmissionBySampleType,
      allowDifferentSampleTypeCreation: labType.source.allow_different_sample_type_creation === 'true' ? true : false,
    };
    return labTestTypeItem;
  });
};

export const useLabTestTypes = (
  onError?: (error: Error) => void
): {
  labTestTypes: LT.LabTestType[] | undefined;
  labTestTypesLoadingError: string;
  isLoadingLabTestTypes: boolean;
} => {
  const labTestTypes = React.useRef<LT.LabTestType[] | undefined>(undefined);

  const result = useSwrAxios(
    { url },
    {
      onError: (error: Error) => {
        onError && onError(error);
      },
    }
  );

  const newData = labTestDataProcessor(result.data);
  if (!labTestTypes.current || !isEqual(labTestTypes.current, newData)) {
    labTestTypes.current = newData;
  }

  return {
    labTestTypes: labTestTypes.current,
    labTestTypesLoadingError: result.error?.message || '',
    isLoadingLabTestTypes: !result.data || result.isValidating,
  };
};

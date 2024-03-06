import { EventTypes } from '../types/interface-types';

import { parseLabTestResult } from './parse-lab-test-value';

function parseTestEvents(events: any[]): LT.Event[] {
  return events.map(event => {
    function getLabTestEvent(eventName: any): EventTypes {
      if (EventTypes[eventName]) {
        return eventName;
      }
      throw new Error('Unknown event name: ' + eventName);
    }

    function getAdditionalProps(props: any): LT.AdditionalProperties {
      const additionalProps: LT.AdditionalProperties = {};
      if (props['lab_test_blob_id']) {
        additionalProps.labTestBlobId = props['lab_test_blob_id'];
      }
      if (props['lab_test_submission_form_id']) {
        additionalProps.labTestSubmissionFormId = props['lab_test_submission_form_id'];
      }
      return additionalProps;
    }

    return {
      type: getLabTestEvent(event.type),
      createdAt: new Date(event.created_at),
      username: event.username,
      additionalProperties: getAdditionalProps(event.additional_properties) || {},
    };
  });
}

const processLabTestItem = (labTest: any): LT.SampleResult => {
  const tests: [string, LT.TestResult][] = [];
  Object.keys(labTest.lab_test_results).forEach(item => {
    const result = parseLabTestResult(labTest.lab_test_results[item]);
    tests.push([item, result]);
  });

  const sample = labTest.lab_test_sample;
  const info: LT.SampleResultInfo = {
    farmDefId: sample.farm_def_id,
    farmDefPath: sample.farm_def_path,
    lotCodes: Array.isArray(sample.lot_codes) ? sample.lot_codes : [],
    notes: sample.notes || '',
    predictedHarvestDates: Array.isArray(sample.predicted_harvest_dates) ? sample.predicted_harvest_dates : [],
    productCodes: Array.isArray(sample.product_codes) ? sample.product_codes : [],
    sampleDate: sample.sample_date,
    sampleTime: sample.sample_time || '',
    sampleType: sample.sample_type,
    subLocation: sample.sub_location || '',
    labelDetails: sample.label_details || '',
    trialIds: sample.trial_ids || [],
    treatmentIds: sample.treatment_ids || [],
    materialLot: sample.material_lot || '',
    containerId: sample.container_id || '',
    healthStatus: sample.health_status || '',
    harvestCycle: sample.harvest_cycle,
    nutrientStage: sample.nutrient_stage,
    dumpRefillStatus: sample.dump_refill_status,
    providerSampleId: sample.provider_sample_id || '',
  };
  const item: LT.SampleResult = {
    labTestEvents: parseTestEvents(labTest.lab_test_events),
    labTestKind: labTest.lab_test_kind,
    labTestPassed: labTest.lab_test_passed,
    labTestProvider: labTest.lab_test_provider,
    labTestResults: new Map<LT.LabTestName, LT.TestResult>(tests),
    info,
    labTestSampleId: labTest.lab_test_sample_id,
  };
  return item;
};

export const processLabTestResults = (data: any): LT.SampleResult[] => {
  if (!data || !data.details || !data.details.total_pages || !data.details.lab_tests) {
    return [];
  }
  return data.details.lab_tests.map((labTest): LT.SampleResult => processLabTestItem(labTest));
};

import { parseErrorMessage } from '@plentyag/core/src/utils/parse-error-message';
import { axiosRequest } from '@plentyag/core/src/utils/request';

import { convertDateToISOString, convertDateToTimeString } from '../../utils/date-utils';

import { isFieldError } from './type-guards';

function convertCommaSeparatedStringToArray(list: string) {
  const result: string[] = [];
  list?.split(',').forEach(item => {
    if (item.trim()) {
      result.push(item);
    }
  });
  return result;
}

export async function saveLabTests(
  values: LT.CreateItem[],
  isEdit: boolean
): Promise<{ status: boolean; sampleIds?: string[]; submissionFormId?: string; errors?: string[] }> {
  const url = `/api/plentyservice/lab-testing-service/${isEdit ? 'update' : 'create'}-lab-test-samples`;

  const data = values.map(labTestItem => {
    let predictedHarvestDates;
    if (labTestItem.harvestDates && labTestItem.harvestDates.begin && labTestItem.harvestDates.end) {
      predictedHarvestDates = [
        convertDateToISOString(labTestItem.harvestDates.begin),
        convertDateToISOString(labTestItem.harvestDates.end),
      ];
    }
    let productCodes: string[] = [];
    if (labTestItem.productCodes) {
      productCodes = labTestItem.productCodes.map(code => code.name);
    }
    let labTests: string[] = [];
    if (labTestItem.tests) {
      labTests = labTestItem.tests.reduce<string[]>((accum, curr) => {
        if (curr.selected) {
          accum.push(curr.name);
        }
        return accum;
      }, []);
    }

    return {
      lab_test_sample_id: isEdit ? labTestItem.id : undefined, // when editing, need to provide the original sample id.
      notes: labTestItem.notes,
      label_details: labTestItem.labelDetails,
      lab_test_kind: labTestItem.labTestKind,
      predicted_harvest_dates: predictedHarvestDates,
      sample_type: labTestItem.sampleType,
      farm_def_id: labTestItem.location.id,
      lab_test_limited_to_fields: labTests,
      farm_def_path: labTestItem.location.path,
      product_codes: productCodes,
      sample_date: convertDateToISOString(labTestItem.sampleDate),
      sample_time: labTestItem.sampleTime ? convertDateToTimeString(labTestItem.sampleTime) : null,
      lab_test_provider: labTestItem.labTestProvider,
      plenty_username: labTestItem.username,
      lot_codes: labTestItem.lotCodes,
      sub_location: labTestItem.subLocation,
      trial_ids: convertCommaSeparatedStringToArray(labTestItem.trialIds),
      treatment_ids: convertCommaSeparatedStringToArray(labTestItem.treatmentIds),
      harvest_cycle: labTestItem.harvestCycle && Number(labTestItem.harvestCycle),
      health_status: labTestItem.healthStatus,
      nutrient_stage: labTestItem.nutrientStage,
      dump_refill_status: labTestItem.dumpRefillStatus,
      material_lot: labTestItem.materialLot,
      container_id: labTestItem.containerId,
      provider_sample_id: labTestItem.providerSampleId,
    };
  });

  // trim sbumitted data to remove 'undefined', 'null', empty strings or empty array values.
  data.forEach(item => {
    Object.keys(item).forEach(key => {
      const value = item[key];
      if (
        value === undefined ||
        value === null ||
        (typeof value === 'string' && !value) ||
        (Array.isArray(value) && value.length === 0)
      ) {
        delete item[key];
      }
    });
    return item;
  });

  try {
    const result = await axiosRequest<LT.SaveResult>({ url, method: isEdit ? 'put' : 'post', data });
    if (result.data && result.data.success) {
      const sampleIds: string[] = [];
      let submissionFormId;
      if (Array.isArray(result.data.details)) {
        result.data.details.forEach(detail => {
          // backend return non-zero based index.
          const index = detail.index - 1;
          sampleIds[index] = detail.lab_test_sample_id;
          if (!submissionFormId && detail.lab_test_submission_form_id) {
            submissionFormId = detail.lab_test_submission_form_id;
          }
        });
      }
      return {
        status: true,
        sampleIds,
        submissionFormId: submissionFormId,
      };
    }
    throw new Error('Saving lab tests returned 200 OK but did not indicate success.');
  } catch (err) {
    const errors: string[] = [];
    const saveError = err.response?.data?.message;
    if (saveError && saveError.details) {
      errors.push(`Error: ${saveError.error}`);
      saveError.details.forEach(detail => {
        const index = detail.index;
        const errorData = detail.error;
        if (isFieldError(errorData)) {
          for (const fieldName in errorData) {
            // error should be array with single string item.
            const error = errorData[fieldName][0];
            errors.push(`Row # ${index}, Field Name: ${fieldName}, Error: ${error}.\n`);
          }
        } else if (typeof errorData === 'string') {
          // default case where error is just a string.
          errors.push(`Row # ${index}, Error: ${errorData}.\n`);
        }
      });
    } else {
      errors.push(parseErrorMessage(err));
    }

    return {
      status: false,
      errors,
    };
  }
}

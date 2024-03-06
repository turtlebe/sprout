import { getShortenedPath } from '@plentyag/core/src/utils';

import { EventTypes } from '../../../common/types/interface-types';
import {
  convert24HourTimeToAMPMFormat,
  convertDateToString,
  convertISOStringToViewString,
} from '../../../common/utils/date-utils';
import { generateTestHeaderKey } from '../../../common/utils/generate-test-header-key';
import { cols } from '../../table-cols';
import { hasFormSubmissionEvent, hasLabTestResult } from '../../utils/has-lab-event';

interface Parameters {
  data: LT.SampleResult[];
  containerRef: React.RefObject<HTMLDivElement>;
  tableApi: LT.TableApi;
  hasEditPermissions: boolean;
  username: string;
}
export function createTableData({ data, containerRef, tableApi, hasEditPermissions, username }: Parameters) {
  return data.map(item => {
    const createdEvent = item.labTestEvents.find(event => event.type === EventTypes.created);
    if (!createdEvent) {
      throw new Error('No created event found in lab test: ' + item);
    }
    const data: LT.RowData = {};

    data[cols.CREATED] = {
      date: createdEvent.createdAt,
      view: convertDateToString(createdEvent.createdAt),
    };

    data[cols.SAMPLE_DATE] = convertISOStringToViewString(item.info.sampleDate);
    data[cols.SAMPLE_TIME] = convert24HourTimeToAMPMFormat(item.info.sampleTime);

    data[cols.SAMPLE_CREATOR] = createdEvent.username;

    data[cols.TEST_TYPE] = item.labTestKind;

    const formSubmissionMetadata: LT.DownloadMetadata[] = [];
    item.labTestEvents.forEach(event => {
      if (hasFormSubmissionEvent(event)) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        const uuid = event.additionalProperties.labTestSubmissionFormId as string;
        formSubmissionMetadata.push({
          uuid,
          date: event.createdAt,
        });
      }
    });
    data[cols.LAB] = { labTestProvider: item.labTestProvider, formSubmissionMetadata, containerRef };

    data[cols.SAMPLE_TYPE] = item.info.sampleType;

    data[cols.LOCATION] = getShortenedPath(item.info.farmDefPath, true);
    data[cols.SUB_LOCATION] = item.info.subLocation;
    data[cols.NOTES] = {
      notes: item.info.notes,
      labTestSampleId: item.labTestSampleId,
      username,
      containerRef,
    };

    data[cols.LABEL_DETAILS] = item.info.labelDetails;

    data[cols.PRODUCT_CODES] = item.info.productCodes;
    data[cols.LOT_CODES] = item.info.lotCodes;
    data[cols.HARVEST_DATES] = item.info.predictedHarvestDates;
    data[cols.LAB_TEST_SAMPLE_ID] = item.labTestSampleId;

    function onManualFieldChanged() {
      // refresh so we get newly updated data for now.
      // ToDo: for better efficiency, look at way for replace data for row.
      tableApi.refreshCache();
    }

    item.labTestResults.forEach((labTestResult, testName) => {
      const agKey = generateTestHeaderKey({
        provider: item.labTestProvider,
        kind: item.labTestKind,
        sampleType: item.info.sampleType,
        testName,
      });

      // manual field can be updated by user, see SD-6081
      const isManualField =
        typeof labTestResult.value === 'string' && labTestResult.value.toLocaleLowerCase() === 'manual';

      const cellData = {
        isManualField,
        result: labTestResult.value,
        status: labTestResult.passed,
      };
      if (isManualField) {
        // manual column has extra fields.
        cellData['containerRef'] = containerRef;
        cellData['onManualFieldChanged'] = onManualFieldChanged;
        cellData['labTestFieldName'] = testName;
        cellData['labTestSampleId'] = item.labTestSampleId;
        cellData['hasEditPermissions'] = hasEditPermissions;
      }

      data[agKey] = cellData;
    });

    const testResultsMetaData: LT.DownloadMetadata[] = [];
    item.labTestEvents.forEach(event => {
      if (hasLabTestResult(event)) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        const uuid = event.additionalProperties.labTestBlobId as string;
        testResultsMetaData.push({
          uuid,
          date: event.createdAt,
        });
      }
    });

    // see: https://plentyag.atlassian.net/browse/SD-5971
    let statusData;
    if (typeof item.labTestPassed === 'boolean') {
      // all results recevied, has either: passed or failed.
      statusData = item.labTestPassed ? 'pass' : 'fail';
    } else if (testResultsMetaData.length > 0) {
      // has some test results.
      statusData = 'partial';
    } else {
      // no tests results recevied yet.
      statusData = 'pending';
    }

    // overall status
    data[cols.STATUS] = { status: item.labTestPassed, data: statusData, testResultsMetaData, containerRef };

    data[cols.TRIAL_IDS] = item.info.trialIds;
    data[cols.TREATMENT_IDS] = item.info.treatmentIds;

    data[cols.HARVEST_CYCLE] = item.info.harvestCycle;
    data[cols.HEALTH_STATUS] = item.info.healthStatus;

    data[cols.NUTRIENT_STAGE] = item.info.nutrientStage;
    data[cols.DUMP_REFILL_STATUS] = item.info.dumpRefillStatus;

    data[cols.PROVIDER_SAMPLE_ID] = item.info.providerSampleId;

    data[cols.MATERIAL_LOT] = item.info.materialLot;
    data[cols.CONTAINER_ID] = item.info.containerId;

    // store original data in special field to get easy access for selection.
    data[cols.ORIG_DATA] = item;

    return data;
  });
}

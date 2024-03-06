import { DumpRefillStatus, HealthStatus } from '../../common/types/interface-types';
import { convertStringToDate, convertTimeToDate } from '../../common/utils/date-utils';

import { getId } from './get-id';
import { getTests } from './get-tests';

interface GetInitialValues {
  username: string;
  labTestTypes: LT.LabTestType[];
  initialSelectedRows: LT.SampleResult[] | undefined;
  isEdit: boolean;
}

export function getInitialValues({ username, labTestTypes, initialSelectedRows, isEdit }: GetInitialValues) {
  const initialValue: LT.CreateItem = {
    id: getId(),
    username,
    sampleDate: new Date(),
    sampleTime: null,
    labTestKind: '',
    labTestProvider: '',
    sampleType: '',
    location: { path: '', id: '', farmCode: undefined },
    subLocation: '',
    labelDetails: '',
    harvestDates: undefined,
    productCodes: [],
    notes: '',
    lotCodes: [],
    trialIds: '',
    treatmentIds: '',
    harvestCycle: '',
    healthStatus: HealthStatus.Empty,
    materialLot: '',
    containerId: '',
    tests: [],
    nutrientStage: '',
    dumpRefillStatus: DumpRefillStatus.Empty,
    providerSampleId: '',
  };

  let initialValues = [initialValue];

  const hasData = labTestTypes && labTestTypes.length;

  if (hasData && Array.isArray(initialSelectedRows) && initialSelectedRows.length > 0) {
    initialValues = initialSelectedRows.map(item => {
      const productCodes: LT.ProductCode[] = [];
      if (Array.isArray(item.info.productCodes)) {
        item.info.productCodes.forEach(code => {
          productCodes.push({
            name: code,
            displayName: '',
          });
        });
      }
      const tests = getTests({
        labTypeData: labTestTypes,
        labTestKind: item.labTestKind,
        labSampleType: item.info.sampleType,
        labTestProvider: item.labTestProvider,
      });
      // set selected field based on results provided.
      tests.forEach(testItem => {
        const resultItem = item.labTestResults.get(testItem.name);
        if (resultItem) {
          // if test does not apply then skip adding to selection.
          testItem.selected = !resultItem.isNA;
        }
      });
      if (isEdit) {
        const editValue: LT.CreateItem = {
          username,
          id: item.labTestSampleId,
          sampleDate: convertStringToDate(item.info.sampleDate),
          sampleTime: item.info?.sampleTime ? convertTimeToDate(item.info.sampleTime) : null,
          labTestKind: item?.labTestKind || '',
          labTestProvider: item?.labTestProvider || '',
          sampleType: item.info?.sampleType || '',
          location:
            item.info?.farmDefPath && item.info?.farmDefId
              ? {
                  path: item.info.farmDefPath,
                  id: item.info.farmDefId,
                }
              : { path: '', id: '' },
          subLocation: item.info?.subLocation || '',
          labelDetails: item.info?.labelDetails || '',
          harvestDates:
            item.info.predictedHarvestDates?.length >= 2
              ? {
                  begin: convertStringToDate(item.info.predictedHarvestDates[0]),
                  end: convertStringToDate(item.info.predictedHarvestDates[item.info.predictedHarvestDates.length - 1]),
                }
              : undefined,
          productCodes,
          notes: item.info?.notes || '',
          lotCodes: item.info?.lotCodes || [],
          trialIds: item.info.trialIds?.join(',') || '',
          treatmentIds: item.info.treatmentIds?.join(',') || '',
          harvestCycle: item.info.harvestCycle?.toString() || '',
          healthStatus: item.info.healthStatus || HealthStatus.Empty,
          materialLot: item.info?.materialLot || '',
          containerId: item.info?.containerId || '',
          tests,
          nutrientStage: item.info?.nutrientStage || '',
          dumpRefillStatus: item.info?.dumpRefillStatus || DumpRefillStatus.Empty,
          providerSampleId: item.info?.providerSampleId || '',
        };
        return editValue;
      }
      // for create we carry over only limited set of fields.
      const carryOverValue: LT.CreateItem = {
        ...initialValue,
        id: getId(),
        // values below are carried over from results view
        labTestKind: item.labTestKind,
        labTestProvider: item.labTestProvider,
        sampleType: item.info.sampleType,
        location: {
          path: item.info.farmDefPath,
          id: item.info.farmDefId,
        },
        subLocation: item.info.subLocation,
        labelDetails: item.info.labelDetails,
        productCodes,
        lotCodes: item.info.lotCodes,
        tests,
      };
      return carryOverValue;
    });
  }

  return { initialValues, initialValue };
}

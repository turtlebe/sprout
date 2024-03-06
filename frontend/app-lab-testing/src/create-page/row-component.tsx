import { makeStyles } from '@material-ui/styles';
import { isEqual } from 'lodash';
import React from 'react';

import { DumpRefillStatus, HealthStatus } from '../common/types/interface-types';
import { validateDate, validateTime } from '../common/utils/date-utils';

import { commonStyles } from './common-styles';
import {
  DateField,
  DateRangeField,
  FarmDefField,
  LabSampleType,
  LabTestKind,
  LabTestProvider,
  LabTests,
  LotCodes,
  ProductCodes,
  SelectField,
  SubloctionField,
  TextField,
  TimeField,
} from './fields';
import { getFieldName } from './utils/formik-helpers';
import {
  validateContainerId,
  validateFarmDef,
  validateHarvestCycle,
  validateLabelDetails,
  validateMaterialLot,
  validateNotes,
  validateRequired,
  validateSubLoc,
  validateTreatmentIds,
  validateTrialIds,
} from './utils/validate-field';

const useStyles = makeStyles(theme => ({
  ...commonStyles(theme),
}));

export interface RowData {
  index: number;
  item: LT.CreateItem;
  labTestTypes: LT.LabTestType[];
  setFieldValue: LT.SetFieldValueType;
  setWarning: LT.SetFormWarning;
  hiddenColumns: LT.HiddenColumns;
}

const healthStatusOptions = Object.keys(HealthStatus).map<LT.SelectOption>(key => {
  return {
    value: HealthStatus[key],
    label: key,
  };
});

const dumpRefillStatusOptions = Object.keys(DumpRefillStatus).map<LT.SelectOption>(key => {
  return {
    value: DumpRefillStatus[key],
    label: key,
  };
});

interface RowComponent {
  rowData: RowData;
  isEdit: boolean;
}

// Renders a single row of a create form.
export const RowComponent: React.FC<RowComponent> = React.memo<RowComponent>(
  ({ rowData, isEdit }) => {
    const classes = useStyles({});

    const { index, item, labTestTypes, setFieldValue, setWarning, hiddenColumns } = rowData;

    return (
      <React.Fragment>
        <DateField
          className={classes.smallHeader}
          validate={validateDate}
          fieldName={getFieldName(index, 'sampleDate')}
          label="Sample Date"
          disabled={isEdit}
        />
        <TimeField
          className={classes.smallHeader}
          validate={validateTime}
          fieldName={getFieldName(index, 'sampleTime')}
          label="Sample Time"
          disabled={false}
        />
        <LabTestProvider
          className={classes.smallHeader}
          labTestProviderFieldName={getFieldName(index, 'labTestProvider')}
          lastTestKindFieldName={getFieldName(index, 'labTestKind')}
          labTestKind={item.labTestKind}
          labTestProvider={item.labTestProvider}
          labTypeData={labTestTypes}
          setFieldValue={setFieldValue}
          disabled={isEdit}
        />
        {!hiddenColumns['providerSampleId'] && (
          <TextField
            className={classes.smallHeader}
            fieldName={getFieldName(index, 'providerSampleId')}
            validate={(value: string) => item.labTestProvider == 'Novacrop' && validateRequired(value)}
            spellCheck={false}
            label="NovaCrop Id"
            disabled={isEdit}
          />
        )}
        <LabTestKind
          className={classes.mediumHeader}
          labTestProviderFieldName={getFieldName(index, 'labTestProvider')}
          lastTestKindFieldName={getFieldName(index, 'labTestKind')}
          validate={(value: string) => validateRequired(value)}
          labTestKind={item.labTestKind}
          labTestProvider={item.labTestProvider}
          labTypeData={labTestTypes}
          setFieldValue={setFieldValue}
          disabled={isEdit}
        />
        <LabSampleType
          className={classes.extraExtraLargeHeader}
          labSampleTypeFieldName={getFieldName(index, 'sampleType')}
          labTestKind={item.labTestKind}
          labTestProvider={item.labTestProvider}
          labTypeData={labTestTypes}
          setFieldValue={setFieldValue}
          disabled={isEdit}
        />

        <FarmDefField
          validate={validateFarmDef}
          className={classes.locationHeader}
          fieldName={getFieldName(index, 'location')}
          label="Location"
          disabled={isEdit}
        />

        <SubloctionField
          className={classes.largeHeader}
          validate={validateSubLoc}
          location={item.location}
          fieldName={getFieldName(index, 'subLocation')}
          disabled={false}
        />

        {/* name of field changes from tower location to label details --> see: https://plentyag.atlassian.net/browse/SD-6173 */}
        <TextField
          validate={validateLabelDetails}
          className={classes.mediumHeader}
          label="Label Detail"
          fieldName={getFieldName(index, 'labelDetails')}
        />

        <ProductCodes
          fieldName={getFieldName(index, 'productCodes')}
          selectedProductCodes={item.productCodes}
          location={item.location}
          className={classes.productCodesHeader}
          setFieldValue={setFieldValue}
          disabled={false}
        />
        <DateRangeField
          className={classes.extraLargeHeader}
          label="Predicted Harvest Dates"
          labSampleType={item.sampleType}
          harvestDates={item.harvestDates}
          setWarning={setWarning}
          fieldName={getFieldName(index, 'harvestDates')}
          disabled={isEdit}
        />

        <LotCodes
          fieldName={getFieldName(index, 'lotCodes')}
          className={classes.smallHeader}
          harvestDates={item.harvestDates}
          setFieldValue={setFieldValue}
          productCodes={item.productCodes}
          location={item.location}
        />

        <TextField
          className={classes.mediumHeader}
          validate={validateNotes}
          label="Notes"
          fieldName={getFieldName(index, 'notes')}
        />
        <TextField
          className={classes.mediumHeader}
          fieldName={getFieldName(index, 'trialIds')}
          spellCheck={false}
          label="Trial IDs"
          validate={fieldValue => validateTrialIds(fieldValue, !!item.treatmentIds)}
        />

        <TextField
          className={classes.mediumHeader}
          fieldName={getFieldName(index, 'treatmentIds')}
          spellCheck={false}
          label="Treatment IDs"
          validate={validateTreatmentIds}
        />

        <TextField
          className={classes.smallHeader}
          fieldName={getFieldName(index, 'harvestCycle')}
          spellCheck={false}
          label="Harvest Cycle"
          validate={validateHarvestCycle}
        />

        <SelectField
          className={classes.smallHeader}
          fieldName={getFieldName(index, 'healthStatus')}
          options={healthStatusOptions}
          label="Health Status"
          disabled={isEdit}
        />

        {!hiddenColumns['materialLot'] && (
          <TextField
            className={classes.extraLargeHeader}
            fieldName={getFieldName(index, 'materialLot')}
            label="Material Lot"
            spellCheck={false}
            validate={validateMaterialLot}
            disabled={isEdit}
          />
        )}

        {!hiddenColumns['containerId'] && (
          <TextField
            className={classes.extraLargeHeader}
            fieldName={getFieldName(index, 'containerId')}
            label="Container ID"
            spellCheck={false}
            validate={validateContainerId}
            disabled={isEdit}
          />
        )}

        <TextField
          className={classes.smallHeader}
          fieldName={getFieldName(index, 'nutrientStage')}
          spellCheck={false}
          label="Nutrient Stage"
          disabled={isEdit}
        />

        <SelectField
          className={classes.mediumHeader}
          fieldName={getFieldName(index, 'dumpRefillStatus')}
          options={dumpRefillStatusOptions}
          label="Dump-Refill Status"
          disabled={isEdit}
        />

        <LabTests
          fieldName={getFieldName(index, 'tests')}
          className={classes.testsHeader}
          labTypeData={labTestTypes}
          labTestKind={item.labTestKind}
          labTestProvider={item.labTestProvider}
          labSampleType={item.sampleType}
          setFieldValue={setFieldValue}
          tests={item.tests}
          disabled={isEdit}
        />
      </React.Fragment>
    );
  },
  (prevProps, currProps) => isEqual(prevProps, currProps)
);

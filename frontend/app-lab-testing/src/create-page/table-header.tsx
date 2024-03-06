import { makeStyles, Tooltip, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { commonStyles } from './common-styles';

export const useStyles = makeStyles(theme => ({
  ...commonStyles(theme),
  tableHeaderWrapper: {
    flex: 'none',
    paddingLeft: '48px',
    marginBottom: theme.spacing(1),
    borderBottom: '1px solid black',
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden',
  },
}));

interface TableHeader {
  hiddenColumns: LT.HiddenColumns;
}

export const TableHeader = React.forwardRef<HTMLDivElement, TableHeader>((props, ref) => {
  const classes = useStyles({});

  const headerItem = ({
    fieldName,
    text,
    tooltip,
    className,
  }: {
    fieldName: LT.CreateCols;
    text: string;
    tooltip: string;
    className: string;
  }) => {
    if (props.hiddenColumns[fieldName]) {
      return null; // hidden
    }
    return (
      <Tooltip title={tooltip} placement="top-start" arrow>
        <Typography variant="h6" className={className}>
          {text}
        </Typography>
      </Tooltip>
    );
  };
  return (
    <div ref={ref} className={classes.tableHeaderWrapper}>
      {headerItem({
        fieldName: 'sampleDate',
        text: 'Sample Date',
        tooltip: 'Sample Date will show in printed label.',
        className: classes.smallHeader,
      })}
      {headerItem({
        fieldName: 'sampleTime',
        text: 'Sample Time',
        tooltip: 'Sample Time.',
        className: classes.smallHeader,
      })}
      {headerItem({
        fieldName: 'labTestProvider',
        text: 'Lab Provider',
        tooltip: 'Lab Test Provider',
        className: classes.smallHeader,
      })}
      {headerItem({
        fieldName: 'providerSampleId',
        text: 'NovaCrop Id',
        tooltip: 'NovaCrop Id',
        className: classes.smallHeader,
      })}
      {headerItem({
        fieldName: 'labTestKind',
        text: 'Lab Test Type',
        tooltip: 'Lab Test Type',
        className: classes.mediumHeader,
      })}
      {headerItem({
        fieldName: 'sampleType',
        text: 'Sample Type',
        tooltip: 'Sample Type will show in printed label.',
        className: classes.extraExtraLargeHeader,
      })}
      {headerItem({
        fieldName: 'location',
        text: 'Location',
        tooltip: 'If no Label Detail is provided, Location will print on label.',
        className: classes.locationHeader,
      })}
      {headerItem({
        fieldName: 'subLocation',
        text: 'Sublocation',
        tooltip: 'Additional location information.',
        className: classes.largeHeader,
      })}
      {headerItem({
        fieldName: 'labelDetails',
        text: 'Label Details',
        tooltip: 'Label Details will show in printed label if it has a value.',
        className: classes.mediumHeader,
      })}
      {headerItem({
        fieldName: 'productCodes',
        text: 'Product Codes',
        tooltip: 'Product Codes',
        className: classes.productCodesHeader,
      })}
      {headerItem({
        fieldName: 'harvestDates',
        text: 'Predicted Harvest Dates',
        tooltip: 'Predicted Harvest Dates',
        className: classes.extraLargeHeader,
      })}
      {headerItem({
        fieldName: 'lotCodes',
        text: 'Lot Codes',
        tooltip: 'Lot Codes will show in printed label.',
        className: classes.smallHeader,
      })}
      {headerItem({
        fieldName: 'notes',
        text: 'Notes',
        tooltip: 'Free form field to add extra data about test.',
        className: classes.mediumHeader,
      })}
      {headerItem({ fieldName: 'trialIds', text: 'Trial', tooltip: 'Trial numbers', className: classes.mediumHeader })}
      {headerItem({
        fieldName: 'treatmentIds',
        text: 'Treatment',
        tooltip: 'Treatment numbers',
        className: classes.mediumHeader,
      })}
      {headerItem({
        fieldName: 'harvestCycle',
        text: 'Harvest Cycle',
        tooltip: 'Harvest Cycle number',
        className: classes.smallHeader,
      })}
      {headerItem({
        fieldName: 'healthStatus',
        text: 'Health Status',
        tooltip: 'Health Status',
        className: classes.smallHeader,
      })}
      {headerItem({
        fieldName: 'materialLot',
        text: 'Material Lot',
        tooltip: 'Material Lot',
        className: classes.extraLargeHeader,
      })}
      {headerItem({
        fieldName: 'containerId',
        text: 'Container ID',
        tooltip: 'Container ID',
        className: classes.extraLargeHeader,
      })}
      {headerItem({
        fieldName: 'nutrientStage',
        text: 'Nutrient Stage',
        tooltip: 'Nutrient Stage',
        className: classes.smallHeader,
      })}
      {headerItem({
        fieldName: 'dumpRefillStatus',
        text: 'Dump-Refill Status',
        tooltip: 'Dump-Refill Status',
        className: classes.mediumHeader,
      })}
      {headerItem({ fieldName: 'tests', text: 'Tests', tooltip: 'Tests to be run.', className: classes.testsHeader })}
    </div>
  );
});

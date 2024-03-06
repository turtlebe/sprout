import { useHasEditPermission } from '@plentyag/app-perception/src/api/use-has-edit-permission';
import { Button, makeStyles, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { SearchResult } from '../../common/types/interfaces';

const useStyles = makeStyles({
  root: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  details: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    margin: '5px',
  },
  detailColumn: {
    width: '100%',
    marginTop: '0px',
    marginLeft: '10px',
    display: 'flex',
    flexDirection: 'column',
  },
  detailList: {
    maxHeight: '150px',
    width: '100%',
    marginTop: '0px',
    display: 'flex',
    flexDirection: 'column',
    listStyleType: 'none',
    paddingLeft: '0px',
    overflow: 'auto',
  },
  labelList: {
    width: '100%',
    listStyleType: 'none',
    paddingLeft: '20px',
  },
  labelSetHeader: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
  },
});

interface DetailsView {
  result: SearchResult;
  showLabelingView: () => void;
}

export const DetailsView: React.FC<DetailsView> = ({ result, showLabelingView }) => {
  const classes = useStyles({});
  const hasEditPermission = useHasEditPermission();

  const detailsView = (
    <div>
      <div className={classes.details}>
        <div className={classes.detailColumn}>
          <Typography variant={'h6'}>Object</Typography>
          <ul className={classes.detailList}>
            <li>UUID: {result?.uuid}</li>
            <li>Owner: {result?.owner}</li>
            <li>Date: {result?.dtUtc}</li>
            <li>Device: {result?.devices[0]?.deviceSerial}</li>
            <li>Farm Object: {result?.farmObjectKind}</li>
            <li>Container Type: {result?.containerType}</li>
            <li>Material ID: {result?.materialId}</li>
          </ul>
        </div>
        <div className={classes.detailColumn}>
          <Typography variant={'h6'}>Location</Typography>
          <ul className={classes.detailList}>
            <li>Site: {result?.site}</li>
            <li>Area: {result?.area}</li>
            <li>Line: {result?.line}</li>
            <li>Machine: {result?.machine}</li>
            <li>Container: {result?.containerId}</li>
            <li>Region: {result?.devices[0]?.locationDetail?.detailed?.region?.value}</li>
          </ul>
        </div>
        <div className={classes.detailColumn}>
          <div className={classes.labelSetHeader}>
            <Typography variant={'h6'}>Label Sets</Typography>
            {hasEditPermission && <Button onClick={() => showLabelingView()}>Label Image</Button>}
          </div>
          <ul className={classes.detailList}>
            {result?.labelSets?.map((labelSet, lsi) => (
              <li key={lsi}>
                {labelSet.name}
                <ul className={classes.labelList}>
                  {labelSet?.labels?.map((label, li) => (
                    <li key={li}>{label.label}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
        <div className={classes.detailColumn}>
          <Typography variant={'h6'}>Tags</Typography>
          <ul className={classes.detailList}>
            {result?.objectTags?.map((objectTag, oti) => (
              <li key={oti}>{objectTag.tagId.name}</li>
            ))}
          </ul>
        </div>
        <div className={classes.detailColumn}>
          <Typography variant={'h6'}>Trials</Typography>
          <ul className={classes.detailList}>
            <li>Trial Number: {result?.trials[0]?.trialNum}</li>
            <li>Treatment Number: {result?.trials[0]?.treatmentNum}</li>
          </ul>
        </div>
      </div>
    </div>
  );

  return <div className={classes.root}>{detailsView}</div>;
};

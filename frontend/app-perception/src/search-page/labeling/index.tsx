import { addLabelSet, updateLabelSet } from '@plentyag/app-perception/src/api/save-label-sets';
import { Snackbar, useSnackbar } from '@plentyag/brand-ui/src/components/snackbar';
import { Button, CircularProgress, Divider, makeStyles } from '@plentyag/brand-ui/src/material-ui/core';
import { cloneDeep, round } from 'lodash';
import React, { useEffect, useState } from 'react';

import { LabelCanvas } from './label-canvas';
import { LabelToolbar } from './label-toolbar';
import { LabelView } from './label-view';
import { SaveLabelSetsDialog } from './save-labelsets-dialog';
import useLabelingStore from './state';

const useStyles = makeStyles({
  root: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  imageLabel: {
    flex: 1,
    overflow: 'auto',
  },
  toolbar: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  labelCanvas: {
    minHeight: '0px',
    minWidth: '0px',
    width: '100%',
    height: '100%',
    dsplay: 'flex',
    justifyContent: 'space-around',
  },
  bottomContainer: {
    height: '20%',
    minHeight: '180px',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
  },
  labelView: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
  },
  buttonContainer: {
    width: '10%',
    minwidth: '100px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
  },
  button: {
    margin: '10px',
  },
});

interface ImageLabeling {
  currentPerceptionObject: IL.PerceptionObject;
  labelingInstructions?: IL.LabelingInstructions;
}

export const ImageLabeling: React.FC<ImageLabeling> = ({ currentPerceptionObject, labelingInstructions }) => {
  const classes = useStyles({});
  const snackbarProps = useSnackbar();
  const [labelingState, labelingActions] = useLabelingStore<IL.LabelingState, IL.LabelingActions>();

  // saving labels
  const [saveLabelSetDialogOpen, setSaveLabelSetDialogOpen] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<React.ReactNode>(null);

  /**
   * Reset any label set changes that has been created
   */
  const resetLabelSets = () => {
    labelingActions.reset();
    if (currentPerceptionObject?.labelSets) {
      const labelSetCopy = cloneDeep(currentPerceptionObject.labelSets);
      labelingActions.setCurrentLabelSets(labelSetCopy);
    }
  };

  /**
   * reset everything when a new search result (perception object) is selected
   */
  useEffect(() => {
    if (currentPerceptionObject) {
      resetLabelSets();
    }
  }, [currentPerceptionObject?.uuid]);

  /**
   * Set labeling instructions when they change
   */
  useEffect(() => {
    labelingActions.setLabelingInstructions(labelingInstructions);
  }, [labelingInstructions]);

  /**
   * Final processing / cleanup of label set then save to backend service
   *
   * @param labelSet
   */
  const saveLabelSet = async (labelSet: IL.LabelSet) => {
    let result;
    labelSet.labels.forEach(label => {
      // the ID field and newLabel metadata fields are using in the label drawing process for new labels
      // but it should be cleared before writing to the DB so that it can be given its own id in the DB
      if (label.metadata['newLabel']) {
        delete label.id;
        delete label.metadata['newLabel'];
      }
      // remove unused fields that can cause problem with update
      delete label['modifiedDtUtc'];
      delete label['uploadDtUtc'];
      delete label['probabilityScore'];
      // scale geometry points to the images natural width and heigh
      // round to 10 digits of percision (max allowed by perception service)
      label.geometryPoints = label.geometryPoints?.map(point => [
        round(+(point[0] / labelingState.scaleFactor), 10),
        round(+(point[1] / labelingState.scaleFactor), 10),
      ]);
    });

    // new label sets are denoted by  negative ids
    if (labelSet.id < 0) {
      // add new label set to the object
      delete labelSet.id;
      result = await addLabelSet(currentPerceptionObject.uuid, labelSet);
    } else {
      // update existing label set
      delete labelSet['modifiedDtUtc'];
      delete labelSet['uploadDtUtc'];
      delete labelSet['isGroundTruth'];
      result = await updateLabelSet(currentPerceptionObject.uuid, labelSet.id, labelSet);
    }

    // update saving progress dialog with results from this labelset
    if (!result.status) {
      setSaveStatus(
        <>
          <span>
            LabelSet {labelSet.name} failed save with error {result.error}
          </span>
        </>
      );
      return null;
    } else {
      setSaveStatus(
        <>
          <span>LabelSet {labelSet.name} sucessfully saved</span>
        </>
      );
    }

    return result.data;
  };

  /**
   * Currently saving at the label set level, any modification to label set (or a label in label set) gets the
   * label set added to the modified list.
   */
  const saveLabelSets = async () => {
    setSaveLabelSetDialogOpen(true);
    let savedLabelSets = [];
    for (const labelSetId of labelingState.modifiedLabelSetIds) {
      const labelSet = labelingState.currentLabelSets.find(labelSet => labelSet.id === labelSetId);
      setSaveStatus(
        <>
          <span>Saving {labelSet.name} </span>
          <CircularProgress size={15} />
        </>
      );
      const savedLabelSet: IL.LabelSet = await saveLabelSet(cloneDeep(labelSet));
      if (savedLabelSet) {
        savedLabelSets = [...savedLabelSets, savedLabelSet];
      }
    }
    // updated the perception object with any changed labelsets now that they have been saved to the perception service
    const savedLabelSetIds = savedLabelSets.map(labelSet => labelSet.id);
    const unchagedLabelSets = currentPerceptionObject.labelSets.filter(
      labelSet => !savedLabelSetIds.includes(labelSet.id)
    );
    currentPerceptionObject.labelSets = [...cloneDeep(unchagedLabelSets), ...savedLabelSets];
    // reset modified label sets
    labelingActions.setModifiedLabelSetIds([]);
  };

  /**
   * Close save label sets dialog
   */
  const handleCloseSaveLabelSets = () => {
    setSaveLabelSetDialogOpen(false);
  };

  const labelView = (
    <div className={classes.bottomContainer}>
      <div className={classes.labelView}>
        <LabelView />
      </div>
      <div className={classes.buttonContainer}>
        <Button
          onClick={() => {
            (async () => await saveLabelSets())().catch(() => {
              snackbarProps.errorSnackbar({ message: 'Error in save label sets, please contact admin.' });
            });
          }}
          className={classes.button}
          color="primary"
          variant="contained"
        >
          Save
        </Button>
        <Button onClick={() => resetLabelSets()} className={classes.button} color="primary" variant="contained">
          Reset
        </Button>
      </div>
    </div>
  );

  const imageLabeling = (
    <React.Fragment>
      <div className={classes.toolbar}>
        <LabelToolbar />
      </div>
      <div className={classes.imageLabel}>
        <div className={classes.labelCanvas}>
          <LabelCanvas imageURL={currentPerceptionObject.s3Url} />
        </div>
      </div>
      <Divider orientation="horizontal" />
      {labelView}
    </React.Fragment>
  );

  return (
    <div className={classes.root}>
      <Snackbar {...snackbarProps} />
      {imageLabeling}
      <SaveLabelSetsDialog
        status={saveStatus}
        open={saveLabelSetDialogOpen}
        handleCloseSaveLabelSets={handleCloseSaveLabelSets}
      />
    </div>
  );
};

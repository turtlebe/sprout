import { Add, Delete } from '@material-ui/icons';
import {
  Button,
  Checkbox,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Typography,
} from '@plentyag/brand-ui/src/material-ui/core';
import useCoreStore from '@plentyag/core/src/core-store';
import React, { useState } from 'react';

import { NewLabelSetDialog } from './new-labelset-dialog';
import useLabelingStore from './state';

const useStyles = makeStyles({
  root: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  labelView: {
    margin: '5px',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  labelSetsHeader: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignContent: 'center',
  },
  labelSets: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  labels: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  list: {
    maxHeight: '150px',
    width: '100%',
    marginTop: '0px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
  },
  listItem: {
    padding: '0px',
  },
});

export const LabelView: React.FC = () => {
  const classes = useStyles({});
  const [coreState] = useCoreStore();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [labelingState, labelingActions] = useLabelingStore<IL.LabelingState, IL.LabelingActions>();

  /**
   * Open new label set dialog
   */
  const addLabelSet = () => {
    setDialogOpen(true);
  };

  /**
   * Create the new label set and set it selected
   *
   * @param name name of the new label set
   */
  const handleCreateLabelSet = (name: string) => {
    setDialogOpen(false);
    const labelSetID = -1 * Date.now(); // negative id used to indicate new labelset
    const labelSet: IL.LabelSet = {
      id: labelSetID,
      name: name,
      isGroundTruth: true,
      labelerType: 'user',
      labelerId: coreState.currentUser.username,
      labels: null,
    };
    labelingActions.setActiveLabelSet(labelSet);
  };

  /**
   * Close new label set dialog
   */
  const handleCancelLabelSet = () => {
    setDialogOpen(false);
  };

  /**
   * Set active label set when it is selected
   *
   * @param labelSet selected label set
   */
  const handleLabelSetClick = labelSet => {
    labelingActions.setActiveLabelSet(labelSet);
  };

  /**
   * Delete the label set (from the current and modified label set lists) and set a new active label set if available
   *
   * @param deleteLabelSet label set to delete
   */
  const handleDeleteLabelSet = deleteLabelSet => {
    const updatedLabelSets = labelingState.currentLabelSets.filter(labelSet => labelSet.id !== deleteLabelSet.id);
    labelingActions.setActiveLabelSet(updatedLabelSets.length > 0 ? updatedLabelSets[0] : null);
    labelingActions.setCurrentLabelSets(updatedLabelSets);
    labelingActions.setModifiedLabelSetIds(labelingState.modifiedLabelSetIds.filter(id => id !== deleteLabelSet.id));
  };

  /**
   * Add or remove label from active labels when its checkbox is clicked
   *
   * @param clickedLabel selected label
   */
  const handleLabelToggle = clickedLabel => {
    const currentIndex = labelingState.activeLabels.map(label => label.id).indexOf(clickedLabel.id);
    if (currentIndex === -1) {
      labelingActions.setActiveLabels([...labelingState.activeLabels, clickedLabel]);
    } else {
      labelingActions.setActiveLabels(labelingState.activeLabels.filter(label => label.id !== clickedLabel.id));
    }
  };

  /**
   * Delete the label and remove the label from the active label set and the active labels list
   *
   * @param deleteLabel label to delete
   */
  const handleDeleteLabel = deleteLabel => {
    const activeLabels = labelingState.activeLabels.filter(label => label.id !== deleteLabel.id);
    const activeLabelSet = {
      ...labelingState.activeLabelSet,
      labels: labelingState.activeLabelSet.labels.filter(label => label.id !== deleteLabel.id),
    };
    labelingActions.setActiveLabelSet(activeLabelSet);
    labelingActions.setActiveLabels(activeLabels);

    // update active labelset in current label sets
    labelingActions.setCurrentLabelSets(
      labelingState.currentLabelSets.map(labelSet => (labelSet.id === activeLabelSet.id ? activeLabelSet : labelSet))
    );
  };

  const labelView = (
    <div>
      <div className={classes.labelView}>
        <div className={classes.labelSets}>
          <div className={classes.labelSetsHeader}>
            <Typography variant={'h6'}>Label Sets </Typography>
            <Button startIcon={<Add />} onClick={() => addLabelSet()}>
              New Label Set
            </Button>
          </div>
          {labelingState.currentLabelSets && labelingState.activeLabelSet && (
            <List dense={true} className={classes.list}>
              {labelingState.currentLabelSets.map((labelSet, lsi) => (
                <ListItem
                  key={lsi}
                  role={undefined}
                  button
                  className={classes.listItem}
                  onClick={() => handleLabelSetClick(labelSet)}
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={labelSet.id === labelingState.activeLabelSet.id}
                      disableRipple={true}
                    />
                  </ListItemIcon>
                  <ListItemText id={`${labelSet.id}`} primary={labelSet.name} />
                  {labelSet.id < 0 && (
                    <ListItemSecondaryAction>
                      <IconButton onClick={() => handleDeleteLabelSet(labelSet)} edge="end" icon={Delete} />
                    </ListItemSecondaryAction>
                  )}
                </ListItem>
              ))}
            </List>
          )}
        </div>
        <div className={classes.labels}>
          <Typography variant={'h6'}>Labels</Typography>
          {labelingState.activeLabelSet && labelingState.activeLabelSet.labels && (
            <List dense={true} className={classes.list}>
              {labelingState.activeLabelSet.labels.map((label, li) => (
                <ListItem
                  key={li}
                  role={undefined}
                  button
                  className={classes.listItem}
                  onClick={() => handleLabelToggle(label)}
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={labelingState.activeLabels.some(activeLabel => activeLabel.id === label.id)}
                      disableRipple={true}
                    />
                  </ListItemIcon>
                  <ListItemText id={label.label} primary={label.label} />
                  {label.id < 0 && (
                    <ListItemSecondaryAction>
                      <IconButton onClick={() => handleDeleteLabel(label)} edge="end" icon={Delete} />
                    </ListItemSecondaryAction>
                  )}
                </ListItem>
              ))}
            </List>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className={classes.root}>
      {labelView}
      <NewLabelSetDialog
        open={dialogOpen}
        handleCreateLabelSet={handleCreateLabelSet}
        handleCancelLabelSet={handleCancelLabelSet}
      />
    </div>
  );
};

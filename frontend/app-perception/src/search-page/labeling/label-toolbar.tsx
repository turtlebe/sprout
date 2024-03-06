import { AddBox, AddCircleOutline, AddLocation, FormatShapes, Label } from '@material-ui/icons';
import { Button, FormControl, InputLabel, makeStyles, MenuItem, Select } from '@plentyag/brand-ui/src/material-ui/core';
import React, { useState } from 'react';

import { LabelingTool } from './enums';
import { LabelingInstructionsDialog } from './label-instructions-dialog';
import useLabelingStore from './state';

const useStyles = makeStyles({
  root: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  toolbar: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
  },
  formControl: {
    minWidth: 120,
  },
});

export const LabelToolbar: React.FC = () => {
  const classes = useStyles({});
  const [instructionsDialogOpen, setInstructionsDialogOpen] = useState<boolean>(false);
  const [labelingState, labelingActions] = useLabelingStore<IL.LabelingState, IL.LabelingActions>();

  /**
   * Close labeling instructions dialog
   */
  const handleCloseLabelingInstructions = () => {
    setInstructionsDialogOpen(false);
  };

  const labelToolbar = (
    <div>
      <div className={classes.toolbar}>
        <Button onClick={() => setInstructionsDialogOpen(true)}>Instructions</Button>
        <Button
          startIcon={<Label />}
          disabled={!labelingState.activeLabelSet}
          onClick={() => labelingActions.setActiveLabelingTool(LabelingTool.IMAGE)}
        >
          Tag
        </Button>
        <Button
          startIcon={<AddLocation />}
          disabled={!labelingState.activeLabelSet}
          onClick={() => labelingActions.setActiveLabelingTool(LabelingTool.POINT)}
        >
          Point
        </Button>
        <Button
          startIcon={<AddCircleOutline />}
          disabled={!labelingState.activeLabelSet}
          onClick={() => labelingActions.setActiveLabelingTool(LabelingTool.CIRCLE)}
        >
          Circle
        </Button>
        <Button
          startIcon={<AddBox />}
          disabled={!labelingState.activeLabelSet}
          onClick={() => labelingActions.setActiveLabelingTool(LabelingTool.BOX)}
        >
          Square
        </Button>
        <Button
          startIcon={<FormatShapes />}
          disabled={!labelingState.activeLabelSet}
          onClick={() => labelingActions.setActiveLabelingTool(LabelingTool.POLYGON)}
        >
          Polygon
        </Button>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="labelColor">Label Color</InputLabel>
          <Select
            id="labelColor"
            value={labelingState.labelColor}
            style={{ backgroundColor: labelingState.labelColor, color: labelingState.labelColor }}
            disabled={!labelingState.activeLabelSet}
            onChange={e => labelingActions.setLabelColor(e.target.value as string)}
          >
            <MenuItem
              value={'rgba(255, 255, 255, 1)'}
              style={{ backgroundColor: 'rgba(255, 255, 255, 1)', color: 'rgba(255, 255, 255, 1)' }}
            >
              Label Color
            </MenuItem>
            <MenuItem
              value={'rgba(255, 0, 0, 1)'}
              style={{ backgroundColor: 'rgba(255, 0, 0, 1)', color: 'rgba(255, 0, 0, 1)' }}
            >
              Label Color
            </MenuItem>
            <MenuItem
              value={'rgba(0, 255, 0, 1)'}
              style={{ backgroundColor: 'rgba(0, 255, 0, 1)', color: 'rgba(0, 255, 0, 1)' }}
            >
              Label Color
            </MenuItem>
            <MenuItem
              value={'rgba(0, 0, 255, 1)'}
              style={{ backgroundColor: 'rgba(0, 0, 255, 1)', color: 'rgba(0, 0, 255, 1)' }}
            >
              Label Color
            </MenuItem>
            <MenuItem
              value={'rgba(0, 0, 0, 1)'}
              style={{ backgroundColor: 'rgba(0, 0, 0, 1)', color: 'rgba(0, 0, 0, 1)' }}
            >
              Label Color
            </MenuItem>
          </Select>
        </FormControl>
      </div>
    </div>
  );

  return (
    <div className={classes.root}>
      {labelToolbar}
      <LabelingInstructionsDialog
        open={instructionsDialogOpen}
        handleCloseLabelingInstructions={handleCloseLabelingInstructions}
      />
    </div>
  );
};

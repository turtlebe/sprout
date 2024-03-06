import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import useLabelingStore from './state';

export interface LabelingInstructionsDialog {
  open: boolean;
  handleCloseLabelingInstructions: () => void;
}

export const LabelingInstructionsDialog: React.FC<LabelingInstructionsDialog> = ({
  open,
  handleCloseLabelingInstructions,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [labelingState, labelingActions] = useLabelingStore<IL.LabelingState, IL.LabelingActions>();

  const instructions = (
    <div>
      {labelingState.labelingInstructions?.instructions}
      <br />
      <hr />
      <br />
    </div>
  );

  const basicInstructions = (
    <div>
      <h3>Basic Labeling Instructions</h3>
      <p>
        Labels must be added to a label set. Before selecting a label type to add, select the label set to add the label
        to or select the 'ADD NEW LABELSET' button to create a new labelset.
      </p>
      <h4>Creating Labels:</h4>
      <h5>Image Label</h5>
      <ol>
        <li>Select 'image' from the label toolbar</li>
        <li>Enter the label name into the new label dialog</li>
      </ol>
      <h5>Point Label</h5>
      <ol>
        <li>Select 'point' from the label toolbar</li>
        <li>Select the point on the image to add the label</li>
        <li>Enter the label name into the new label dialog</li>
      </ol>
      <h5>Circle or Square Label</h5>
      <ol>
        <li>Select 'circle' or 'square' from the label toolbar</li>
        <li>Select the point on the image to start adding the label</li>
        <li>Drag the mouse to size the label</li>
        <li>Release the mouse to complete sizing the label</li>
        <li>Enter the label name into the new label dialog</li>
      </ol>
      <h5>Polygon Label</h5>
      <ol>
        <li>Select 'polygon' from the label toolbar</li>
        <li>Select the point on the image to start adding the label</li>
        <li>Click additional points on the image to add polygon vertices</li>
        <li>Re-click the first point to complete adding the label</li>
        <li>Enter the label name into the new label dialog</li>
      </ol>
      <h4>Moving and resizing labels</h4>
      <ol>
        <li>
          Select the label to transform by clicking a vertex for 'point' or 'polygon' labels or clicking inside the
          label for 'circle' and 'square' labels
        </li>
        <li>To move the label click and drag the label to a different part of the image</li>
        <li>
          To resize the label click and drag one of the anchors around the outside of the label to another part of the
          image
        </li>
      </ol>
      <h4>Changing the label Color</h4>
      <p>
        Select the label color from the toolbar to change the color of the labels to better view the labels against the
        image background.
      </p>
      <h4>Saving label sets and label</h4>
      <p>
        When the labeling task(s) are complete select the save button to save the labels. Clicking the reset button will
        reset the labels to the last save/load point.
      </p>
    </div>
  );

  return (
    <Dialog fullWidth={true} maxWidth="lg" open={open} onClose={handleCloseLabelingInstructions}>
      <DialogTitle>Labeling Instructions</DialogTitle>
      <DialogContent>
        <div>
          {labelingState.labelingInstructions?.instructions && instructions}
          {basicInstructions}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseLabelingInstructions} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

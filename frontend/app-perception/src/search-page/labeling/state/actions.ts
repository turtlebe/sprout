import { mergeStates } from '@plentyag/core/src/utils/state';

import { LabelingTool } from '../enums';

import { LabelingStore } from '.';

import { initialState } from './state';

const mergeCoreStates = (state: IL.LabelingState, nextState: any): IL.LabelingState =>
  mergeStates<IL.LabelingState>(state, nextState);

const setLabelingInstructions = (store: LabelingStore, labelingInstructions: IL.LabelingInstructions) => {
  store.setState(mergeCoreStates(store.state, { labelingInstructions }));
};

const setCurrentLabelSets = (store: LabelingStore, currentLabelSets: IL.LabelSet[]) => {
  if (currentLabelSets) {
    store.setState({ ...store.state, currentLabelSets });
  }
};

const setModifiedLabelSetIds = (store: LabelingStore, modifiedLabelSetIds: number[]) => {
  store.setState(mergeCoreStates(store.state, { modifiedLabelSetIds }));
};

const setActiveLabels = (store: LabelingStore, activeLabels: IL.Label[]) => {
  // set active labels to empty array if null is passed in
  activeLabels = activeLabels ? activeLabels : [];
  store.setState({ ...store.state, activeLabels });
};

/**
 * Setting the active label set also adds the label set to the current and modified label set lists
 * if it is a newly created label set
 */
const setActiveLabelSet = (store: LabelingStore, activeLabelSet: IL.LabelSet) => {
  store.setState({ ...store.state, activeLabelSet });
  if (activeLabelSet) {
    // if the new active label set is a new label set add it to current and modified label sets
    if (activeLabelSet.id < 0) {
      if (!store.state.currentLabelSets.some(labelSet => labelSet.id === activeLabelSet.id)) {
        setCurrentLabelSets(store, [...store.state.currentLabelSets, activeLabelSet]);
      }
      if (!store.state.modifiedLabelSetIds.includes(activeLabelSet.id)) {
        setModifiedLabelSetIds(store, [...store.state.modifiedLabelSetIds, activeLabelSet.id]);
      }
    }
    // update the active labels to be the labels for the current active label set
    setActiveLabels(store, activeLabelSet.labels);
  }
};

/**
 * Utility function to make updates to label sets when a label is updated
 * ex. label creation and transformation
 */
const updateLabelSetsWithUpdatedLabel = (store: LabelingStore, updatedLabel: IL.Label) => {
  if (store.state.activeLabelSet) {
    // if the label is already in the active label set updated it
    if (store.state.activeLabelSet.labels?.some(label => label.id === updatedLabel.id)) {
      setActiveLabelSet(store, {
        ...store.state.activeLabelSet,
        labels: store.state.activeLabelSet.labels.map(label => (label.id === updatedLabel.id ? updatedLabel : label)),
      });
    } else {
      // if it is not add it
      setActiveLabelSet(store, {
        ...store.state.activeLabelSet,
        labels: store.state.activeLabelSet.labels
          ? [...store.state.activeLabelSet.labels, updatedLabel]
          : [updatedLabel],
      });
    }

    // update the label set in current label sets
    if (store.state.currentLabelSets?.some(labelSet => labelSet.id === store.state.activeLabelSet.id)) {
      setCurrentLabelSets(
        store,
        store.state.currentLabelSets.map(labelSet =>
          labelSet.id === store.state.activeLabelSet.id ? store.state.activeLabelSet : labelSet
        )
      );
    } else {
      // if the active label set is not already in the current labeset list add it
      setCurrentLabelSets(store, [...store.state.currentLabelSets, store.state.activeLabelSet]);
    }

    // add the active label set in the modified label set list (if it is not already there)
    if (!store.state.modifiedLabelSetIds.includes(store.state.activeLabelSet.id)) {
      store.setState(
        mergeCoreStates(store.state, {
          modifiedLabelSetIds: [...store.state.modifiedLabelSetIds, store.state.activeLabelSet.id],
        })
      );
    }
  }
};

const setLabelColor = (store: LabelingStore, labelColor: string) => {
  store.setState(mergeCoreStates(store.state, { labelColor }));
};

/**
 * Also add the new label to the active label lst so it will be drawn on the canvas
 */
const setLabelBeingAdded = (store: LabelingStore, labelBeingAdded: IL.Label) => {
  store.setState(mergeCoreStates(store.state, { labelBeingAdded }));
  // add new label to active labels
  if (labelBeingAdded) {
    // replace it if it is already there
    if (store.state.activeLabels.some(label => label.id === labelBeingAdded.id)) {
      setActiveLabels(
        store,
        store.state.activeLabels.map(label => (label.id === labelBeingAdded.id ? labelBeingAdded : label))
      );
    } else {
      setActiveLabels(store, [...store.state.activeLabels, labelBeingAdded]);
    }
  }
};

/**
 * Set selected label and update label sets with updates to selected label
 */
const setSelectedLabel = (store: LabelingStore, selectedLabel: IL.Label) => {
  store.setState(mergeCoreStates(store.state, { selectedLabel }));
  if (selectedLabel) {
    updateLabelSetsWithUpdatedLabel(store, selectedLabel);
  }
};

const setCurrentTransformer = (store: LabelingStore, currentTransformer: IL.Label) => {
  store.setState(mergeCoreStates(store.state, { currentTransformer }));
};

const setFinishedScaling = (store: LabelingStore, finishedScaling: boolean) => {
  store.setState(mergeCoreStates(store.state, { finishedScaling }));
};

/**
 * Set the scale factor and update the geometry points on the labels to be scaled to the current canvas
 */
const setScaleFactor = (store: LabelingStore, scaleFactor: number) => {
  store.setState(mergeCoreStates(store.state, { scaleFactor }));
  // Scale the current label sets by the scaling factor when a new scaling factor is set
  if (scaleFactor && store.state.currentLabelSets) {
    store.state.currentLabelSets.forEach(labelSet => {
      labelSet?.labels?.forEach(label => {
        label.geometryPoints = label.geometryPoints?.map(point => [+point[0] * scaleFactor, +point[1] * scaleFactor]);
      });
    });
    setActiveLabelSet(store, store.state.currentLabelSets[0]);
    setActiveLabels(store, store.state.currentLabelSets[0]?.labels);
    setFinishedScaling(store, true);
  }
};

const setCanvasWidth = (store: LabelingStore, canvasWidth: number) => {
  store.setState(mergeCoreStates(store.state, { canvasWidth }));
};

const setCanvasHeight = (store: LabelingStore, canvasHeight: IL.LabelSet[]) => {
  store.setState(mergeCoreStates(store.state, { canvasHeight }));
};

const setActiveLabelingTool = (store: LabelingStore, activeLabelingTool: LabelingTool) => {
  // if the user was in the middle of adding another label clean that up
  if (store.state.labelBeingAdded) {
    // remove label from active labels
    setActiveLabels(
      store,
      store.state.activeLabels.filter(label => label.id !== store.state.labelBeingAdded.id)
    );
    setLabelBeingAdded(store, null);
  }
  store.setState(mergeCoreStates(store.state, { activeLabelingTool }));
};

/**
 * Complete creating a new label:
 *    If the label is completed successfully, update the label sets with the new label
 *    If the label is not completed successully remove the label from active labels
 *    Reset the label being added and the labeling tool in either case
 */
const setLabelComplete = (store: LabelingStore, success: boolean) => {
  if (success) {
    // if the label is successfuly added then update the active label set and modified label sets
    updateLabelSetsWithUpdatedLabel(store, store.state.labelBeingAdded);
  } else {
    // remove label from active labels
    setActiveLabels(
      store,
      store.state.activeLabels.filter(label => label.id !== store.state.labelBeingAdded.id)
    );
  }

  // cleanup after a label completed (successfully or not)
  setLabelBeingAdded(store, null);
  setActiveLabelingTool(store, null);
};

const reset = (store: LabelingStore) => {
  store.setState(initialState);
};

export const actions = {
  setLabelingInstructions,
  setCurrentLabelSets,
  setModifiedLabelSetIds,
  setActiveLabelSet,
  setActiveLabels,
  setActiveLabelingTool,
  setLabelColor,
  setLabelBeingAdded,
  setLabelComplete,
  setSelectedLabel,
  setCurrentTransformer,
  setScaleFactor,
  setFinishedScaling,
  setCanvasWidth,
  setCanvasHeight,
  reset,
};

export default actions;

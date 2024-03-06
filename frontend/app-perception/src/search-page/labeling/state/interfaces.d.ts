type LabelingTool = import('../enums').LabelingTool;

declare namespace IL {
  interface LabelingState {
    labelingInstructions: LabelingInstructions;
    currentLabelSets: LabelSet[];
    modifiedLabelSetIds: number[];
    activeLabelSet: LabelSet;
    activeLabels: Label[];
    activeLabelingTool: LabelingTool;
    labelColor: string;
    labelBeingAdded: Label;
    selectedLabel: Label;
    currentTransformer: any;
    scaleFactor: number;
    finishedScaling: boolean;
    canvasWidth: number;
    canvasHeight: number;
  }

  interface LabelingActions {
    setLabelingInstructions: (labelingInstructions: LabelingInstructions) => void;
    setCurrentLabelSets: (currentLabelSets: LabelSet[]) => void;
    setModifiedLabelSetIds: (modifiedLabelSetId: number[]) => void;
    setActiveLabelSet: (activeLabelSet: LabelSet) => void;
    setActiveLabels: (activeLabels: Label[]) => void;
    setActiveLabelingTool: (labelingTool: LabelingTool) => void;
    setLabelColor: (labelColor: string) => void;
    setLabelBeingAdded: (labelBeingAdded: Label) => void;
    setLabelComplete: (success: boolean) => void;
    setSelectedLabel: (selectedLabel: Label) => void;
    setCurrentTransformer: (currentTransformer: any) => void;
    setScaleFactor: (scaleFactor: number) => void;
    setFinishedScaling: (finishedScaling: boolean) => void;
    setCanvasWidth: (canvasWidth: number) => void;
    setCanvasHeight: (canvasHeight: number) => void;
    reset: () => void;
  }
}

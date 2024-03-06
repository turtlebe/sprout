import { act, renderHook } from '@testing-library/react-hooks';

import { LabelingTool } from '../enums';

import useLabelingStore from './index';

type LabelingState = IL.LabelingState;
type LabelingActions = IL.LabelingActions;

const labelingInstructions: IL.LabelingInstructions = {
  instructions: 'test',
  labelSetTypes: [
    {
      name: 'Plug LabelSet',
      labelTypes: ['Dry Plug', 'Over Saturated Plug', 'Root Discoloration', 'Mold'],
    },
    {
      name: 'Plant LabelSet',
      labelTypes: ['Leaf Discoloration', 'Underdeveloped Shoot'],
    },
  ],
};

const point: IL.Label = {
  id: 1,
  label: 'point',
  probabilityScore: null,
  scope: LabelingTool.POINT,
  geometryPoints: [[0, 0]],
  metadata: null,
};

const circle: IL.Label = {
  id: 2,
  label: 'cicle',
  probabilityScore: null,
  scope: LabelingTool.CIRCLE,
  geometryPoints: [
    [50, 50],
    [100, 50],
  ],
  metadata: null,
};

const square: IL.Label = {
  id: 3,
  label: 'square',
  probabilityScore: null,
  scope: LabelingTool.BOX,
  geometryPoints: [
    [0, 0],
    [50, 0],
    [50, 50],
    [0, 50],
  ],
  metadata: null,
};

const polygon: IL.Label = {
  id: 4,
  label: 'polygon',
  probabilityScore: null,
  scope: LabelingTool.POLYGON,
  geometryPoints: [
    [0, 0],
    [50, 0],
    [50, 50],
    [0, 50],
  ],
  metadata: null,
};

const mockLabels = [point, circle, square, polygon];

const mockLabelSet: IL.LabelSet = {
  id: 1,
  name: 'labelSet',
  isGroundTruth: true,
  labelerType: 'user',
  labelerId: 'mockUser',
  labels: mockLabels,
};

const mockNewLabelSet: IL.LabelSet = {
  id: -1,
  name: 'newLabelSet',
  isGroundTruth: true,
  labelerType: 'user',
  labelerId: 'mockUser',
  labels: mockLabels,
};

const mockLabelSets = [mockLabelSet];

const labelBeingAdded: IL.Label = {
  id: 5,
  label: 'labelBeingAdded',
  probabilityScore: null,
  scope: LabelingTool.POINT,
  geometryPoints: [[0, 0]],
  metadata: null,
};

// must be called after each test to ensure global labeling state is reset to default.
function resetLabelingState(actions: LabelingActions) {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    actions.reset();
  });
}

describe('useLabelingStore', () => {
  describe('test setActiveLabelSet', () => {
    it('test setActiveLabelSet to ensure it correctl sets the active label set', () => {
      const { result } = renderHook(() => useLabelingStore<LabelingState, LabelingActions>());
      const labelingActions = result.current[1];

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      act(() => {
        labelingActions.setActiveLabelSet(mockLabelSet);
      });

      const labelingState = result.current[0];

      expect(labelingState.activeLabelSet.id).toBe(1);
      expect(labelingState.activeLabelSet.name).toBe('labelSet');
      expect(labelingState.activeLabelSet.labels).toHaveLength(4);

      resetLabelingState(labelingActions);
    });

    it('test setActiveLabelSet to ensure it correctly sets the active label set and correctly adds that labelset to the current label sets and modified label set ids', () => {
      const { result } = renderHook(() => useLabelingStore<LabelingState, LabelingActions>());
      const labelingActions = result.current[1];

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      act(() => {
        labelingActions.setActiveLabelSet(mockNewLabelSet);
      });

      const labelingState = result.current[0];

      expect(labelingState.activeLabelSet.id).toBe(-1);
      expect(labelingState.activeLabelSet.name).toBe('newLabelSet');
      expect(labelingState.activeLabelSet.labels).toHaveLength(4);

      // setting an active label set that is not in the current label sets or modified label sets should add it to those arrays
      expect(labelingState.currentLabelSets).toHaveLength(1);
      expect(labelingState.currentLabelSets.some(labelSet => labelSet.id === mockNewLabelSet.id)).toBe(true);
      expect(labelingState.currentLabelSets[0].labels).toHaveLength(4);

      expect(labelingState.modifiedLabelSetIds.includes(mockNewLabelSet.id)).toBe(true);

      resetLabelingState(labelingActions);
    });
  });

  it('test setLabelBeingAdded to ensure the label being added is set, can be updated and that the lebel is added to the active labels list', () => {
    const { result } = renderHook(() => useLabelingStore<LabelingState, LabelingActions>());
    const labelingActions = result.current[1];

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    act(() => {
      labelingActions.setLabelBeingAdded(labelBeingAdded);
    });

    let labelingState = result.current[0];

    expect(labelingState.labelBeingAdded.id).toBe(5);
    expect(labelingState.labelBeingAdded.label).toBe('labelBeingAdded');
    expect(labelingState.labelBeingAdded.geometryPoints).toHaveLength(1);

    // setting a labelBeingAdded should add the label in active labels
    expect(labelingState.activeLabels.some(label => label.id === labelBeingAdded.id)).toBe(true);

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    act(() => {
      labelingActions.setLabelBeingAdded({ ...labelBeingAdded, label: 'testUpdateLabel' });
    });

    labelingState = result.current[0];
    // setting a labelBeingAdded that is already in active labels should replace it with the updated label
    expect(labelingState.activeLabels.filter(label => label.id === labelBeingAdded.id)[0].label).toBe(
      'testUpdateLabel'
    );

    resetLabelingState(labelingActions);
  });

  it('test setSelectedLabel to ensure the selected label is set correctly and that the active labelset is added to the modified list ', () => {
    const { result } = renderHook(() => useLabelingStore<LabelingState, LabelingActions>());
    const labelingActions = result.current[1];

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    act(() => {
      labelingActions.setActiveLabelSet(mockLabelSet);
      labelingActions.setSelectedLabel(point);
    });

    const labelingState = result.current[0];

    expect(labelingState.selectedLabel.id).toBe(1);
    expect(labelingState.selectedLabel.label).toBe('point');
    expect(labelingState.selectedLabel.geometryPoints).toHaveLength(1);

    // setting a selectedLabel should add the activeLabelSet to the modifiedLabelSet array
    expect(labelingState.modifiedLabelSetIds.includes(mockLabelSet.id)).toBe(true);

    resetLabelingState(labelingActions);
  });

  it('tests setScaleFactor to ensure scaling factor in correctly set and that the active labelset, active labels and finish scaling flag are updated', () => {
    const { result } = renderHook(() => useLabelingStore<LabelingState, LabelingActions>());
    const labelingActions = result.current[1];

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    act(() => {
      labelingActions.setCurrentLabelSets(mockLabelSets);
      labelingActions.setScaleFactor(0.5);
    });

    const labelingState = result.current[0];

    expect(labelingState.scaleFactor).toBe(0.5);

    // setting the scale factor means the perception object has loaded and should initilize the active labels sets and active labels
    expect(labelingState.activeLabelSet.id).toBe(1);
    expect(labelingState.activeLabels).toHaveLength(4);
    expect(labelingState.finishedScaling).toBe(true);

    resetLabelingState(labelingActions);
  });

  it('tests setActiveLabelingTool to ensure the labling tool is correctly set and that any previous label being added is cleanup correctly', () => {
    const { result } = renderHook(() => useLabelingStore<LabelingState, LabelingActions>());
    const labelingActions = result.current[1];

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    act(() => {
      labelingActions.setLabelBeingAdded(labelBeingAdded);
      labelingActions.setActiveLabelingTool(LabelingTool.BOX);
    });

    const labelingState = result.current[0];

    expect(labelingState.activeLabelingTool).toBe(LabelingTool.BOX);
    // test cleanup
    expect(labelingState.activeLabels.some(label => label.id === labelBeingAdded.id)).toBe(false);
    expect(labelingState.labelBeingAdded).toBeNull();

    resetLabelingState(labelingActions);
  });

  describe('tests setLabelComplete ', () => {
    it('tests setLabelComplete with a successfully completed label to ensure the labe being added is added to the active label set and the label being added is cleaned up correctly', () => {
      const { result } = renderHook(() => useLabelingStore<LabelingState, LabelingActions>());
      const labelingActions = result.current[1];

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      act(() => {
        labelingActions.setActiveLabelSet(mockLabelSet);
        labelingActions.setLabelBeingAdded(labelBeingAdded);
        labelingActions.setLabelComplete(true);
      });

      const labelingState = result.current[0];

      // success completing label should add label to the activeLabelSet
      expect(labelingState.activeLabelSet.labels.some(label => label.id === labelBeingAdded.id)).toBe(true);
      //test cleanup
      expect(labelingState.labelBeingAdded).toBeNull();
      expect(labelingState.activeLabelingTool).toBeNull();

      resetLabelingState(labelingActions);
    });

    it('tests setLabelComplete with an unscussesfully completed labe to ensure that the label that was being added is cleaned up correctly', () => {
      const { result } = renderHook(() => useLabelingStore<LabelingState, LabelingActions>());
      const labelingActions = result.current[1];

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      act(() => {
        labelingActions.setActiveLabelSet(mockLabelSet);
        labelingActions.setLabelBeingAdded(labelBeingAdded);
        labelingActions.setLabelComplete(false);
      });

      const labelingState = result.current[0];

      // failure completing label should remove label from the activeLabels
      expect(labelingState.activeLabels.some(label => label.id === labelBeingAdded.id)).toBe(false);
      // test cleanup
      expect(labelingState.labelBeingAdded).toBeNull();
      expect(labelingState.activeLabelingTool).toBeNull();

      resetLabelingState(labelingActions);
    });
  });

  it('tests setLabelingInstructions to ensure instructions and label set types are set correctly', () => {
    const { result } = renderHook(() => useLabelingStore<LabelingState, LabelingActions>());
    const labelingActions = result.current[1];

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    act(() => {
      labelingActions.setLabelingInstructions(labelingInstructions);
    });

    const labelingState = result.current[0];

    expect(labelingState.labelingInstructions.instructions).not.toBeNull();
    expect(labelingState.labelingInstructions.labelSetTypes).toHaveLength(2);

    resetLabelingState(labelingActions);
  });

  it('tests setCurrentLabelSets to ensure current label sets are set correctly', () => {
    const { result } = renderHook(() => useLabelingStore<LabelingState, LabelingActions>());
    const labelingActions = result.current[1];

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    act(() => {
      labelingActions.setCurrentLabelSets(mockLabelSets);
    });

    const labelingState = result.current[0];

    expect(labelingState.currentLabelSets).toHaveLength(1);
    expect(labelingState.currentLabelSets.some(labelSet => labelSet.id === 1)).toBe(true);
    expect(labelingState.currentLabelSets[0].labels).toHaveLength(4);

    resetLabelingState(labelingActions);
  });

  it('tests setModifiedLabelSetIds  to ensure modified label set ids are set correctly', () => {
    const { result } = renderHook(() => useLabelingStore<LabelingState, LabelingActions>());
    const labelingActions = result.current[1];

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    act(() => {
      labelingActions.setModifiedLabelSetIds([mockLabelSet.id]);
    });

    const labelingState = result.current[0];

    expect(labelingState.modifiedLabelSetIds.includes(mockLabelSet.id)).toBe(true);

    resetLabelingState(labelingActions);
  });

  describe('test setActiveLabels', () => {
    it('tests setActiveLabels to ensure the active labels are set correctly', () => {
      const { result } = renderHook(() => useLabelingStore<LabelingState, LabelingActions>());
      const labelingActions = result.current[1];

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      act(() => {
        labelingActions.setActiveLabels(mockLabels);
      });

      const labelingState = result.current[0];

      expect(labelingState.activeLabels).toHaveLength(4);

      resetLabelingState(labelingActions);
    });

    it('tests setActiveLabels with a null value to ensure active label s is set to an empty array', () => {
      const { result } = renderHook(() => useLabelingStore<LabelingState, LabelingActions>());
      const labelingActions = result.current[1];

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      act(() => {
        labelingActions.setActiveLabels(null);
      });

      const labelingState = result.current[0];

      // make sure it is set back to empy array and not null
      expect(labelingState.activeLabels).toHaveLength(0);

      resetLabelingState(labelingActions);
    });
  });

  it('tests setLabelColor to ensure label color is set correctlyr', () => {
    const { result } = renderHook(() => useLabelingStore<LabelingState, LabelingActions>());
    const labelingActions = result.current[1];

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    act(() => {
      labelingActions.setLabelColor('rgba(255, 255, 255, 1)');
    });

    const labelingState = result.current[0];

    expect(labelingState.labelColor).toBe('rgba(255, 255, 255, 1)');

    resetLabelingState(labelingActions);
  });

  it('tests setCurrentTransformer to ensure current transformer is set correctly', () => {
    const { result } = renderHook(() => useLabelingStore<LabelingState, LabelingActions>());
    const labelingActions = result.current[1];

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    act(() => {
      labelingActions.setCurrentTransformer({});
    });

    const labelingState = result.current[0];

    expect(labelingState.currentTransformer).toBeTruthy();

    resetLabelingState(labelingActions);
  });

  it('tests setFinishedScaling to ensure finishe scaling flag is set correctly', () => {
    const { result } = renderHook(() => useLabelingStore<LabelingState, LabelingActions>());
    const labelingActions = result.current[1];

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    act(() => {
      labelingActions.setFinishedScaling(true);
    });

    const labelingState = result.current[0];

    expect(labelingState.finishedScaling).toBe(true);

    resetLabelingState(labelingActions);
  });

  it('tests setCanvasWidth and setCanvasHeight to ensure canvas dimensions are set correctly', () => {
    const { result } = renderHook(() => useLabelingStore<LabelingState, LabelingActions>());
    const labelingActions = result.current[1];

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    act(() => {
      labelingActions.setCanvasWidth(500);
      labelingActions.setCanvasHeight(500);
    });

    const labelingState = result.current[0];

    expect(labelingState.canvasWidth).toBe(500);
    expect(labelingState.canvasHeight).toBe(500);

    resetLabelingState(labelingActions);
  });
});

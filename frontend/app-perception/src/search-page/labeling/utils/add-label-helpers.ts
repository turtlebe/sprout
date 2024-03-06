import { LabelingTool } from '../enums';

/**
 * Handles the user clicking on the stage, this event is used to start each label
 *
 * Point label is just one click on the image to add the label to the image
 * Box label is mouse down to start drawing the bounding box, mouse up (drag end) completes the bounding box
 * Polygon label used mouse down to place the verteices of the polygon
 *
 * @param e mouse event
 * @param labelBeingAdded the current label being added
 * @return {updatedLabel, labelComplete} object with the updated label and a boolen indicating if label was completed with click
 */
export const handleStageMouseDown = (e, labelBeingAdded) => {
  const stage = e.target.getStage();
  const mousePos = stage.getPointerPosition();
  let updatedLabel;

  const { x, y } = mousePos;

  if (labelBeingAdded.scope === LabelingTool.BOX) {
    // start adding a new bounding box
    updatedLabel = {
      ...labelBeingAdded,
      geometryPoints: [
        [x, y],
        [x + 1, y],
        [x + 1, y + 1],
        [x, y + 1],
      ],
    };
    return { updatedLabel, labelComplete: false };
  }

  if (labelBeingAdded.scope === LabelingTool.CIRCLE) {
    // start adding a new circle label
    updatedLabel = {
      ...labelBeingAdded,
      geometryPoints: [
        [x, y],
        [x + 1, y],
      ],
    };
    return { updatedLabel, labelComplete: false };
  }

  if (labelBeingAdded.scope === LabelingTool.POLYGON) {
    if (labelBeingAdded.geometryPoints) {
      // check if mouse down is close enough to first point to close polygon and complete label
      if (
        Math.abs(labelBeingAdded.geometryPoints[0][0] - x) < 10 &&
        Math.abs(labelBeingAdded.geometryPoints[0][1] - y) < 10
      ) {
        updatedLabel = labelBeingAdded;
        return { updatedLabel, labelComplete: true };
      } else {
        // add vortex to polygon
        updatedLabel = {
          ...labelBeingAdded,
          geometryPoints: [...labelBeingAdded.geometryPoints, [x, y]],
        };
        return { updatedLabel, labelComplete: false };
      }
    } else {
      // first polygon vortex
      updatedLabel = {
        ...labelBeingAdded,
        geometryPoints: [[x, y]],
      };
      return { updatedLabel, labelComplete: false };
    }
  }

  if (labelBeingAdded.scope === LabelingTool.POINT) {
    // add point label x, y and complete label
    updatedLabel = {
      ...labelBeingAdded,
      geometryPoints: [[x, y]],
    };
    return { updatedLabel, labelComplete: true };
  }

  return { updatedLabel, labelComplete: false };
};

/**
 * Update circle or rect size as mouse is moved across the stage
 *
 * @param e mouse event
 * @param labelBeingAdded the current label being added
 * @return updatedLabel label updated with the new geometry points
 */
export const handleStageMouseMove = (e, labelBeingAdded) => {
  if (labelBeingAdded.geometryPoints === null) {
    return;
  }
  if (labelBeingAdded.scope === LabelingTool.BOX || labelBeingAdded.scope === LabelingTool.CIRCLE) {
    const stage = e.target.getStage();
    const mousePos = stage.getPointerPosition();
    const startPos = labelBeingAdded.geometryPoints[0];
    const { x, y } = mousePos;

    if (labelBeingAdded.scope === LabelingTool.BOX) {
      return {
        ...labelBeingAdded,
        geometryPoints: [startPos, [x, startPos[1]], [x, y], [startPos[0], y]],
      };
    } else if (labelBeingAdded.scope === LabelingTool.CIRCLE) {
      return {
        ...labelBeingAdded,
        geometryPoints: [startPos, [x, y]],
      };
    }
  }
};

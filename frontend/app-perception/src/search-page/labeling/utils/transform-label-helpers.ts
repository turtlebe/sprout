import { LabelingTool } from '../enums';

/**
 * Bound rect to canvas so it can not be dragged out of view
 *
 * @param rect x,y, width and height position of rect group
 * @param canvasWidth width of canvas (drawing area)
 * @param canvasHeight height of canvas (drawing area)
 * @returns object with bounded x,y position
 */
export const rectGroupBoundingBox = (rect, canvasWidth, canvasHeight) => {
  let x = rect.x;
  let y = rect.y;
  const width = rect.width;
  const height = rect.height;

  x = x < 0 ? 0 : x;
  x = x > canvasWidth - width ? canvasWidth - width : x;
  y = y < 0 ? 0 : y;
  y = y > canvasHeight - height ? canvasHeight - height : y;

  return { x: x, y: y };
};

/**
 * Bound circle to canvas so it can not be dragged out of view
 *
 * @param circle x,y and radius that define the circle
 * @param canvasWidth width of canvas (drawing area)
 * @param canvasHeight height of canvas (drawing area)
 * @returns object with bounded x,y position
 */
export const circleGroupBoundingBox = (circle, canvasWidth, canvasHeight) => {
  let x = circle.x;
  let y = circle.y;
  const radius = circle.radius;

  x = x < radius ? radius : x;
  x = x > canvasWidth - radius ? canvasWidth - radius : x;
  y = y < radius ? radius : y;
  y = y > canvasHeight - radius ? canvasHeight - radius : y;

  return { x: x, y: y };
};

/**
 * Bound poly vertex to canvas so it can not be dragged out of view
 *
 * @param pos x,y position of poly vertex
 * @param canvasWidth width of canvas (drawing area)
 * @param canvasHeight height of canvas (drawing area)
 * @returns object with bounded x,y position
 */
export const polyBoundingBox = (pos, canvasWidth, canvasHeight) => {
  let x = pos.x;
  let y = pos.y;

  x = x < 0 ? 0 : x;
  x = x > canvasWidth ? canvasWidth : x;
  y = y < 0 ? 0 : y;
  y = y > canvasHeight ? canvasHeight : y;

  return { x: x, y: y };
};

/**
 * Set the label selected (only used for circle and square)
 *
 * @param e mouse event
 * @param activeLabels currently active (drawn) labels
 * @returns selected label label that the user clicked
 */
export const handleShapeMouseDown = (e, activeLabels) => {
  const id = e.target.id();
  const label = activeLabels.find(l => `${l.id}` === `${id}`);
  return label;
};

/**
 * Update geometry points when the shape changes size
 *
 * @param e mouse event
 * @param selectedLabel currently selected label
 * @param currentTransformer konva transformer for selected label
 * @param canvasWidth width of canvas (drawing area)
 * @param canvasHeight height of canvas (drawing area)
 * @return updatedLabel label updated with the new geometry points
 */
export const handleShapeTransform = ({ e, selectedLabel, currentTransformer, canvasWidth, canvasHeight }) => {
  const shape = e.target;
  const group = shape.getParent();
  const x = group.x();
  const y = group.y();

  if (selectedLabel) {
    if (selectedLabel.scope === LabelingTool.BOX) {
      const width = shape.width() * shape.scaleX();
      const height = shape.height() * shape.scaleY();
      if (x < 0 || y < 0 || x + width > canvasWidth || y + height > canvasHeight) {
        currentTransformer.stopTransform();
      } else {
        return {
          ...selectedLabel,
          geometryPoints: [
            [x, y],
            [x + width, y],
            [x + width, y + height],
            [x, y + height],
          ],
        };
      }
    } else if (selectedLabel.scope === LabelingTool.CIRCLE) {
      const radius = shape.radius() * shape.scaleX();
      if (x - radius < 0 || y - radius < 0 || x + radius > canvasWidth || y + radius > canvasHeight) {
        currentTransformer.stopTransform();
      } else {
        return {
          ...selectedLabel,
          geometryPoints: [
            [x, y],
            [x + radius, y],
          ],
        };
      }
    }
  }
};

/**
 * Update label geometry points when the group is moved
 *
 * @param e mouse event
 * @param selectedLabel currently selected label
 * @return updatedLabel label updated with the new geometry points
 */
export const handleGroupDrag = (e, selectedLabel) => {
  const group = e.target;
  const x = group.x();
  const y = group.y();
  if (x < 0) {
    return;
  }

  if (selectedLabel) {
    if (selectedLabel.scope === LabelingTool.BOX) {
      const rect = group.find('Rect')[0];
      const width = rect.width();
      const height = rect.height();
      return {
        ...selectedLabel,
        geometryPoints: [
          [x, y],
          [x + width, y],
          [x + width, y + height],
          [x, y + height],
        ],
      };
    } else if (selectedLabel.scope === LabelingTool.CIRCLE) {
      const circle = group.find('Circle')[0];
      const radius = circle.radius();
      return {
        ...selectedLabel,
        geometryPoints: [
          [x, y],
          [x + radius, y],
        ],
      };
    }
  }
};

/**
 * polygon vertex drag move
 *
 * @param e mouse event
 * @param activeLabels currently displayed label
 * @param canvasWidth width of canvas (drawing area)
 * @param canvasHeight height of canvas (drawing area)
 * @return updatedLabel label updated with the new geometry points
 */
export const handleVertexDragMove = ({ e, activeLabels, canvasWidth, canvasHeight }) => {
  const activeVertex = e.target;
  const group = activeVertex.getParent();
  // vertex index is the last part of the vertex name
  const vertexIndex: number = parseInt(activeVertex.name().split('_')[3]);
  // label id is last part of group name
  const labelIndex = activeLabels.findIndex(label => `${label.id}` === group.name().split('_')[2]);
  const { x, y } = polyBoundingBox({ x: activeVertex.x(), y: activeVertex.y() }, canvasWidth, canvasHeight);
  const geometryPoints = activeLabels[labelIndex].geometryPoints;
  geometryPoints[vertexIndex] = [x, y];
  return { ...activeLabels[labelIndex], geometryPoints };
};

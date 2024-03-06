import { LabelingTool } from '../enums';

import {
  circleGroupBoundingBox,
  handleGroupDrag,
  handleShapeMouseDown,
  handleShapeTransform,
  handleVertexDragMove,
  polyBoundingBox,
  rectGroupBoundingBox,
} from './transform-label-helpers';

const point: IL.Label = {
  id: 1,
  label: 'point',
  probabilityScore: null,
  scope: LabelingTool.POINT,
  geometryPoints: [[100, 100]],
  metadata: null,
};

const circle: IL.Label = {
  id: 2,
  label: 'cicle',
  probabilityScore: null,
  scope: LabelingTool.CIRCLE,
  geometryPoints: [
    [100, 100],
    [150, 100],
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

const mockCircleKonvaEvent = {
  target: {
    id: () => 2,
    find: shape => {
      if (shape === 'Circle') {
        return [{ radius: () => 50 }];
      }
      return null;
    },
    getParent: () => {
      return {
        x: () => 50,
        y: () => 50,
      };
    },
    getStage: () => {
      return {
        getPointerPosition: () => {
          return { x: 50, y: 50 };
        },
      };
    },
    radius: () => 50,
    scaleX: () => 1,
    scaleY: () => 1,
    x: () => 50,
    y: () => 50,
  },
};

const mockRectKonvaEvent = {
  target: {
    id: () => 3,
    find: shape => {
      if (shape === 'Rect') {
        return [
          {
            width: () => 50,
            height: () => 50,
          },
        ];
      }
      return null;
    },
    getParent: () => {
      return {
        x: () => 0,
        y: () => 0,
      };
    },
    getStage: () => {
      return {
        getPointerPosition: () => {
          return { x: 0, y: 0 };
        },
      };
    },
    height: () => 50,
    width: () => 50,
    scaleX: () => 1,
    scaleY: () => 1,
    x: () => 0,
    y: () => 0,
  },
};

const mockPolyKonvaEvent = {
  target: {
    id: () => 1,
    getParent: () => {
      return {
        x: () => 0,
        y: () => 0,
        name: () => 'Poly_Group_4',
      };
    },
    name: () => 'vertex_rect_labelid_1',
    x: () => 0,
    y: () => 0,
  },
};

describe('test event handler methods that are used to transform existing labels', () => {
  describe('test bounding box functions', () => {
    it('tests the bounding box function for the circle shape', () => {
      const validPos = circleGroupBoundingBox({ x: 100, y: 100, radius: 50 }, 1000, 500);

      expect(validPos.x).toBe(100);
      expect(validPos.y).toBe(100);

      const negPos = circleGroupBoundingBox({ x: -100, y: -100, radius: 50 }, 1000, 500);

      expect(negPos.x).toBe(50);
      expect(negPos.y).toBe(50);

      const overPos = circleGroupBoundingBox({ x: 1100, y: 600, radius: 50 }, 1000, 500);

      expect(overPos.x).toBe(950);
      expect(overPos.y).toBe(450);
    });

    it('tests the bounding box function for the rect shape', () => {
      const validPos = rectGroupBoundingBox({ x: 100, y: 100, width: 50, height: 50 }, 1000, 500);

      expect(validPos.x).toBe(100);
      expect(validPos.y).toBe(100);

      const negPos = rectGroupBoundingBox({ x: -100, y: -100, width: 50, height: 50 }, 1000, 500);

      expect(negPos.x).toBe(0);
      expect(negPos.y).toBe(0);

      const overPos = rectGroupBoundingBox({ x: 1100, y: 600, width: 50, height: 50 }, 1000, 500);

      expect(overPos.x).toBe(950);
      expect(overPos.y).toBe(450);
    });

    it('tests the bounding box function for a polygon', () => {
      const validPos = polyBoundingBox({ x: 100, y: 100 }, 1000, 500);

      expect(validPos.x).toBe(100);
      expect(validPos.y).toBe(100);

      const negPos = polyBoundingBox({ x: -100, y: -100 }, 1000, 500);

      expect(negPos.x).toBe(0);
      expect(negPos.y).toBe(0);

      const overPos = polyBoundingBox({ x: 1100, y: 600 }, 1000, 500);

      expect(overPos.x).toBe(1000);
      expect(overPos.y).toBe(500);
    });
  });

  it('tests mouse down event to make sure it sets the clicked labe as selected', () => {
    const label = handleShapeMouseDown(mockPolyKonvaEvent, mockLabels);

    expect(label.label).toBe('point');
  });

  describe('test shape transform functions', () => {
    it('tests the transform function for a circle shape', () => {
      const updatedLabel = handleShapeTransform({
        e: mockCircleKonvaEvent,
        selectedLabel: circle,
        currentTransformer: { stopTransform: () => {} },
        canvasWidth: 1000,
        canvasHeight: 500,
      });

      expect(updatedLabel.geometryPoints).toHaveLength(2);
      expect(updatedLabel.geometryPoints[0][0]).toBe(50);
      expect(updatedLabel.geometryPoints[0][1]).toBe(50);
      expect(updatedLabel.geometryPoints[1][0]).toBe(100);
    });

    it('tests the transform function for a circle shape', () => {
      const updatedLabel = handleShapeTransform({
        e: mockRectKonvaEvent,
        selectedLabel: square,
        currentTransformer: { stopTransform: () => {} },
        canvasWidth: 1000,
        canvasHeight: 500,
      });

      expect(updatedLabel.geometryPoints).toHaveLength(4);
      expect(updatedLabel.geometryPoints[0][0]).toBe(0);
      expect(updatedLabel.geometryPoints[0][1]).toBe(0);
      expect(updatedLabel.geometryPoints[2][0]).toBe(50);
      expect(updatedLabel.geometryPoints[2][1]).toBe(50);
    });
  });
  describe('test group drag functions', () => {
    it('tests the group drag function for a group containing a circle label', () => {
      const updatedLabel = handleGroupDrag(mockCircleKonvaEvent, circle);

      expect(updatedLabel.geometryPoints).toHaveLength(2);
      expect(updatedLabel.geometryPoints[0][0]).toBe(50);
      expect(updatedLabel.geometryPoints[0][1]).toBe(50);
      expect(updatedLabel.geometryPoints[1][0]).toBe(100);
    });

    it('tests the group drag function for a group containing a rect label', () => {
      const updatedLabel = handleGroupDrag(mockRectKonvaEvent, square);

      expect(updatedLabel.geometryPoints).toHaveLength(4);
      expect(updatedLabel.geometryPoints[0][0]).toBe(0);
      expect(updatedLabel.geometryPoints[0][1]).toBe(0);
      expect(updatedLabel.geometryPoints[2][0]).toBe(50);
      expect(updatedLabel.geometryPoints[2][1]).toBe(50);
    });
  });

  it('tests the polygon vertex drag function', () => {
    const updatedLabel = handleVertexDragMove({
      e: mockPolyKonvaEvent,
      activeLabels: mockLabels,
      canvasWidth: 1000,
      canvasHeight: 500,
    });

    expect(updatedLabel.geometryPoints).toHaveLength(4);
    expect(updatedLabel.geometryPoints[1][0]).toBe(0);
    expect(updatedLabel.geometryPoints[1][1]).toBe(0);
  });
});

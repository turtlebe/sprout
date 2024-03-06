import { LabelingTool } from '../enums';

import { handleStageMouseDown, handleStageMouseMove } from './add-label-helpers';

const point: IL.Label = {
  id: 1,
  label: 'point',
  probabilityScore: null,
  scope: LabelingTool.POINT,
  geometryPoints: null,
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

const polygonStart: IL.Label = {
  id: 4,
  label: 'polygon',
  probabilityScore: null,
  scope: LabelingTool.POLYGON,
  geometryPoints: null,
  metadata: null,
};

const polygonAdd: IL.Label = {
  id: 4,
  label: 'polygon',
  probabilityScore: null,
  scope: LabelingTool.POLYGON,
  geometryPoints: [[0, 0]],
  metadata: null,
};

const polygonComplete: IL.Label = {
  id: 4,
  label: 'polygon',
  probabilityScore: null,
  scope: LabelingTool.POLYGON,
  geometryPoints: [
    [100, 100],
    [150, 100],
    [150, 150],
    [100, 150],
  ],
  metadata: null,
};

const mockKonvaEvent = {
  target: {
    getStage: () => {
      return {
        getPointerPosition: () => {
          return { x: 100, y: 100 };
        },
      };
    },
  },
};

describe('test event handler methods that are used to add new labels', () => {
  describe('test mouse down events', () => {
    it('tests mouse down with point label', () => {
      const { updatedLabel, labelComplete } = handleStageMouseDown(mockKonvaEvent, point);

      expect(updatedLabel.geometryPoints).toHaveLength(1);
      expect(updatedLabel.geometryPoints[0][0]).toBe(100);
      expect(updatedLabel.geometryPoints[0][1]).toBe(100);
      expect(labelComplete).toBe(true);
    });

    it('tests mouse down with circle label', () => {
      const { updatedLabel, labelComplete } = handleStageMouseDown(mockKonvaEvent, circle);

      expect(updatedLabel.geometryPoints).toHaveLength(2);
      expect(updatedLabel.geometryPoints[0][0]).toBe(100);
      expect(updatedLabel.geometryPoints[0][1]).toBe(100);
      expect(labelComplete).toBe(false);
    });

    it('tests mouse down with box label', () => {
      const { updatedLabel, labelComplete } = handleStageMouseDown(mockKonvaEvent, square);

      expect(updatedLabel.geometryPoints).toHaveLength(4);
      expect(updatedLabel.geometryPoints[0][0]).toBe(100);
      expect(updatedLabel.geometryPoints[0][1]).toBe(100);
      expect(labelComplete).toBe(false);
    });
    describe('test mouse down for poygon label', () => {
      it('tests mouse down to start adding a polygon label', () => {
        const { updatedLabel, labelComplete } = handleStageMouseDown(mockKonvaEvent, polygonStart);

        expect(updatedLabel.geometryPoints).toHaveLength(1);
        expect(updatedLabel.geometryPoints[0][0]).toBe(100);
        expect(updatedLabel.geometryPoints[0][1]).toBe(100);
        expect(labelComplete).toBe(false);
      });

      it('tests mouse down for en existing polygon label to add an aditional vertex', () => {
        const { updatedLabel, labelComplete } = handleStageMouseDown(mockKonvaEvent, polygonAdd);

        expect(updatedLabel.geometryPoints).toHaveLength(2);
        expect(updatedLabel.geometryPoints[1][0]).toBe(100);
        expect(updatedLabel.geometryPoints[1][1]).toBe(100);
        expect(labelComplete).toBe(false);
      });

      it('tests mouse down for an existing polygon label to complete the polygon', () => {
        const { updatedLabel, labelComplete } = handleStageMouseDown(mockKonvaEvent, polygonComplete);

        expect(updatedLabel.geometryPoints).toHaveLength(4);
        expect(labelComplete).toBe(true);
      });
    });
  });

  describe('test mouse move events', () => {
    it('tests mouse move with circle label', () => {
      const updatedLabel = handleStageMouseMove(mockKonvaEvent, circle);

      expect(updatedLabel.geometryPoints).toHaveLength(2);
      expect(updatedLabel.geometryPoints[0][0]).toBe(50);
      expect(updatedLabel.geometryPoints[0][1]).toBe(50);
      expect(updatedLabel.geometryPoints[1][0]).toBe(100);
      expect(updatedLabel.geometryPoints[1][1]).toBe(100);
    });

    it('tests mouse move with box label', () => {
      const updatedLabel = handleStageMouseMove(mockKonvaEvent, square);

      expect(updatedLabel.geometryPoints).toHaveLength(4);
      expect(updatedLabel.geometryPoints[0][0]).toBe(0);
      expect(updatedLabel.geometryPoints[0][1]).toBe(0);
      expect(updatedLabel.geometryPoints[2][0]).toBe(100);
      expect(updatedLabel.geometryPoints[2][1]).toBe(100);
    });
  });
});

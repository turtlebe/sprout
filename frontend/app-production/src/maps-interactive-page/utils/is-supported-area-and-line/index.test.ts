import {
  isSupportedAreaAndLine,
  isSupportedGerminationLine,
  isSupportedPropagationRack,
  isSupportedVerticalGrowRoom,
} from '.';

describe('isSupportedAreaAndLine', () => {
  describe('isSupportedGerminationLine', () => {
    it('should return true with qualified area and line', () => {
      const result = isSupportedGerminationLine('Germination', 'GerminationLine');
      expect(result).toBeTruthy();
    });
    it('should return false with unqualified area or line', () => {
      const result1 = isSupportedGerminationLine('Germination', 'GerminationWrong');
      const result2 = isSupportedGerminationLine('Propagation', 'PropRack');
      expect(result1).toBeFalsy();
      expect(result2).toBeFalsy();
    });
    it('should return false with null value', () => {
      const result1 = isSupportedGerminationLine(null, null);
      const result2 = isSupportedGerminationLine('Germination', null);
      expect(result1).toBeFalsy();
      expect(result2).toBeFalsy();
    });
  });

  describe('isSupportedPropagationRack', () => {
    it('should return true with qualified area and line', () => {
      const result1 = isSupportedPropagationRack('Propagation', 'PropRack');
      const result2 = isSupportedPropagationRack('Propagation', 'PropagationRack');
      expect(result1).toBeTruthy();
      expect(result2).toBeTruthy();
    });
    it('should return false with unqualified area or line', () => {
      const result1 = isSupportedPropagationRack('Propagation', 'PropagationWrong');
      const result2 = isSupportedPropagationRack('Germination', 'GerminationLine');
      expect(result1).toBeFalsy();
      expect(result2).toBeFalsy();
    });
    it('should return false with null value', () => {
      const result1 = isSupportedPropagationRack(null, null);
      const result2 = isSupportedPropagationRack('Propagation', null);
      expect(result1).toBeFalsy();
      expect(result2).toBeFalsy();
    });
  });

  describe('isSupportedVerticalGrowRoom', () => {
    it('should return true with qualified area and line', () => {
      const result = isSupportedVerticalGrowRoom('VerticalGrow', 'GrowRoom');
      expect(result).toBeTruthy();
    });
    it('should return false with unqualified area or line', () => {
      const result1 = isSupportedVerticalGrowRoom('VerticalGrow', 'GrowWrong');
      const result2 = isSupportedVerticalGrowRoom('Propagation', 'PropRack');
      expect(result1).toBeFalsy();
      expect(result2).toBeFalsy();
    });
    it('should return false with null value', () => {
      const result1 = isSupportedVerticalGrowRoom(null, null);
      const result2 = isSupportedVerticalGrowRoom('VerticalGrow', null);
      expect(result1).toBeFalsy();
      expect(result2).toBeFalsy();
    });
  });

  describe('isSupportedAreaAndLine', () => {
    it('should return true with qualified area and line', () => {
      const result1 = isSupportedAreaAndLine('Germination', 'GerminationLine');
      const result2 = isSupportedAreaAndLine('Propagation', 'PropRack');
      const result3 = isSupportedAreaAndLine('Propagation', 'PropagationRack');
      const result4 = isSupportedAreaAndLine('VerticalGrow', 'GrowRoom');
      expect(result1).toBeTruthy();
      expect(result2).toBeTruthy();
      expect(result3).toBeTruthy();
      expect(result4).toBeTruthy();
    });
    it('should return false with unqualified area or line', () => {
      const result1 = isSupportedAreaAndLine('Germination', 'GerminationWrong');
      const result2 = isSupportedAreaAndLine('Seeding', 'Wrong');
      expect(result1).toBeFalsy();
      expect(result2).toBeFalsy();
    });
    it('should return false with null value', () => {
      const result1 = isSupportedAreaAndLine(null, null);
      const result2 = isSupportedAreaAndLine('Germination', null);
      expect(result1).toBeFalsy();
      expect(result2).toBeFalsy();
    });
  });
});

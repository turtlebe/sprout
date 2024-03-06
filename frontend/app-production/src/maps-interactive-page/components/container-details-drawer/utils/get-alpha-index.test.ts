import { getAlphaByIndex, getIndexByAlpha } from './get-alpha-index';

describe('getAlphaIndex', () => {
  describe('getIndexByAlpha', () => {
    it('should return correct index of given letter', () => {
      const result1 = getIndexByAlpha('B');
      const result2 = getIndexByAlpha('T');
      const result3 = getIndexByAlpha('J');

      expect(result1).toEqual(1);
      expect(result2).toEqual(19);
      expect(result3).toEqual(9);
    });
  });

  describe('getAlphaByIndex', () => {
    it('should return correct index of given letter', () => {
      const result1 = getAlphaByIndex(20);
      const result2 = getAlphaByIndex(0);
      const result3 = getAlphaByIndex(16);

      expect(result1).toEqual('U');
      expect(result2).toEqual('A');
      expect(result3).toEqual('Q');
    });
  });
});

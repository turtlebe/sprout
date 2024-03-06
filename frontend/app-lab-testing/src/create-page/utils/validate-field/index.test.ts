import {
  HARVEST_CYCLE_ERROR,
  LIST_OF_NUMBERS_ERROR,
  TRIAL_REQ_WHEN_TREATMENT_DEFINED_ERROR,
  validateHarvestCycle,
  validateListOfNumbers,
  validateTreatmentIds,
  validateTrialIds,
} from './index';

describe('field validation tests', () => {
  describe('validateListOfNumbers()', () => {
    it('gives error: "0"', () => {
      const err = validateListOfNumbers('0');
      expect(err).toBe(LIST_OF_NUMBERS_ERROR);
    });

    it('gives error: "1,a,2"', () => {
      const err = validateListOfNumbers('1,2,a');
      expect(err).toBe(LIST_OF_NUMBERS_ERROR);
    });

    it('gives error: "-1"', () => {
      const err = validateListOfNumbers(',-1');
      expect(err).toBe(LIST_OF_NUMBERS_ERROR);
    });

    it('gives no error: "1, 2, 3, "', () => {
      const err = validateListOfNumbers('1, 2, 3, ');
      expect(err).toBeUndefined();
    });

    it('gives no error: ",1" ', () => {
      const err = validateListOfNumbers(',1');
      expect(err).toBeUndefined();
    });

    it('gives no error: "001,1,3343"', () => {
      const err = validateListOfNumbers('001,1,3343');
      expect(err).toBeUndefined();
    });

    it('gives no error for empty string', () => {
      const err = validateListOfNumbers('');
      expect(err).toBeUndefined();
    });

    it('gives error as exceed max value: "100"', () => {
      const err = validateListOfNumbers('100', 99);
      expect(err).toContain(LIST_OF_NUMBERS_ERROR);
    });

    it('gives no error as does not exceed max value: "1,99"', () => {
      const err = validateListOfNumbers('1,99', 99);
      expect(err).toBeUndefined();
    });
  });

  describe('validateTreatmentIds()', () => {
    it('gives error if max exceeded', () => {
      const err = validateTreatmentIds('100');
      expect(err).toContain(LIST_OF_NUMBERS_ERROR);
    });

    it('gives no error if max not exceeded', () => {
      const err = validateTreatmentIds('99');
      expect(err).toBeUndefined();
    });
  });

  describe('validateTrialIds()', () => {
    it('gives error if treatment provided but no trial', () => {
      const err = validateTrialIds('', true);
      expect(err).toBe(TRIAL_REQ_WHEN_TREATMENT_DEFINED_ERROR);
    });

    it('gives no error if both treatment and trial provided', () => {
      const err = validateTrialIds('1', true);
      expect(err).toBeUndefined();
    });

    it('gives error if max exceeded', () => {
      const err = validateTrialIds('10000001', true);
      expect(err).toContain(LIST_OF_NUMBERS_ERROR);
    });

    it('gives no error if max not exceeded', () => {
      const err = validateTrialIds('10000000', true);
      expect(err).toBeUndefined();
    });
  });

  describe('validateHarvestCycle()', () => {
    it('gives no error: empty string', () => {
      const err = validateHarvestCycle('');
      expect(err).toBeUndefined();
    });

    it('gives no error: undefined', () => {
      const err = validateHarvestCycle(undefined);
      expect(err).toBeUndefined();
    });

    it('gives no error: "1"', () => {
      const err = validateHarvestCycle('1');
      expect(err).toBeUndefined();
    });

    it('gives no error: "999"', () => {
      const err = validateHarvestCycle('999');
      expect(err).toBeUndefined();
    });

    it('gives error: "0"', () => {
      const err = validateHarvestCycle('0');
      expect(err).toBe(HARVEST_CYCLE_ERROR);
    });

    it('gives error: "-1"', () => {
      const err = validateHarvestCycle('-1');
      expect(err).toBe(HARVEST_CYCLE_ERROR);
    });

    it('gives error: "1000"', () => {
      const err = validateHarvestCycle('1000');
      expect(err).toBe(HARVEST_CYCLE_ERROR);
    });
  });
});

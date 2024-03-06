import { getFaultsInfo } from './get-faults-info';

const MOCK_JSON = '{\n    "overcurrent1": true,\n    "overcurrent2": true,\n    "overcurrent3": true\n  }';
const MOCK_JSON_INVALID =
  'INVALID_TOKEN{\n    "overcurrent1": true,\n    "overcurrent2": true,\n    "overcurrent3": true\n  }';
const MOCK_JSON_NO_FAULTS = '{}';

describe('getFaultsInfo', () => {
  it('returns relevant attributes', () => {
    expect(getFaultsInfo(MOCK_JSON)).toHaveProperty('overcurrent1');
    expect(getFaultsInfo(MOCK_JSON)).toHaveProperty('overcurrent2');
    expect(getFaultsInfo(MOCK_JSON)).toHaveProperty('overcurrent3');
  });

  it('returns an empty object', () => {
    expect(getFaultsInfo(MOCK_JSON_INVALID)).toEqual({});
    expect(getFaultsInfo(MOCK_JSON_NO_FAULTS)).toEqual({});
    expect(getFaultsInfo(undefined)).toEqual({});
    expect(getFaultsInfo(null)).toEqual({});
    expect(getFaultsInfo('')).toEqual({});
  });
});

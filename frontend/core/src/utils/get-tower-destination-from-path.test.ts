import { getTowerDestinationFromPath } from './get-tower-destination-from-path';

describe('getTowerDestinationFromPath', () => {
  it('returns an empty string', () => {
    expect(getTowerDestinationFromPath(null)).toEqual('');
    expect(getTowerDestinationFromPath('')).toEqual('');
    expect(getTowerDestinationFromPath('/')).toEqual('');
  });

  it('returns correct destination for grow-rooms', () => {
    // ACT
    const result = getTowerDestinationFromPath('GR11A');

    // ASSERT
    expect(result).toEqual('GR1-1A');
  });

  it('returns correct destination for non-grow-rooms', () => {
    // ACT
    const result1 = getTowerDestinationFromPath('Maintenance');
    const result2 = getTowerDestinationFromPath('EmptyCarrierBuffer');
    const result3 = getTowerDestinationFromPath('CutagainBuffer');
    const result4 = getTowerDestinationFromPath('AuxBuffer1');

    // ASSERT
    expect(result1).toEqual('maintenance');
    expect(result2).toEqual('empty-carrier-buffer');
    expect(result3).toEqual('cutagain-buffer');
    expect(result4).toEqual('aux-buffer-1');
  });
});

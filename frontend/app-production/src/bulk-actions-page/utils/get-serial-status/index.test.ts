import { mockContainersResourceState } from '@plentyag/app-production/src/common/test-helpers';

import { SerialStatus } from '../../types';

import { getSerialStatus } from '.';

describe('getSerialStatus', () => {
  it('returns invalid serial status - because no state provided', () => {
    expect(getSerialStatus(undefined, 'SSF2')).toBe(SerialStatus.invalidSerial);
    expect(getSerialStatus(null, 'SSF2')).toBe(SerialStatus.invalidSerial);
  });

  it('returns invalid serial status - because site does not match', () => {
    // site of resources is SSF2 which does not match LAX1
    expect(getSerialStatus(mockContainersResourceState[0], 'LAX1')).toBe(SerialStatus.invalidSerialSite);
  });

  it('returns valid serial status', () => {
    expect(getSerialStatus(mockContainersResourceState[0], 'SSF2')).toBe(SerialStatus.valid);
  });
});

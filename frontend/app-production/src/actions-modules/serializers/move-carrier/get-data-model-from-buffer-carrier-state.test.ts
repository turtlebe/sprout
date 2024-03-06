import { mockBufferCarriers } from '@plentyag/app-production/src/central-processing-dashboard-page/test-helpers';

import { mockMoveCarrierActionModel, mockMoveCarrierDataModel } from '../../test-helpers';

import { getCarrierIdInt, getDataModelFromBufferCarrierState } from './get-data-model-from-buffer-carrier-state';

describe('getCarrierIdInt', () => {
  it('pulls correct carrier integer from proper carrier serial', () => {
    // ACT
    const result1 = getCarrierIdInt('CARRIER_1_SERIAL');
    const result2 = getCarrierIdInt('CARRIER_23_SERIAL');
    const result3 = getCarrierIdInt('CARRIER_99_SERIAL');
    const result4 = getCarrierIdInt('CARRIER_1234_SERIAL');

    // ASSERT
    expect(result1).toEqual(1);
    expect(result2).toEqual(23);
    expect(result3).toEqual(99);
    expect(result4).toEqual(1234);
  });

  it('returns null from invalid carrier serial format', () => {
    // ACT
    const result1 = getCarrierIdInt('serial-373d9588-9b85-4187-b412-46c91d0655b7');
    const result2 = getCarrierIdInt('CARRIER_0_SERIAL');
    const result3 = getCarrierIdInt('P800:88888888:TOW:000-000-000');

    // ASSERT
    expect(result1).toEqual(null);
    expect(result2).toEqual(null);
    expect(result3).toEqual(null);
  });
});

describe('getDataModelFromBufferCarrierState', () => {
  let mockCarrierState;

  beforeEach(() => {
    mockCarrierState = { ...mockBufferCarriers[0] };
  });

  it('returns empty object if buffer state is null', () => {
    // ACT
    const result = getDataModelFromBufferCarrierState(mockMoveCarrierActionModel, null, {
      currentUser: { username: 'olittle' },
    } as any);

    // ASSERT
    expect(result).toEqual({});
  });

  it('returns empty object if carrier id is invalid', () => {
    // ARRANGE
    mockCarrierState.carrier_id = 'CARRIER_0_SERIAL';

    // ACT
    const result = getDataModelFromBufferCarrierState(mockMoveCarrierActionModel, mockCarrierState, {
      currentUser: { username: 'olittle' },
    } as any);

    // ASSERT
    expect(result).toEqual({});
  });

  it('returns correct data model from buffer state', () => {
    // ACT
    const result = getDataModelFromBufferCarrierState(mockMoveCarrierActionModel, mockCarrierState, {
      currentUser: { username: 'olittle' },
    } as any);

    // ASSERT
    expect(result).toEqual(mockMoveCarrierDataModel);
  });
});

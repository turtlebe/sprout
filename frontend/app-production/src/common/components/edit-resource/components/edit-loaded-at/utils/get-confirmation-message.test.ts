import { mockFarmStateContainer } from '@plentyag/app-production/src/common/test-helpers';
import { cloneDeep } from 'lodash';
import { Settings } from 'luxon';

import { getConfirmationMessage } from './get-confirmation-message';

describe('getConfirmationMessage', () => {
  beforeAll(() => {
    Settings.defaultZone = 'America/Phoenix'; // no daylight savings
  });

  afterAll(() => {
    Settings.defaultZone = 'system';
  });

  it('returns correct formatted message for one loaded at attribute', () => {
    // ARRANGE
    const values = {
      originalObj: mockFarmStateContainer,
      loadedInGrowAt: '2022-09-10 10:31:11.123 -0700',
    };

    // ACT
    const result = getConfirmationMessage(values);

    // ASSERT
    expect(result).toEqual(
      'You are about to replace Loaded in Vertical Grow at from 09/05/2022 03:30 PM to 09/10/2022 10:31 AM. Are you sure you want to proceed?'
    );
  });

  it('returns correct formatted message for multiple loaded at attributes (Propagation)', () => {
    // ARRANGE
    const mockFarmStateContainerMultipleAttr = cloneDeep(mockFarmStateContainer);
    mockFarmStateContainerMultipleAttr.resourceState.containerObj.containerType = 'TABLE';
    mockFarmStateContainerMultipleAttr.resourceState.location.machine.areaName = 'Propagation';
    mockFarmStateContainerMultipleAttr.resourceState.materialAttributes = {
      loadedInGermAt: '2022-04-16 07:00:00.111 -0700',
      loadedInPropAt: '2022-04-22 07:00:00.111 -0700',
    } as any;

    const values = {
      originalObj: mockFarmStateContainerMultipleAttr,
      loadedInGermAt: '2022-05-19 07:00:00.111 -0700',
      loadedInPropAt: '2022-11-13 07:00:00.111 -0700',
    };

    // ACT
    const result = getConfirmationMessage(values);

    // ASSERT
    expect(result).toEqual(
      'You are about to replace Loaded in Germination at from 04/16/2022 07:00 AM to 05/19/2022 07:00 AM and Loaded in Propagation at from 04/22/2022 07:00 AM to 11/13/2022 07:00 AM. Are you sure you want to proceed?'
    );
  });
});

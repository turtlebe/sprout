import '@plentyag/core/src/yup/extension';
import { mockFarmStateContainer } from '@plentyag/app-production/src/common/test-helpers';
import { LoadedAtAttributes } from '@plentyag/app-production/src/common/types/farm-state';
import { renderHook } from '@testing-library/react-hooks';
import { cloneDeep } from 'lodash';
import { Settings } from 'luxon';

import { useEditLoadedAtFormGenConfig } from '.';

describe('useEditLoadedAtFormGenConfig', () => {
  beforeAll(() => {
    Settings.defaultZone = 'America/Phoenix'; // no daylight savings
  });

  afterAll(() => {
    Settings.defaultZone = 'system';
  });

  function renderUseEditLoadedAtFormGenConfig() {
    const loadedAtAttributes = [LoadedAtAttributes.LOADED_IN_GROW_AT];
    return renderHook(() => useEditLoadedAtFormGenConfig(loadedAtAttributes));
  }

  it('returns correct fields', () => {
    // ACT
    const { result } = renderUseEditLoadedAtFormGenConfig();

    // ASSERT
    expect(result.current.fields).toEqual([
      expect.objectContaining({
        keyboardDateTimePickerProps: {
          autoOk: true,
          disableFuture: true,
        },
        label: 'Loaded in Vertical Grow at',
        name: 'loadedInGrowAt',
        type: 'KeyboardDateTimePicker',
      }),
    ]);
  });

  it('deserialize => returns correct deserialized object', () => {
    // ARRANGE
    const { result } = renderUseEditLoadedAtFormGenConfig();

    // ACT
    const values = result.current.deserialize(mockFarmStateContainer);

    // ASSERT
    expect(values).toEqual({
      loadedInGrowAt: mockFarmStateContainer.resourceState.materialAttributes.loadedInGrowAt,
      originalObj: mockFarmStateContainer,
    });
  });

  it('serialize => returns correct serialized object', () => {
    // ARRANGE
    const { result } = renderUseEditLoadedAtFormGenConfig();

    // ACT
    const values = result.current.serialize({
      originalObj: mockFarmStateContainer,
      loadedInGrowAt: '2009-01-01T11:12:12.121-07:00', // returned from date picker
    });

    // ASSERT
    const expectedObj = cloneDeep(mockFarmStateContainer);
    expectedObj.resourceState.materialAttributes.loadedInGrowAt = '2009-01-01T18:12:12.121Z'; // format to server

    expect(values).toEqual(expectedObj);
  });
});

import { mockDeviceTypes } from '@plentyag/app-devices/src/common/test-helpers/device-types';
import { useSwrAxios } from '@plentyag/core/src/hooks/use-swr-axios';
import { renderHook } from '@testing-library/react-hooks';
import { get } from 'lodash';

import { fields, useAgGridConfig } from '.';

jest.mock('@plentyag/core/src/hooks/use-swr-axios');

const mockUseSwrAxios = useSwrAxios as jest.Mock;

describe('useDeviceTableAgGridConfig', () => {
  it('provides a selectionFilter with all devices', () => {
    mockUseSwrAxios.mockReturnValue({
      isValidating: false,
      data: mockDeviceTypes,
    });

    const { result } = renderHook(() => useAgGridConfig());

    const colDeviceTypeName = result.current.config.columnDefs.find((col: ColDef) => col.field === fields.types);

    expect(colDeviceTypeName).toBeDefined();
    expect(get(colDeviceTypeName, 'filterParams.selectableItems')).toHaveLength(mockDeviceTypes.length);
  });

  it('provides an empty selectionFilter when loading deviceTypes', () => {
    mockUseSwrAxios.mockReturnValue({
      isValidating: true,
      data: undefined,
    });

    const { result } = renderHook(() => useAgGridConfig());

    const colDeviceTypeName = result.current.config.columnDefs.find((col: ColDef) => col.field === fields.types);

    expect(colDeviceTypeName).toBeDefined();
    expect(get(colDeviceTypeName, 'filterParams.selectableItems')).toHaveLength(0);
  });
});

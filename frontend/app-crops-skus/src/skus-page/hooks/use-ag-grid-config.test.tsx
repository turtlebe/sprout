import { renderHook } from '@testing-library/react-hooks';

import { useGetBrands, useSearchSkuTypes } from '../../common/hooks';
import { mockSkus, mockSkuTypes } from '../../common/test-helpers';

import { useAgGridConfig } from '.';

jest.mock('../../common/hooks/use-search-sku-types');
const mockUseSearchSkuTypes = useSearchSkuTypes as jest.Mock;

jest.mock('../../common/hooks/use-get-brands');
const mockUseGetBrands = useGetBrands as jest.Mock;

function hasColumnWithHeaderName(columnDefs: ColDef[], headerName: string) {
  return !!columnDefs.find(columnDef => columnDef.headerName === headerName);
}

describe('useAgGridConfig', () => {
  beforeEach(() => {
    mockUseSearchSkuTypes.mockReturnValue({ isLoading: false, skuTypes: mockSkuTypes });

    const mockBrands = [
      {
        name: 'Marketside',
        path: 'brandTypes/Marketside',
        description: 'Marketside',
        kind: 'brandType',
      },
      {
        name: 'Plenty',
        path: 'brandTypes/Plenty',
        description: 'Plenty',
        kind: 'brandType',
      },
    ];
    mockUseGetBrands.mockReturnValue({
      data: mockBrands,
    });
  });

  it('returns undefined when "skus" not provided', () => {
    const { result } = renderHook(() => useAgGridConfig(undefined));
    expect(result.current).toBeUndefined();
  });

  it('returns undefined when "brands" not provided', () => {
    mockUseGetBrands.mockReturnValue({ data: undefined });

    const { result } = renderHook(() => useAgGridConfig(mockSkus));

    expect(result.current).toBeUndefined();
  });

  it('returns undefined when "skuTypes" not provided', () => {
    mockUseSearchSkuTypes.mockReturnValue({ isLoading: false, skuTypes: undefined });

    const { result } = renderHook(() => useAgGridConfig(mockSkus));

    expect(result.current).toBeUndefined();
  });

  it('returns all columns - including dynamically generated farm columns', () => {
    const { result } = renderHook(() => useAgGridConfig(mockSkus));

    const agGridConfig = result.current;

    expect(agGridConfig.columnDefs).toHaveLength(17);

    // should have one: Tigris, other farms columns are remove since
    // there is no associated sku.
    expect(hasColumnWithHeaderName(agGridConfig.columnDefs, 'Tigris')).toBe(true);

    expect(hasColumnWithHeaderName(agGridConfig.columnDefs, 'LAX1')).toBe(false);
    expect(hasColumnWithHeaderName(agGridConfig.columnDefs, 'Laramie')).toBe(false);
    expect(hasColumnWithHeaderName(agGridConfig.columnDefs, 'Sierra')).toBe(false);
    expect(hasColumnWithHeaderName(agGridConfig.columnDefs, 'Taurus')).toBe(false);
  });

  it('valueGetter returns proper values', () => {
    const { result } = renderHook(() => useAgGridConfig(mockSkus));

    const agGridConfig = result.current;

    const data = mockSkus[0];
    const values = agGridConfig.columnDefs.map(columnDef => {
      const def = columnDef as ColDef;
      if (typeof def.valueGetter !== 'string') {
        return def.valueGetter({
          getValue: undefined,
          node: null,
          colDef: undefined,
          column: undefined,
          columnApi: undefined,
          api: undefined,
          context: undefined,
          data,
        });
      }
    });

    expect(values).toEqual([
      data.displayName,
      data.productName,
      data.brandTypeName,
      data.productWeightOz,
      'Has sku',
      mockSkuTypes.find(skuType => skuType.name === data.skuTypeName).description,
      data.packagingLotCropCode,
      data.allowedCropNames,
      data.caseQuantityPerPallet,
      data.childSkuName,
      data.labelPrimaryColor,
      data.labelSecondaryColor,
      data.internalExpirationDays,
      data.externalExpirationDays,
      data.netsuiteItem,
      data.gtin,
      data.packageImagery,
    ]);
  });
});

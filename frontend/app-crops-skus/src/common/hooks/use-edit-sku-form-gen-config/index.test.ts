import { HasFarm, SkuWithFarmInfo } from '@plentyag/app-crops-skus/src/common/types';
import { renderHook } from '@testing-library/react-hooks';
import { cloneDeep } from 'lodash';

import { mockCrops, mockSkus, mockSkuTypes } from '../../../common/test-helpers';
import { useSearchSkuTypes } from '../use-search-sku-types';

import { allowedPackagingLotCrops, useEditSkuFormGenConfig } from '.';

jest.mock('../use-search-sku-types');
const mockUseSearchSkuTypes = useSearchSkuTypes as jest.Mock;
mockUseSearchSkuTypes.mockReturnValue({
  isLoading: false,
  skuTypes: mockSkuTypes,
});

const mockFormValues = {
  farms: ['sites/LAX1/farms/LAX1'],
  description: 'test desc',
};

describe('useEditSkuFormGenConfig', () => {
  function expectSerializeResultToMatch(serializeResult: any, mockSku: SkuWithFarmInfo, hasFarm: HasFarm) {
    expect(serializeResult).toEqual({
      description: mockFormValues.description,
      hasFarm,
      childSkuName: undefined,
      properties: mockSku.properties,
      defaultCropName: mockSku.defaultCropName,
    });
  }

  it('returns undefined when sku not provided', () => {
    const { result } = renderHook(() => useEditSkuFormGenConfig(undefined, [], true));

    expect(result.current).toBeUndefined();
  });

  it('serializes the form data when editing', () => {
    const mockSku = mockSkus[0];
    const { result } = renderHook(() => useEditSkuFormGenConfig(mockSku, mockSkus, true));

    const serializeResult = result.current.serialize(mockFormValues);

    expectSerializeResultToMatch(serializeResult, mockSku, {
      'sites/LAX1/farms/LAX1': true,
      'sites/LAR1/farms/Laramie': false,
      'sites/SSF2/farms/Sierra': false,
      'sites/SSF2/farms/Taurus': false,
      'sites/SSF2/farms/Tigris': false,
    });
  });

  it('removes productWeight from serialized data when skuTypeName not provided', () => {
    const mockSku = mockSkus[0];
    const { result } = renderHook(() => useEditSkuFormGenConfig(mockSku, mockSkus, true));

    // product weight should not be included because "skuTypeName" is not provided (or invalid)
    const values = { ...mockFormValues, productWeightOz: 5, skuTypeName: '' };
    const serializeResult = result.current.serialize(values);

    expect(serializeResult.productWeightOz).toBe(undefined);
  });

  it('gets the product weight from the child sku for sku that is case type', () => {
    const mockSku = mockSkus[0];
    const { result } = renderHook(() => useEditSkuFormGenConfig(mockSku, mockSkus, true));
    const childSku = mockSkus[1];

    const values = { ...mockFormValues, childSkuName: childSku.name, skuTypeName: 'Case6Clamshell4oz' };
    const serializeResult = result.current.serialize(values);

    expect(serializeResult.productWeightOz).toBe(childSku.productWeightOz);
  });

  it('removes brandTypeName from serialized data when skuTypeName changed', () => {
    const mockSku = mockSkus[0];
    const { result } = renderHook(() => useEditSkuFormGenConfig(mockSku, mockSkus, true));

    // brand should not be included in serialized result for bulk.
    const values = { ...mockFormValues, brandTypeName: 'Plenty', skuTypeName: 'Bulk3lb' };
    const serializeResult = result.current.serialize(values);

    expect(serializeResult.brandTypeName).toBe(undefined);
  });

  it('removes caseQuantityPerPallet from serialized data when skuTypeName changed', () => {
    const mockSku = mockSkus[0];
    const { result } = renderHook(() => useEditSkuFormGenConfig(mockSku, mockSkus, true));

    // caseQuantityPerPallet should not be included in serialized result for bulk.
    const values = { ...mockFormValues, caseQuantityPerPallet: 1, skuTypeName: 'Bulk3lb' };
    const serializeResult = result.current.serialize(values);

    expect(serializeResult.caseQuantityPerPallet).toBe(undefined);
  });

  it('calculates the correct value in best by date label', () => {
    const mockSku = mockSkus[0];
    const { result } = renderHook(() => useEditSkuFormGenConfig(mockSku, mockSkus, true));

    expect(result.current.fields).toHaveLength(16);
    expect(result.current.fields[9]['computed'](mockSkus[0])[0]).toEqual(
      expect.objectContaining({ label: 'Best by date: 17' })
    );
  });

  it('validates the internal storage life field', () => {
    const mockSku = mockSkus[0];
    const { result } = renderHook(() => useEditSkuFormGenConfig(mockSku, mockSkus, true));

    const internalStorageLifeField = result.current.fields[7] as FormGen.FieldTextField;

    expect(internalStorageLifeField.name).toBe('internalExpirationDays');

    expect(() => internalStorageLifeField.validate.validateSync(0)).toThrowError();
    expect(() => internalStorageLifeField.validate.validateSync(1)).not.toThrowError();
    expect(() => internalStorageLifeField.validate.validateSync(10)).not.toThrowError();
    expect(() => internalStorageLifeField.validate.validateSync(11)).toThrowError();
  });

  it('does not send "hasFarm" in edit mode when nothing has changed', () => {
    const mockSku = mockSkus[0];
    const { result } = renderHook(() => useEditSkuFormGenConfig(mockSku, mockSkus, true));

    const mockFormValuesWithChangedFarm = cloneDeep(mockFormValues);
    mockFormValuesWithChangedFarm.farms = ['sites/SSF2/farms/Tigris'];

    const serializeResult = result.current.serialize(mockFormValuesWithChangedFarm);

    expectSerializeResultToMatch(serializeResult, mockSku, undefined);
  });

  it('only allows crops matching regex in allowedPackagingLotCrops', () => {
    expect(allowedPackagingLotCrops(mockCrops)).toEqual([mockCrops[0], mockCrops[1]]);
  });
});

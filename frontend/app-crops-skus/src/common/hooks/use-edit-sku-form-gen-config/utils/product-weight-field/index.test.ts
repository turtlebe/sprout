import { mockSkus, mockSkuTypes } from '@plentyag/app-crops-skus/src/common/test-helpers';
import { cloneDeep } from 'lodash';

import { productWeightField, SKU_WEIGHT_LABEL } from '.';

const mockEditedValues = {
  skuTypeName: '',
  productName: '',
  productWeightOz: 3,
  brandTypeName: '',
  caseQuantityPerPallet: 5,
  description: '',
  allowedCropNames: [],
  packagingLotCropCode: '',
  childSkuName: '',
  labelPrimaryColor: '',
  labelSecondaryColor: '',
  internalExpirationDays: 1,
  externalExpirationDays: 1,
  netsuiteItem: '',
  gtin: '',
  farms: [],
};

describe('productWeightField', () => {
  it('does not show product weight field if "skuTypeName" has not been entered', () => {
    expect(
      productWeightField({
        skuToEdit: undefined, // doesn't matter for this test
        editedValues: mockEditedValues,
        isUpdating: false,
        skuTypes: mockSkuTypes,
        skus: mockSkus,
      })
    ).toEqual([]);
  });

  it('shows product weight field for sku type that is clamshell', () => {
    const skuToEdit = mockSkus[0];
    const _mockEditedValues = cloneDeep(mockEditedValues);
    _mockEditedValues.skuTypeName = 'Clamshell4o5oz';

    const fields = productWeightField({
      skuToEdit: skuToEdit,
      editedValues: _mockEditedValues,
      isUpdating: false,
      skuTypes: mockSkuTypes,
      skus: mockSkus,
    });
    expect(fields).toHaveLength(1);
    expect(fields[0].type).toEqual('TextField');
    expect(fields[0].name).toEqual('productWeightOz');
  });

  it('shows product weight field for sku type that is bulk', () => {
    const skuToEdit = mockSkus[0];
    const _mockEditedValues = cloneDeep(mockEditedValues);
    _mockEditedValues.skuTypeName = 'Bulk3lb';

    const fields = productWeightField({
      skuToEdit: skuToEdit,
      editedValues: _mockEditedValues,
      isUpdating: false,
      skuTypes: mockSkuTypes,
      skus: mockSkus,
    });
    expect(fields).toHaveLength(1);
    expect(fields[0].type).toEqual('TextField');
    expect(fields[0].name).toEqual('productWeightOz');
  });

  it('shows read-only product weight field for sku type that is case', () => {
    const skuToEdit = mockSkus[3];
    const childSku = mockSkus[1]; // this sku has product weight

    const _mockEditedValues = cloneDeep(mockEditedValues);
    _mockEditedValues.skuTypeName = 'Case6Clamshell4oz';
    _mockEditedValues.childSkuName = childSku.name;

    const fields = productWeightField({
      skuToEdit: skuToEdit,
      editedValues: _mockEditedValues,
      isUpdating: false,
      skuTypes: mockSkuTypes,
      skus: mockSkus,
    });
    expect(fields).toHaveLength(1);
    expect(fields[0].type).toEqual('Typography');
    expect(fields[0].name).toEqual('productWeightOzReadOnly');
    expect(fields[0].label).toEqual(`${SKU_WEIGHT_LABEL}: ${childSku.productWeightOz}`);
  });

  it('does not show read-only product weight field for sku type that is case when it has no product weight', () => {
    const childSku = mockSkus[2]; // this sku has no product weight.
    const _mockEditedValues = cloneDeep(mockEditedValues);
    _mockEditedValues.skuTypeName = 'Case6Clamshell4oz';
    _mockEditedValues.childSkuName = childSku.name;

    expect(
      productWeightField({
        skuToEdit: undefined, // doesn't matter for this test
        editedValues: _mockEditedValues,
        isUpdating: false,
        skuTypes: mockSkuTypes,
        skus: mockSkus,
      })
    ).toEqual([]);
  });
});

import { mocksResourcesState } from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-maps-state';
import { cloneDeep } from 'lodash';

import { getCropsInResource } from '.';

const resourceWithBac = mocksResourcesState[0];
const resourceWithBacAndWhc = mocksResourcesState[2];
const cleanTable = mocksResourcesState[3];

describe('getCropsInResource', () => {
  it('returns empty array when resource has no material', () => {
    expect(getCropsInResource(cleanTable)).toHaveLength(0);
  });

  it('returns empty array when there is crop in resource', () => {
    const _noProduct = cloneDeep(resourceWithBac);
    delete _noProduct.materialObj.product;
    expect(getCropsInResource(_noProduct)).toHaveLength(0);
  });

  it('returns empty array when crop is empty string or just single comma', () => {
    const emptyStringProduct = cloneDeep(resourceWithBac);
    emptyStringProduct.materialObj.product = '';
    expect(getCropsInResource(emptyStringProduct)).toHaveLength(0);

    const productWithJustComma = cloneDeep(resourceWithBac);
    productWithJustComma.materialObj.product = ',';
    expect(getCropsInResource(productWithJustComma)).toHaveLength(0);
  });

  it('returns crops in the resource', () => {
    expect(getCropsInResource(resourceWithBac)).toEqual(['BAC']);
    expect(getCropsInResource(resourceWithBacAndWhc)).toEqual(['BAC', 'WHC']);
  });
});

import { PackagingLot } from '@plentyag/core/src/types';

import { ProductAlternativesMap } from '../../constants';

export const getProductFromLot = (lot: PackagingLot) => {
  const foundProduct = ProductAlternativesMap[lot?.product] || lot?.product || null;

  if (!foundProduct) {
    console.error(`Product is not found for this lot ${lot?.lotName ?? ''}`);
  }

  return foundProduct;
};

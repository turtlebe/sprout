import { FarmDefSku } from '@plentyag/core/src/farm-def/types';
import { DateTime } from 'luxon';

import { PackagingLot } from '../types';

export const getBestByDateFromLotAndSku = (lot: PackagingLot, sku?: FarmDefSku): Date => {
  if (!sku) {
    return null;
  }
  const bestByDays = sku.internalExpirationDays + sku.externalExpirationDays;
  return DateTime.fromSQL(lot.properties.packDate).plus({ days: bestByDays }).toJSDate();
};

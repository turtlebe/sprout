/**
 * The date FarmOS starts packaging lots generation history.
 * This allows all packaging lots of a particular year
 * to have an unique prefix (e.g. 1- for 2018 year, 2- for 2019 year and so on).
 */
export const PACKAGING_LOT_FORMAT_DATE_ZERO = new Date(2018, 1, 1);
export const ONE_DAY_IN_MS = 86400000;

/**
 * Build a packaging lot name (e.g.: 3-LAX1-B11-111).
 * @param farmCode The farm code from FarmDef (e.g.: TIGRIS, LAX1).
 * @param packagingLotCropCode The packaging lot crop code.
 * @param packDate The pack date of the lot.
 */
export function getPackagingLotName(farmCode: string, packagingLotCropCode: string, packDate: Date) {
  const year = packDate.getFullYear() - PACKAGING_LOT_FORMAT_DATE_ZERO.getFullYear() + 1;
  const dayOfYear =
    (Date.UTC(packDate.getFullYear(), packDate.getMonth(), packDate.getDate()) -
      Date.UTC(packDate.getFullYear(), 0, 0)) /
    ONE_DAY_IN_MS;
  return `${year}-${farmCode}-${packagingLotCropCode}-${dayOfYear}`;
}

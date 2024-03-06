/**
 * Used by both crops and skus to indicate whether or not
 * each farm uses the given crop (or sku).
 */
export interface HasFarm {
  [farmName: string]: boolean;
}

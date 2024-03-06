import { FarmDefSku } from 'core/src/farm-def/types';
import { array, number, object, string } from 'yup';

const PackagingLotSkuSchema = object({
  allowedCropNames: array().of(string()),
  brandTypeName: string(),
  caseQuantityPerPallet: number().nullable(),
  childSkuName: string().required(),
  defaultCropName: string().nullable(),
  description: string().nullable(),
  displayAbbreviation: string().required(),
  displayName: string().required(),
  externalExpirationDays: number().required(),
  gtin: string().required(),
  internalExpirationDays: number().required(),
  kind: string().oneOf(['sku']).required(),
  labelPrimaryColor: string(),
  labelSecondaryColor: string(),
  name: string().required(),
  netsuiteItem: string().required(),
  packagingLotCropCode: string().required(),
  path: string(),
  productName: string().required(),
  productWeightOz: number().required(),
  properties: object(),
  skuTypeName: string().required(),
});

/**
 * This utility function to test if a Sku is a valid Sku for Packaging Lot which requires specific fields
 * (i.e. packagingLotCropCode, productWeightOz, childSkuName, etc.)
 */
export const isValidPackagingLotSku = (sku: FarmDefSku): boolean => PackagingLotSkuSchema.isValidSync(sku);

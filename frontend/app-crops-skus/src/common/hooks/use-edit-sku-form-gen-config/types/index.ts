export interface EditSkuFormikValues {
  skuTypeName?: string;
  productName: string;
  productWeightOz: number;
  brandTypeName: string;
  caseQuantityPerPallet: number;
  description: string;
  allowedCropNames: string[];
  packagingLotCropCode: string;
  childSkuName: string;
  labelPrimaryColor: string;
  labelSecondaryColor: string;
  internalExpirationDays: number;
  externalExpirationDays: number;
  netsuiteItem: string;
  gtin: string;
  farms: string[];
}

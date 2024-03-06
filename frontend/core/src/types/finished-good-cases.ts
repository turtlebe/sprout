type Material = ProdResources.ResourceState['materialObj'];

export interface FinishedGoodsPtiLabel {
  caseId: string;
  lot: string;
  item: string;
  packageType: string;
}

export interface FinishedGoodSkuProperties {
  sku: string;
  ptiLabelQrCodeContent: FinishedGoodsPtiLabel;
  crop?: string; // deprecated
  packageType?: string; // deprecated?
}

export interface FinishedGoodCropProperties {
  version: number;
  previousProduct: string;
}

export interface FinishedGoodCase extends Material {
  materialType: 'FINISHED_GOOD';
  properties: FinishedGoodSkuProperties | FinishedGoodCropProperties;
}

export enum PackagingLotTestStatus {
  NONE = 'NONE',
  HOLD = 'HOLD',
  PASS = 'PASS',
  FAIL = 'FAIL',
}

export interface PackagingLot extends Material {
  materialType: 'PACKAGING_LOT';
  properties: PackagingLotProperties;
}

export interface OverrideReleaseDetails {
  status: PackagingLotTestStatus;
  author: string;
  notes: string;
  updatedAt: string;
}

export interface ReleaseDetails {
  passedLtStatus: PackagingLotTestStatus;
  passedQaStatus: PackagingLotTestStatus;
  overriddenLtStatus?: PackagingLotTestStatus;
  overriddenLtAuthor?: string;
  overriddenLtNotes?: string;
  overriddenLtUpdatedAt?: string;
  overriddenQaStatus: PackagingLotTestStatus;
  overriddenQaAuthor?: string;
  overriddenQaNotes?: string;
  overriddenQaUpdatedAt?: string;
  releasedAt?: string;
}

export interface SkuReleaseDetails extends ReleaseDetails {
  nsItem: string;
}

export interface PackagingLotProperties extends ReleaseDetails {
  farmName: string;
  packageComponents?: Record<string, any>;
  packDate: string;
  siteName: string;
  linerLotNames?: string[];
  tubLotNames?: string[];
  skuReleaseDetails?: SkuReleaseDetails[];
}

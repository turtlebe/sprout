import { FarmDefCrop, FarmDefSku } from '@plentyag/core/src/farm-def/types';
import { FinishedGoodCase, PackagingLot } from '@plentyag/core/src/types';

export enum FinishedGoodsStatus {
  RELEASED = 'released',
  HOLD = 'hold',
  UNRELEASED = 'unreleased',
  EXPIRED = 'expired',
}
export interface FinishedGoodsData {
  lots: PackagingLot[];
  skus: FarmDefSku[];
  crops: FarmDefCrop[];
  cases: FinishedGoodCase[];
}

export enum TestStatusField {
  QA = 'qa',
  LAB_TESTING = 'lt',
}

export interface TestStatusOverrideFields {
  passedStatus: string;
  overriddenStatus: string;
  overriddenAuthor: string;
  overriddenNotes: string;
  overriddenUpdatedAt: string;
}

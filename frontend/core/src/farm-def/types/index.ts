import { ContainerLocation } from './container-location';
import { DeviceLocation } from './device-location';
import { FarmDefInterface } from './interface';
import { Recipes } from './recipes';
import { ScheduleDefinition } from './schedule-definition';

export * from './container-location';
export * from './device-location';
export * from './interface';
export * from './method';
export * from './schedule-definition';
export * from './obsevation-selector';
export * from './recipes';

export interface FarmDefChildMap<T> {
  [name: string]: T;
}

export type FarmDefMappingTypes = 'relates' | 'feeds';

export interface FarmDefMapping {
  to: string;
  from: string;
  kind: 'mapping';
  type: FarmDefMappingTypes;
}

export interface FarmDefObject {
  id: string;
  kind: Kind;
  path: string;
  name: string;
  isLoaded?: boolean; // true if this object has been loaded by farm-def-store.
  displayName?: string;
  properties: { farmCode?: string; indexablePositionCount?: number };
  interfaces?: FarmDefChildMap<FarmDefInterface>;
  scheduleDefinitions?: FarmDefChildMap<ScheduleDefinition>;
  deviceLocations?: { [key: string]: DeviceLocation };
  containerLocations?: { [key: string]: ContainerLocation };
  mappings?: FarmDefMapping[];
}

export const validKind = ['root', 'site', 'farm', 'area', 'line', 'machine', 'machineZone', 'workCenter'] as const;
export const validKinds = [
  'sites',
  'farms',
  'areas',
  'lines',
  'machines',
  'machineZones',
  'workCenters',
  'interfaces',
  'methods',
  'containerLocations',
] as const;
export type Kind = typeof validKind[number];
export type Kinds = typeof validKinds[number];

export interface FarmDefRoot extends FarmDefObject {
  kind: 'root';
  sites: FarmDefChildMap<FarmDefSite>;
}

export interface FarmDefSite extends FarmDefObject {
  kind: 'site';
  country: string;
  address: string;
  timezone: string;
  areas?: FarmDefChildMap<FarmDefArea>;
  farms?: FarmDefChildMap<FarmDefFarm>;
}

export interface FarmDefWorkcenter extends FarmDefObject {
  kind: 'workCenter';
  class: string;
}

export interface FarmDefFarm extends FarmDefObject {
  kind: 'farm';
  class: string;
  workCenters: FarmDefChildMap<FarmDefWorkcenter>;
}

export interface FarmDefArea extends FarmDefObject {
  kind: 'area';
  class?: string;
  lines: FarmDefChildMap<FarmDefLine>;
}

export interface FarmDefLine extends FarmDefObject {
  kind: 'line';
  class?: string;
  machines?: FarmDefChildMap<FarmDefMachine>;
}

export interface FarmDefMachine extends FarmDefObject {
  kind: 'machine';
  class?: string;
  machineZones?: FarmDefChildMap<FarmDefMachineZone>;
}

export interface FarmDefMachineZone extends FarmDefObject {
  kind: 'machineZone';
}

export interface FarmDefSku {
  name: string;
  kind: string;
  path: string;
  description: string;
  netsuiteItem: string;
  gtin: string;
  productName: string;
  displayName: string;
  displayAbbreviation: string;
  skuTypeName: string;
  packagingLotCropCode: string;
  defaultCropName: string;
  allowedCropNames: string[];
  labelPrimaryColor: string;
  labelSecondaryColor: string;
  internalExpirationDays: number;
  externalExpirationDays: number;
  childSkuName: string;
  properties: {};
  brandTypeName?: string; // only provided for SkuTypeClasses that are: "Clamshell" or "Case".
  productWeightOz?: number; // only provided for SkuTypeClasses that are: "Clamshell" or "Bulk".
  caseQuantityPerPallet?: number; // only provided SkuTypeClasses that are: "Case".
}

export interface ChildCrop {
  defaultCropName: string;
  allowedCropNames: string[];
  minRatio: number;
  maxRatio: number;
  targetRatio: number;
}

export interface FarmDefCrop {
  name: string;
  commonName: string;
  displayName: string;
  description: string;
  displayAbbreviation: string;
  path: string;
  cropTypeName: string; // ex: LeafyGreens
  childCrops: ChildCrop[];
  isSeedable: boolean;
  seedPartNumbers: string[];
  media: string;
  cultivar: string;
  properties: {
    plannedGrowDays?: number;
    scientificName?: string;
    trialDescription?: string;
    recipes?: { [farm: string]: Recipes };
  };
}

export interface FarmDefCropType {
  name: string;
  path: string;
  description: string;
  kind: string;
  properties: {};
}

export enum SkuTypeClasses {
  'Case' = 'Case',
  'Bulk' = 'Bulk',
  'Clamshell' = 'Clamshell',
}

export interface FarmDefSkuType {
  name: string;
  path: string;
  description: string;
  kind: string;
  properties: {
    childSkuQuantity?: number;
    class: SkuTypeClasses;
    hasChildSku: boolean;
    legacyName: string;
    weightOz: number;
  };
}

export interface FarmDefMeasurementUnit {
  kind: string;
  unit: string;
  description: string;
  protoEnumMapping: string;
  symbol: string;
  conversionToDefaultUnit: string;
  conversionFromDefaultUnit: string;
}

export interface FarmDefMeasurementType {
  name: string;
  path: string;
  description: string;
  kind: string;
  properties: {};
  key: string;
  defaultUnit: string;
  supportedUnits: { [key: string]: FarmDefMeasurementUnit };
}

export type FarmDefTypes = FarmDefMeasurementType | FarmDefSkuType | FarmDefCropType;

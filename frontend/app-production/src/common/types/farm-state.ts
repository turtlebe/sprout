export interface FarmStateContainer {
  type: 'Tower' | 'Table' | 'Tray';
  materialStatus?: ProdResources.MaterialStatus;
  resourceState: ProdResources.ResourceState;
  harvestedAt?: string;
  transplantedAt?: string;
  initialized?: boolean;
  loadedAt?: string;
  parentChildIdentifierType?: string;
  parentResourceIdentifier?: string;
  positionInParent?: string;
  positionsOfChildren?: any;
}

export enum LoadedAtAttributes {
  LOADED_IN_GERM_AT = 'loadedInGermAt',
  LOADED_IN_PROP_AT = 'loadedInPropAt',
  LOADED_IN_GROW_AT = 'loadedInGrowAt',
}

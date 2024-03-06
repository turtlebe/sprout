// various types used to access traceability resources.

export type LabelTypes = 'MATERIAL' | 'CONTAINER';

export type ContainerTypes = 'TRAY' | 'TOWER' | 'TABLE' | 'TOTE' | 'CARRIER';

export type MaterialTypes =
  | 'LOADED_CARRIER'
  | 'LOADED_TOWER'
  | 'LOADED_TRAY'
  | 'LOADED_TOTE'
  | 'LOADED_TABLE'
  | 'SEED'
  | 'MEDIA'
  | 'BULK_HARVEST'
  | 'BLEND_LOT'
  | 'BULK_SCRAP'
  | 'FINISHED_GOOD'
  | 'PACKAGING_LOT';

interface LabelCategory {
  id: string;
  name: string;
}

export interface LabelItem {
  id: string;
  name: string;
  labelType: LabelTypes;
  description: string;
  resourceTypes: (ContainerTypes | MaterialTypes)[];
  labelCategories: LabelCategory[];
}

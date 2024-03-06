import { FarmDefSkuType, SkuTypeClasses } from '@plentyag/core/src/farm-def/types';

export const mockSkuTypes: FarmDefSkuType[] = [
  {
    description: '4oz Clamshell',
    kind: 'skuType',
    name: 'Clamshell4oz',
    path: 'skuTypes/Clamshell4oz',
    properties: {
      class: SkuTypeClasses.Clamshell,
      hasChildSku: false,
      legacyName: 'UNIT_TYPE_CLAMSHELL_4OZ',
      weightOz: 4,
    },
  },
  {
    description: '4.5oz Clamshell',
    kind: 'skuType',
    name: 'Clamshell4o5oz',
    path: 'skuTypes/Clamshell4o5oz',
    properties: {
      class: SkuTypeClasses.Clamshell,
      hasChildSku: false,
      legacyName: 'UNIT_TYPE_CLAMSHELL_4o5OZ',
      weightOz: 4.5,
    },
  },
  {
    name: 'Case6Clamshell4oz',
    path: 'skuTypes/Case6Clamshell4oz',
    description: 'Case of 6 Clamshells 4oz',
    kind: 'skuType',
    properties: {
      childSkuQuantity: 6,
      class: SkuTypeClasses.Case,
      hasChildSku: true,
      legacyName: 'UNIT_TYPE_CASE_6_CLAMSHELL_4OZ',
      weightOz: undefined,
    },
  },
  {
    name: 'Bulk3lb',
    path: 'skuTypes/Bulk3lb',
    description: 'Bulk 3lb',
    kind: 'skuType',
    properties: {
      class: SkuTypeClasses.Bulk,
      hasChildSku: false,
      legacyName: 'UNIT_TYPE_BULK_3LB',
      weightOz: 48,
    },
  },
];

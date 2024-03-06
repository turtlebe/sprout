import { PostharvestQaLot, PostharvestQaSku } from '../types';

export const mockPostharvestQaLots: PostharvestQaLot[] = [
  {
    lot: '5-LAX1-CRS-276',
    total: 1,
    skus: ['CRSCase6Clamshell4o5ozPlenty', 'KC1Clamshell4o5ozPlenty4.5oz'],
    isIngested: true,
  },
  {
    lot: '5-LAX1-C11-287',
    total: 3,
    skus: ['KC1Clamshell4o5ozPlenty4.5oz'],
    isIngested: false,
  },
  {
    lot: '5-LAX1-C11-193',
    total: 3,
    skus: ['C11Clamshell4o5ozPlenty8.5oz'],
    isIngested: false,
  },
];

export const mockPostharvestQaSkus: PostharvestQaSku[] = [
  {
    id: '5-LAX1-CRS-276_CRSCase6Clamshell4o5ozPlenty',
    lot: '5-LAX1-CRS-276',
    total: 1,
    sku: 'CRSCase6Clamshell4o5ozPlenty',
    isIngested: true,
  },
  {
    id: '5-LAX1-CRS-276_KC1Clamshell4o5ozPlenty4.5oz',
    lot: '5-LAX1-CRS-276',
    total: 1,
    sku: 'KC1Clamshell4o5ozPlenty4.5oz',
    isIngested: false,
  },
  {
    id: '5-LAX1-C11-287_KC1Clamshell4o5ozPlenty4.5oz',
    lot: '5-LAX1-C11-287',
    total: 3,
    sku: 'KC1Clamshell4o5ozPlenty4.5oz',
    isIngested: false,
  },
  {
    id: '5-LAX1-C11-193_C11Clamshell4o5ozPlenty8.5oz',
    lot: '5-LAX1-C11-193',
    total: 3,
    sku: 'C11Clamshell4o5ozPlenty8.5oz',
    isIngested: false,
  },
];

import { ColDef } from '@ag-grid-community/all-modules';

export type PartialColDef = Pick<ColDef, 'headerName' | 'field' | 'colId' | 'headerTooltip'>;

export interface PartialColDefs {
  [name: string]: PartialColDef;
}

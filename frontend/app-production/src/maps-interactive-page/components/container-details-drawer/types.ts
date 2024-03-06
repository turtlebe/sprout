export interface TableRowData {
  rowName: string;
  resources: ProdResources.ResourceState[];
}

export type TableData = TableRowData[];

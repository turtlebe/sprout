export interface ContainerLocation {
  ref: string;
  kind: 'containerLocation';
  index: number;
  name: string;
  path: string;
  class: string;
  parentId: string;
  parentPath: string;
  properties: {};
  containerTypes: ('Table' | 'Tower' | 'Tray')[];
}

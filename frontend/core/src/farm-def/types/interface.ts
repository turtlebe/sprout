import { FarmDefChildMap, FarmDefMethod } from '.';

export interface FarmDefInterface {
  class: string;
  description?: string;
  kind: 'interface';
  methods: FarmDefChildMap<FarmDefMethod>;
  name: string;
  parentPath: string;
  path: string;
  properties?: {};
  ref?: string;
}

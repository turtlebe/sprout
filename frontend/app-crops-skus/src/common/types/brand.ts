export interface Brand {
  name: string;
  path: string;
  description: string;
  kind: 'brandType';
}

export type Brands = Brand[];

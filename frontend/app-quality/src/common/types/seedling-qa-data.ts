interface LocationProperties {
  location: string;
  properties: { name: string; type: string; value: any }[];
}

export type SeedlingQaData = LocationProperties[];

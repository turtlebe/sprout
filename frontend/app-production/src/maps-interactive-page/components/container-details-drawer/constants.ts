interface TableDimensions {
  traysVertically: number;
  traysHorizontally: number;
}

interface TrayDimensions {
  plugsVertically: number;
  plugsHorizontally: number;
}

interface TowerDimensions {
  plugs: number;
}

export enum Site {
  SSF2 = 'SSF2',
  LAX1 = 'LAX1',
  Default = 'Default',
}

export const TableDimensions: Record<Site, TableDimensions> = {
  [Site.SSF2]: {
    traysVertically: 6,
    traysHorizontally: 6,
  },
  [Site.LAX1]: {
    traysVertically: 9,
    traysHorizontally: 6,
  },
  [Site.Default]: {
    traysVertically: 8,
    traysHorizontally: 8,
  },
};

export const TrayDimensions: Record<Site, TrayDimensions> = {
  [Site.SSF2]: {
    plugsVertically: 16, // TODO: this is not the actual number, we are waiting to find out the actual number soon
    plugsHorizontally: 10, // TODO: this is not the actual number, we are waiting to find out the actual number soon
  },
  [Site.LAX1]: {
    plugsVertically: 16,
    plugsHorizontally: 10,
  },
  [Site.Default]: {
    plugsVertically: 16,
    plugsHorizontally: 10,
  },
};

export const TowerDimensions: Record<Site, TowerDimensions> = {
  [Site.SSF2]: {
    plugs: 304, // TODO: this is not the actual number, we are waiting to find out the actual number soon
  },
  [Site.LAX1]: {
    plugs: 304,
  },
  [Site.Default]: {
    plugs: 304,
  },
};

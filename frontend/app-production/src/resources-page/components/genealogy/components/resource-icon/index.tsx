import MediaSvg, { ReactComponent as MediaReactComp } from '@plentyag/brand-ui/src/assets/svg/bag-of-media.svg';
import SeedSvg, { ReactComponent as SeedReactComp } from '@plentyag/brand-ui/src/assets/svg/bag-of-seeds.svg';
import TableSvg, { ReactComponent as TableReactComp } from '@plentyag/brand-ui/src/assets/svg/table.svg';
import TowerSvg, { ReactComponent as TowerReactComp } from '@plentyag/brand-ui/src/assets/svg/tower.svg';
import TraySvg, { ReactComponent as TrayReactComp } from '@plentyag/brand-ui/src/assets/svg/tray.svg';
import React from 'react';

export const dataTestIds = {
  icon: 'icon',
};

interface ResourceIcon {
  width: number;
  height: number;
  resourceType: ProdResources.ResourceTypes;
}

const resourceTypeToIcon = new Map<ProdResources.ResourceTypes, { reactComp: React.FC<any>; svg: string }>([
  ['TOWER', { reactComp: TowerReactComp, svg: TowerSvg }],
  ['TRAY', { reactComp: TrayReactComp, svg: TraySvg }],
  ['TABLE', { reactComp: TableReactComp, svg: TableSvg }],
  ['SEED', { reactComp: SeedReactComp, svg: SeedSvg }],
  ['MEDIA', { reactComp: MediaReactComp, svg: MediaSvg }],
]);

export const hasIcon = (resourceType: ProdResources.ResourceTypes) => {
  return resourceTypeToIcon.has(resourceType);
};

export const ResourceIcon: React.FC<ResourceIcon> = ({ width, height, resourceType }) => {
  if (!hasIcon(resourceType)) {
    return null;
  }
  const Icon = resourceTypeToIcon.get(resourceType).reactComp;
  return <Icon data-testid={dataTestIds.icon} width={width} height={height} />;
};

export const ResourceSvg = (resourceType: ProdResources.ResourceTypes): string => {
  if (hasIcon(resourceType)) {
    return resourceTypeToIcon.get(resourceType).svg;
  }
};

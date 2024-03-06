import { FDS_NAME } from '@plentyag/app-production/src/constants';
import { getKindFromPath } from '@plentyag/core/src/farm-def/utils';

export function isCommentable(resource: ProdResources.ResourceState) {
  const lotName = resource?.materialObj?.lotName;
  const isTray = resource?.containerObj?.containerType === 'TRAY';
  const area = getKindFromPath(resource?.location?.containerLocation?.farmDefPath, 'areas');
  const machine = getKindFromPath(resource?.location?.containerLocation?.farmDefPath, 'machines');
  const isPropLevel = machine?.startsWith(FDS_NAME.propLevel);
  const isGrowLine = machine?.startsWith(FDS_NAME.growLine);
  const isPropTable = area === FDS_NAME.propagation && isPropLevel;
  const isGrowTower = area === FDS_NAME.verticalGrow && isGrowLine;

  return Boolean(!isTray && lotName && (isPropTable || isGrowTower));
}

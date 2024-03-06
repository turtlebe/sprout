import { useFeatureFlag } from '@plentyag/brand-ui/src/components/feature-flag';
import { FarmDefWorkcenter } from '@plentyag/core/src/farm-def/types';

export const OTHER_WORKCENTERS_FEATURE_KEY = 'import-plans-other-workcenters';
export const DEFAULT_WORKCENTERS = ['Seed'];

export const useWorkcentersFeatureFlag = (workcenters: FarmDefWorkcenter[] = []): FarmDefWorkcenter[] => {
  const otherWorkcentersString = useFeatureFlag(OTHER_WORKCENTERS_FEATURE_KEY);
  const otherWorkcenters = otherWorkcentersString ? otherWorkcentersString.split(',') : [];
  return workcenters.filter(
    workcenter => DEFAULT_WORKCENTERS.includes(workcenter.name) || otherWorkcenters.includes(workcenter.name)
  );
};

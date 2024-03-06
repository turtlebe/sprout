import { ContainerData, ContainerState } from '@plentyag/app-production/src/maps-interactive-page/types';

import { AgeCohortDate } from '../../types';
import { doesResourceHaveMatchingCrop } from '../does-resource-have-matching-crop';
import { doesResourceHaveMatchingLabel } from '../does-resource-have-matching-label';
import { getResourceLoadedDate } from '../get-resource-loaded-date';
import { isLoadDateInSameDayAsAgeCohortDate } from '../is-load-date-in-same-day-as-age-cohort-date';

export const SOLID_OPACITY = 1.0;
export const FADED_OPACITY = 0.1;

interface GetContainerOpacityArgs {
  resource: ContainerState | ContainerData;
  selectedAgeCohortDate: AgeCohortDate;
  selectedCrops: string[];
  selectedLabels: string[];
}

export const getContainerOpacity = ({
  resource,
  selectedAgeCohortDate,
  selectedCrops,
  selectedLabels,
}: GetContainerOpacityArgs): number => {
  const isEmptyContainer = !resource?.resourceState?.materialObj && resource?.resourceState?.containerObj;
  const loadedDate = getResourceLoadedDate(resource);

  let opacity = SOLID_OPACITY;
  if (
    !doesResourceHaveMatchingCrop(resource?.resourceState, selectedCrops) ||
    !doesResourceHaveMatchingLabel(resource?.resourceState, selectedLabels) ||
    (selectedAgeCohortDate &&
      selectedAgeCohortDate !== 'all' &&
      (isEmptyContainer || !isLoadDateInSameDayAsAgeCohortDate(selectedAgeCohortDate, loadedDate)))
  ) {
    opacity = FADED_OPACITY;
  }

  return opacity;
};

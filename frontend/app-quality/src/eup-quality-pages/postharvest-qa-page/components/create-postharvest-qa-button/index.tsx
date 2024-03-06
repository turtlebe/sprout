import { useLoadSkusForPackagingLots } from '@plentyag/app-production/src/reports-finished-goods-page/hooks';
import { EditButton, Show } from '@plentyag/brand-ui/src/components';
import { useCoreStore } from '@plentyag/core/src/core-store';
import { PermissionLevels, Resources } from '@plentyag/core/src/core-store/types';
import { useFetchPackagingLots } from '@plentyag/core/src/hooks';
import { DateTime } from 'luxon';
import React from 'react';

import { useFetchAssessmentTypes } from '../../hooks';
import { useEditPostharvestQaFormGenConfig } from '../../hooks/use-edit-postharvest-qa-form-gen-config';

export interface CreatePostharvestQaButton {
  onSuccess: () => void;
  siteName: string;
  farmName: string;
}

export const CreatePostharvestQaButton: React.FC<CreatePostharvestQaButton> = ({
  onSuccess = () => {},
  siteName,
  farmName,
}) => {
  const [{ currentUser }] = useCoreStore();
  const { username, currentFarmDefPath } = currentUser;

  const canEdit = currentUser.hasPermission(Resources.HYP_QUALITY, PermissionLevels.EDIT);

  const endDateTime = DateTime.now();
  const startDateTime = endDateTime.minus({ days: 3 });

  const { assessmentTypes, isLoading: isLoadingAssessmentTypes } = useFetchAssessmentTypes();

  const {
    lots,
    lotsRecord,
    isLoading: isLoadingLots,
  } = useFetchPackagingLots({
    farmPath: currentFarmDefPath,
    startDate: startDateTime.toJSDate(),
    endDate: endDateTime.toJSDate(),
  });

  const {
    skus,
    skusRecord,
    isLoading: isLoadingSkus,
  } = useLoadSkusForPackagingLots({
    lots,
    includeDeleted: true,
    skuTypeClass: 'Case',
  });

  const formGenConfig = useEditPostharvestQaFormGenConfig({
    lots,
    lotsRecord,
    skus,
    skusRecord,
    assessmentTypes,
    username,
    siteName,
    farmName,
  });

  const toDisable = Boolean(isLoadingLots || isLoadingSkus || isLoadingAssessmentTypes || !formGenConfig);

  return (
    <Show when={canEdit}>
      <EditButton formGenConfig={formGenConfig} isUpdating={false} disabled={toDisable} onSuccess={onSuccess} />
    </Show>
  );
};

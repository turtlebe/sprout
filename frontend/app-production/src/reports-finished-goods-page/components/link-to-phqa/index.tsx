import { useAppPaths } from '@plentyag/app-production/src/common/hooks/use-app-paths';
import { SEARCH_POSTHARVEST_AUDIT_SUMMARY } from '@plentyag/app-quality/src/eup-quality-pages/postharvest-qa-page/constants';
import {
  PostharvestAuditSummary,
  PostharvestAuditSummaryRequest,
} from '@plentyag/app-quality/src/eup-quality-pages/postharvest-qa-page/types';
import { PlentyLink, Show } from '@plentyag/brand-ui/src/components';
import { CircularProgress } from '@plentyag/brand-ui/src/material-ui/core';
import { useCoreStore } from '@plentyag/core/src/core-store';
import { PermissionLevels, Resources } from '@plentyag/core/src/core-store/types';
import { FarmDefSku } from '@plentyag/core/src/farm-def/types';
import { getKindFromPath } from '@plentyag/core/src/farm-def/utils';
import { useSwrAxios } from '@plentyag/core/src/hooks';
import { PackagingLot, PaginatedList } from '@plentyag/core/src/types';
import { getScopedDataTestIds, toQueryParams } from '@plentyag/core/src/utils';
import React, { useState } from 'react';

const dataTestIds = getScopedDataTestIds(
  {
    loading: 'loading',
  },
  'LinkToPHQA'
);

export { dataTestIds as dataTestIdsLinkToPHQA };

export interface LinkToPHQA {
  sku: FarmDefSku;
  lot: PackagingLot;
}

export const LinkToPHQA: React.FC<LinkToPHQA> = ({ sku, lot }) => {
  const [{ currentUser }] = useCoreStore();
  const { currentFarmDefPath } = currentUser;

  const { postharvestBasePath } = useAppPaths();

  const siteName = getKindFromPath(currentFarmDefPath, 'sites');
  const farmName = getKindFromPath(currentFarmDefPath, 'farms');
  const isAllowed = currentUser.hasPermission(Resources.HYP_QUALITY, PermissionLevels.READ_AND_LIST);

  const [isAvailable, setIsAvailable] = useState(false);

  const { isValidating: isLoading } = useSwrAxios<
    PaginatedList<PostharvestAuditSummary>,
    PostharvestAuditSummaryRequest
  >(
    {
      url: SEARCH_POSTHARVEST_AUDIT_SUMMARY,
      method: 'POST',
      data: {
        limit: 1,
        offset: 0,
        lot: lot.lotName,
        sku: sku.name,
        site: siteName,
        farm: farmName,
      },
    },
    {
      onSuccess: res => {
        if (res.data?.data?.length > 0 && !isAvailable) {
          setIsAvailable(true);
        }
      },
    }
  );

  const postharvestUrlWithLotAndSku = `${postharvestBasePath}${toQueryParams({
    lot: `filterType-text-*type-contains-*filter-${lot.lotName}`,
    sku: `filterType-text-*type-contains-*filter-${sku.name}`,
  })}`;

  return isLoading ? (
    <span data-testid={dataTestIds.loading}>
      <CircularProgress size={12} /> Loading...
    </span>
  ) : (
    <Show when={isAllowed && isAvailable}>
      <PlentyLink to={postharvestUrlWithLotAndSku} openInNewTab data-testid={dataTestIds.root}>
        Open Postharvest
      </PlentyLink>
    </Show>
  );
};

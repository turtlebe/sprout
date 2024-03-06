import { Typography } from '@plentyag/brand-ui/src/material-ui/core';
import useCoreStore from '@plentyag/core/src/core-store';
import { getKindFromPath } from '@plentyag/core/src/farm-def/utils';
import { useGetUser } from '@plentyag/core/src/hooks';
import { DateTimeFormat } from '@plentyag/core/src/utils';
import { DateTime } from 'luxon';
import React from 'react';

const dataTestIds = {
  root: 'submitter-text-helper-root',
};

export { dataTestIds as dataTestIdsSubmitterTextHelper };

interface SubmitterTextHelper {
  createdAt?: string;
  username?: string;
}

export const SubmitterTextHelper: React.FC<SubmitterTextHelper> = ({ createdAt, username }) => {
  const [coreState] = useCoreStore();
  const { data } = useGetUser({ username });

  if (createdAt && data) {
    return (
      <Typography data-testid={dataTestIds.root} color="textSecondary" variant="subtitle2">
        Submitted by {data.firstName} {data.lastName} on {DateTime.fromISO(createdAt).toFormat(DateTimeFormat.DEFAULT)}
      </Typography>
    );
  }

  const { firstName, lastName, currentFarmDefPath } = coreState.currentUser;

  const siteName = getKindFromPath(currentFarmDefPath, 'sites');
  const farmName = getKindFromPath(currentFarmDefPath, 'farms');
  const siteFarmName = `${siteName}/${farmName}`;

  return (
    <Typography data-testid={dataTestIds.root} color="textSecondary" variant="subtitle2">
      Submitting as {firstName} {lastName} in {siteFarmName}
    </Typography>
  );
};

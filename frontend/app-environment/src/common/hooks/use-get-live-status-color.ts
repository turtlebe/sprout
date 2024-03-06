import { useTheme } from '@plentyag/brand-ui/src/material-ui/core';
import { LiveStatus } from '@plentyag/core/src/types/environment';

export const useGetLiveStatusColor = (status: LiveStatus): string => {
  const theme = useTheme();

  return {
    [LiveStatus.inRange]: theme.palette.success.main,
    [LiveStatus.outOfRange]: theme.palette.error.main,
    [LiveStatus.noData]: theme.palette.grey[500],
  }[status];
};

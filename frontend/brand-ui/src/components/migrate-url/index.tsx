import { useGlobalSnackbar } from '@plentyag/brand-ui/src/components';
import React, { useEffect } from 'react';
import { Redirect, useHistory } from 'react-router-dom';

export interface MigratingUrl {
  to: string;
  withoutQueryParams?: boolean;
}

/**
 * This component is to be used only for old URLs that are to be forwarded to the new URLs
 * @param {MigratingUrl}
 */
export const MigrateUrl: React.FC<MigratingUrl> = ({ to, withoutQueryParams = false }) => {
  const snackbar = useGlobalSnackbar();
  const history = useHistory();

  const existingQueryParams = history.location.search;

  const oldUrl = window.location.href.toString();
  const newUrl = withoutQueryParams ? to : `${to}${existingQueryParams}`;

  useEffect(() => {
    snackbar.warningSnackbar(
      `You have been automatically forwarded to the new URL from the old deprecated URL "${oldUrl}". Please note to update any of your stored permalinks to this new URL.`
    );
  }, []);

  return <Redirect to={newUrl} />;
};

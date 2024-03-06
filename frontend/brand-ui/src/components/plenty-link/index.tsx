import { OpenInNew } from '@material-ui/icons';
import { Box, Link } from '@plentyag/brand-ui/src/material-ui/core';
import { isIgnition } from '@plentyag/core/src/utils/is-ignition';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { Show } from '..';

const dataTestIds = {
  root: 'plenty-link-root',
  newTabIcon: 'plenty-link-new-tab-icon',
};

export { dataTestIds as dataTestIdsPlentyLink };

export interface PlentyLink {
  to: string;
  isReactRouterLink?: boolean;
  'data-testid'?: string;
  openInNewTab?: boolean;
  download?: string;
}

/**
 * This component implements a hyperlink component that can be used either as react-router
 * hyperlink (isReactRouterLink = true [default]) or a regular url hyperlink (isReactRouteLink = false).
 * For the react-router case, the "to" parameter is path to react-router page (ex: /production)
 * For the regular hyperlink case, the "to" is url (ex: https://www.google.com).
 *
 * if "openInNewTab" is true then the page will open in a new browser tab. If the app is
 * being run in the context of ignition then the new tab will always open in the same window.
 */
export const PlentyLink: React.FC<PlentyLink> = ({
  to,
  isReactRouterLink = true,
  'data-testid': dataTestId,
  openInNewTab,
  download,
  children,
}) => {
  const shouldOpenInNewTab = openInNewTab && !isIgnition();

  return (
    <Link
      data-testid={dataTestId || dataTestIds.root}
      component={isReactRouterLink ? RouterLink : undefined}
      to={isReactRouterLink ? to : undefined}
      href={isReactRouterLink ? undefined : to}
      target={shouldOpenInNewTab ? '_blank' : undefined}
      download={!isReactRouterLink && download ? download : undefined}
      rel="noopener"
    >
      {/* show icon at end when link opens in a new tab */}
      <Show when={shouldOpenInNewTab} fallback={<>{children}</>}>
        <Box component="span" display="flex" alignItems="center">
          {children}
          <Box component="span" m={0.1} />
          <OpenInNew data-testid={dataTestIds.newTabIcon} fontSize="inherit" />
        </Box>
      </Show>
    </Link>
  );
};

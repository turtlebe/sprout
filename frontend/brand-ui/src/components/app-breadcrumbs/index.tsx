import { Breadcrumbs, Link, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';
import { NavLink } from 'react-router-dom';

import { StyleProps, useStyles } from './styles';

const dataTestIds = {
  currentBreadcrumb: 'app-current-page',
};

export { dataTestIds as dataTestIdsAppBreadcrumbs };

export interface AppBreadcrumbs extends StyleProps {
  homePageRoute: string;
  homePageName: string;
  pageName?: string;
}

export const AppBreadcrumbs: React.FC<AppBreadcrumbs> = ({ homePageRoute, homePageName, pageName, marginLeft }) => {
  const classes = useStyles({ marginLeft });

  return (
    <Breadcrumbs aria-label="breadcrumb" classes={{ root: classes.root }}>
      {pageName && homePageRoute ? (
        [
          <Link key={'app-home'} component={NavLink} to={homePageRoute}>
            {homePageName}
          </Link>,
          <Typography key={`app-${pageName}`} data-testid={dataTestIds.currentBreadcrumb}>
            {pageName}
          </Typography>,
        ]
      ) : (
        <Typography variant="h5" data-testid={dataTestIds.currentBreadcrumb}>
          {homePageName}
        </Typography>
      )}
    </Breadcrumbs>
  );
};

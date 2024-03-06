import { Link, makeStyles } from '@material-ui/core';
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import { AppBarContext } from '../app-bar/context';

export const dataTestIds = {
  root: 'link-farmos-module',
};

interface StyleProps {
  className?: string;
}

const useStyles = makeStyles(theme => ({
  root: {
    textDecoration: 'none',
    textTransform: 'none',
    fontSize: '1rem',
    color: 'inherit',
    padding: '0.5rem',
    '&:hover': {
      color: (props: StyleProps) => (props.className ? 'inherit' : theme.palette.common.white),
      textDecoration: 'none',
    },
  },
  activeClassName: {
    color: theme.palette.common.white,
  },
}));

interface LinkFarmOsModule {
  farmOsModule: FarmOsModule;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  children?: React.ReactNode;
  activeClassName?: string;
  className?: string;
}

/**
 * Sub-component used by <AppBar /> to render a Link of a FarmOs Module.
 *
 * @param props FarmOsModuleProps
 */
export const LinkFarmOsModule = React.forwardRef<any, LinkFarmOsModule>((props, ref) => {
  const { children, farmOsModule, onClick, activeClassName: pActiveClassName, className, ...otherProps } = props;
  const classes = useStyles({ className });
  const context = React.useContext(AppBarContext);
  const reactRouterLocation = useLocation();
  const { reactAppHostName, hostCurrentLocation } = context;
  const pathname = hostCurrentLocation ? hostCurrentLocation : reactRouterLocation.pathname;
  const regex = new RegExp(`^${farmOsModule.url}$|^${farmOsModule.url}(/.+)$`);
  const isActive = regex.test(pathname);
  const activeClassName = pActiveClassName ?? classes.activeClassName;

  // if it's a react app rendered by the host application -> use react-router to navigate
  const isInternalLink = farmOsModule.backend === reactAppHostName && farmOsModule.react;

  if (isInternalLink) {
    return (
      <Link
        ref={ref}
        aria-label={farmOsModule.label}
        component={NavLink}
        to={farmOsModule.url}
        onClick={onClick}
        className={`${classes.root} ${isActive && activeClassName} ${className}`}
        data-testid={dataTestIds.root}
        activeClassName={activeClassName}
        {...otherProps}
      >
        {children ? children : farmOsModule.label}
      </Link>
    );
  }

  return (
    <Link
      ref={ref}
      aria-label={farmOsModule.label}
      href={farmOsModule.url}
      onClick={onClick}
      data-testid={dataTestIds.root}
      className={`${classes.root} ${isActive && activeClassName} ${className}`}
      {...otherProps}
    >
      {children ? children : farmOsModule.label}
    </Link>
  );
});

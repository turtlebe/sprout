import { makeStyles, AppBar as MuiAppBar, Toolbar } from '@material-ui/core';
import { isEmpty, map } from 'lodash';
import React from 'react';

import { ButtonHome } from '../button-home';
import { ButtonMenuFarmOsModule } from '../button-menu-farmos-module';
import { ButtonMenuProfile } from '../button-menu-profile';
import { ButtonMenuWithDrawer } from '../button-menu-with-drawer';
import { EnvironmentBadge } from '../environment-badge';
import { LinkFarmOsModule } from '../link-farmos-module';

import { AppBarContext } from './context';
import { useMemoFarmOsModules } from './hooks/use-memo-farmos-modules';
import { useOverflowElement } from './hooks/use-overflow-element';

export const dataTestIds = {
  toolbar: 'app-bar--toolbar',
  farmosModuleContainer: 'app-bar-farmos-module-container',
};

interface StyleProps {
  isOverflowing: boolean;
}

const useStyles = makeStyles({
  root: {
    backgroundColor: '#4f3674',
    flex: '0 0 auto',
    minWidth: 0,
    justifyContent: 'center',
  },
  toolbar: {
    padding: '8px 16px',
    color: 'rgba(255, 255, 255, 0.5)',
    '-webkit-font-smoothing': 'subpixel-antialiased',
  },
  farmosModuleContainer: {
    display: 'flex',
    alignItems: 'center',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    visibility: (props: StyleProps) => (props.isOverflowing ? 'hidden' : 'visible'),
  },
  link: {
    flex: '1 0 auto',
  },
  button: {
    flex: '1 0 auto',
  },
});

const Spacer: React.FC = () => <div style={{ flexGrow: 1 }}></div>;

interface AppBar {
  /**
   * List of keys to enable links. Values correspond to the FarmOsModule `resource` attribute. (See farmos-modules.ts)
   */
  farmOsModules: string[];

  /**
   * will be true if the current user is a developer - used to show the badge displaying current env.
   */
  isDeveloper?: boolean;

  /**
   * The name of the host application lowercased
   */
  reactAppHostName?: 'sprout' | 'hypocotyl';

  /**
   * Allow to override the router window.location to set active links.
   *
   * This is used by Hypocotyl given that its router is a little clunky over there.
   */
  hostCurrentLocation?: string;
}

/**
 * Main Navbar application
 */
export const AppBar: React.FC<AppBar> = ({
  farmOsModules: farmOsModuleNames,
  isDeveloper = false,
  hostCurrentLocation,
  reactAppHostName,
}) => {
  // hooks
  const { groupedFarmOsModules, sortedFarmOsModules, sortedFarmOsModuleKeys } = useMemoFarmOsModules(farmOsModuleNames);

  const ref = React.useRef<HTMLDivElement>(null);
  const [element, setElement] = React.useState<HTMLDivElement>();
  const { isOverflowing } = useOverflowElement<HTMLDivElement>(element);
  React.useLayoutEffect(() => {
    if (ref.current) {
      setElement(ref.current);
    }
  });

  const classes = useStyles({ isOverflowing });

  if (isEmpty(farmOsModuleNames)) {
    return (
      <MuiAppBar position="static" className={classes.root}>
        <Toolbar className={classes.toolbar} data-testid={dataTestIds.toolbar} />
      </MuiAppBar>
    );
  }

  return (
    <AppBarContext.Provider value={{ reactAppHostName, hostCurrentLocation }}>
      <MuiAppBar position="static" className={classes.root}>
        <Toolbar className={classes.toolbar} data-testid={dataTestIds.toolbar}>
          <ButtonHome />
          <div data-testid={dataTestIds.farmosModuleContainer} ref={ref} className={classes.farmosModuleContainer}>
            {map(sortedFarmOsModuleKeys, farmOsModuleKey =>
              groupedFarmOsModules[farmOsModuleKey].length > 1 ? (
                <ButtonMenuFarmOsModule
                  className={classes.button}
                  key={farmOsModuleKey}
                  farmOsModules={groupedFarmOsModules[farmOsModuleKey]}
                  groupName={farmOsModuleKey}
                />
              ) : (
                <LinkFarmOsModule
                  className={classes.link}
                  key={farmOsModuleKey}
                  farmOsModule={groupedFarmOsModules[farmOsModuleKey][0]}
                />
              )
            )}
          </div>
          <Spacer />
          {isOverflowing && <ButtonMenuWithDrawer farmOsModules={sortedFarmOsModules} />}
          <EnvironmentBadge isDeveloper={isDeveloper} />
          <ButtonMenuProfile />
        </Toolbar>
      </MuiAppBar>
    </AppBarContext.Provider>
  );
};

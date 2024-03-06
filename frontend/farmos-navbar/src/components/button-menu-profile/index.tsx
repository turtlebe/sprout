import { Button, makeStyles, Menu, MenuItem } from '@material-ui/core';
import { ArrowDropDown } from '@material-ui/icons';
import React, { MouseEvent, useState } from 'react';

import { useGetProfilePicUrl } from '../../hooks/use-get-profile-pic-url';

export const dataTestIds = {
  root: 'button-menu-profile-root',
  img: 'button-menu-profile-img',
  menu: 'button-menu-profile-menu',
  help: 'button-menu-profile-help',
  logout: 'button-menu-profile-logout',
};

const profileId = 'profile-menu';

const useStyles = makeStyles(() => ({
  root: {
    color: 'inherit',
  },
  img: {
    borderRadius: '50%',
    height: '30px',
  },
}));

/**
 * Sub-component used by <AppBar /> to render a generic profile Button on the right side.
 */
export const ButtonMenuProfile: React.FC = () => {
  // hooks
  const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null);
  const classes = useStyles({});

  const { profilePicUrl, isLoading } = useGetProfilePicUrl();

  // handlers
  const toggleProfile = (open: boolean) => (event: MouseEvent<HTMLButtonElement>) => {
    setProfileAnchor(open ? event.currentTarget : null);
  };
  const redirectTo = (url: string) => () => {
    window.location.replace(url); // exit react-app and redirect to url
  };

  if (isLoading) {
    return null;
  }

  return (
    <>
      <Button
        data-testid={dataTestIds.root}
        aria-controls={profileId}
        className={classes.root}
        aria-haspopup="true"
        onClick={toggleProfile(true)}
      >
        <img className={classes.img} src={profilePicUrl} alt="profile" data-testid={dataTestIds.img} />
        <ArrowDropDown color="inherit" />
      </Button>
      <Menu
        id={profileId}
        data-testid={dataTestIds.menu}
        open={Boolean(profileAnchor)}
        getContentAnchorEl={null}
        anchorEl={profileAnchor}
        onClose={toggleProfile(false)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: -8,
          horizontal: 'right',
        }}
        keepMounted
      >
        <MenuItem data-testid={dataTestIds.help} onClick={redirectTo('/help')}>
          Help
        </MenuItem>
        <MenuItem data-testid={dataTestIds.logout} onClick={redirectTo('/logout')}>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

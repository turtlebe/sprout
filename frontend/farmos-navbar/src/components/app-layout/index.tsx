import { styled } from '@material-ui/core';

import { AppBar } from '../app-bar';

export const AppContainer = styled('div')({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
});

export const AppHeader = styled(AppBar)({
  flex: '0 0 auto',
});

export const AppBody = styled('div')({
  height: '100%',
  flex: '1 1 auto',
  overflowY: 'hidden',
});

export default AppContainer;

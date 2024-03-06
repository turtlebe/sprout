// eslint-disable-next-line no-restricted-imports
import { createTheme, CssBaseline, makeStyles, MuiThemeProvider, Theme } from '@material-ui/core';
import React from 'react';

import { palette } from './options/palette';
import { typography } from './options/typography';

const useStyles = makeStyles({
  '@global': {
    'html, body, #root': {
      height: '100%',
      width: '100%',
      backgroundColor: '#f5f5f5',
    },
  },
});

const mainTheme: Theme = createTheme({
  palette,
  typography,
});

interface GlobalStyles {
  children: React.ReactNode;
}
/**
 * MuiThemeProvider @see https://material-ui.com/customization/themes/#muithemeprovider
 * CssBaseline @see https://material-ui.com/style/css-baseline/
 */
export const GlobalStyles = React.memo((props: GlobalStyles) => {
  useStyles({});

  return (
    <MuiThemeProvider theme={mainTheme}>
      <CssBaseline />

      {props.children}
    </MuiThemeProvider>
  );
});

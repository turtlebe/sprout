import { ThemeOptions } from '@material-ui/core/styles/createTheme';

/**
 * light & dark colors are generated
 * @see https://material-ui.com/customization/default-theme/ for default values
 */
export const palette: ThemeOptions['palette'] = {
  primary: {
    main: '#0275d8',
    light: '#5fa3ff',
    dark: '#004aa6',
    contrastText: '#fff',
  },
  secondary: {
    main: '#ffd57e',
    light: '#ffffaf',
    dark: '#caa44f',
    contrastText: '#000',
  },
  error: {
    main: '#d50032',
    light: '#ba506c',
    dark: '#54001b',
    contrastText: '#FFF2B5',
  },
  background: {
    paper: '#fff',
    default: '#fff',
  },
};

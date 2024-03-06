import { makeStyles, Theme } from '@material-ui/core/styles';

export interface DropDownStylesProps {
  minWidth?: number | string;
  marginLeft?: number | string;
  size?: 'x-small' | 'small';
}

export const useStyles = makeStyles<Theme, DropDownStylesProps>(theme => ({
  dropDown: {
    backgroundColor: theme.palette.background.paper,
    minWidth: props => props.minWidth,
    marginLeft: props => props.marginLeft,
  },
  select: props =>
    props.size === 'x-small'
      ? {
          fontSize: '0.85em',
          paddingTop: '4px',
          paddingBottom: '4px',
        }
      : {},
}));

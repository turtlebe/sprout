import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

import { Level } from './types';
interface StyleProps {
  level: Level;
}

export const useStyles = makeStyles(theme => {
  const ColorMap = {
    [Level.IDLE]: {
      background: theme.palette.grey[200],
      color: '#6E6E6E',
    },
    [Level.PENDING]: {
      background: '#ffe9bb',
      color: theme.palette.grey[800],
    },
    [Level.PROGRESSING]: {
      background: '#D1E3FF',
      color: theme.palette.primary.dark,
    },
    [Level.SUCCESS]: {
      background: '#BFEDBF',
      color: '#126E41',
    },
    [Level.FAILED]: {
      background: '#EFBDCC',
      color: '#9C072A',
    },
    [Level.PASSED]: {
      background: '#BFEDBF',
      color: '#126E41',
    },
  };

  return {
    root: {
      display: 'inline-block',
      borderRadius: 4,
      fontWeight: 600,
      textTransform: 'uppercase',
      font: theme.typography.body2.font,
      padding: '0 6px',
      background: (props: StyleProps) => (props.level && ColorMap[Level[props.level]].background) ?? 'inherit',
      color: (props: StyleProps) => (props.level && ColorMap[Level[props.level]].color) ?? 'inherit',
    },
  };
});

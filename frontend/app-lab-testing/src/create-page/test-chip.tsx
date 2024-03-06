import { Add, Clear } from '@material-ui/icons';
import { Chip, makeStyles } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

const useStyles = makeStyles({
  deletedLabel: {
    textDecoration: 'line-through',
  },
  chip: {
    margin: '2px',
  },
});

export const TestChip: React.FC<{
  label: string;
  selected: boolean;
  onToggle: () => void;
  disabled: boolean;
}> = React.memo(props => {
  const classes = useStyles({});
  const labelComp = props.selected ? props.label : <span className={classes.deletedLabel}>{props.label}</span>;
  return (
    <Chip
      size="small"
      className={classes.chip}
      variant="outlined"
      label={labelComp}
      deleteIcon={props.selected ? <Clear /> : <Add />}
      onClick={props.onToggle}
      onDelete={props.onToggle}
      disabled={props.disabled}
    />
  );
});

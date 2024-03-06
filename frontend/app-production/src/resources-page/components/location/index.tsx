import { makeStyles, Typography, TypographyProps } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { useGetFarmDefObject } from '../../hooks/use-get-farm-def-object';

import { getLocation } from './get-location';

const useStyles = makeStyles(() => ({
  location: {
    lineBreak: 'anywhere',
  },
}));

export const dataTestIds = {
  location: 'location',
};

interface Location {
  location: ProdResources.Location;
  variant?: TypographyProps['variant'];
}

export const Location: React.FC<Location> = props => {
  const classes = useStyles();
  const { data: farmDefMachine } = useGetFarmDefObject(props.location?.machine?.farmdefMachineId);

  return (
    <Typography component="p" variant={props.variant} data-testid={dataTestIds.location} className={classes.location}>
      {getLocation(farmDefMachine, props.location)}
    </Typography>
  );
};

import {
  CardContent,
  CardHeader,
  CardProps,
  CircularProgress,
  Grid,
  Card as MuiCard,
  Typography,
} from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

const dataTestIds = {
  cardHeader: 'resource-card-header',
  cardContent: 'resource-card-content',
  loader: 'resource-card-content-loader-in-content',
};

export { dataTestIds as dataTestIdsCard };

import { useStyles } from './styles';

export interface Card {
  title: React.ReactNode;
  titleVariant?: TypographyProps['variant'];
  // adds effect to card so stands-out a bit more - since in some cases we are showing cards within a card.
  raised?: CardProps['raised'];
  isLoading: boolean;
  fallback?: React.ReactNode;
  'data-testid'?: string;
  'data-testid-loader'?: string;
  doNotPadContent?: boolean;
  action?: JSX.Element;
  classes?: { card?: string; grid?: string };
}

export const Card: React.FC<Card> = ({
  title,
  titleVariant,
  raised,
  isLoading,
  fallback = <Typography>{title} is not present</Typography>,
  children,
  'data-testid': dataTestId,
  'data-testid-loader': dataTestIdLoader = dataTestIds.loader,
  doNotPadContent,
  classes: classesProp,
  action,
}) => {
  const classes = useStyles({ doNotPadContent });

  return (
    <Grid item className={classesProp?.grid || classes.grid} data-testid={dataTestId}>
      <MuiCard className={classesProp?.card} raised={raised}>
        <CardHeader
          data-testid={dataTestIds.cardHeader}
          title={
            <>
              <Typography variant={titleVariant} component="span">
                {title}
              </Typography>
              {isLoading && <CircularProgress className={classes.loader} size="1rem" data-testid={dataTestIdLoader} />}
            </>
          }
          classes={{ root: classes.cardHeader }}
          action={action}
        />
        {children ? (
          <CardContent data-testid={dataTestIds.cardContent} classes={{ root: classes.cardContent }}>
            {children}
          </CardContent>
        ) : (
          // we don't want to apply classes.cardContent (which handle doNotPadContent) when we
          // there is no children.
          // That way the fallback remains padded no matter what the `doNotPadContent` prop value is.
          <CardContent data-testid={dataTestIds.cardContent}>{!isLoading && fallback}</CardContent>
        )}
      </MuiCard>
    </Grid>
  );
};

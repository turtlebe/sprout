import { ResourceLink } from '@plentyag/app-production/src/common/components';
import { ObjectTreeView } from '@plentyag/brand-ui/src/components';
import { Card } from '@plentyag/brand-ui/src/components/card';
import { CardItem } from '@plentyag/brand-ui/src/components/card-item';
import { Grid, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { SearchActions, SearchState, useSearch } from '../../hooks/use-search';
import { FamilyResouresCard } from '../family-resources-card';

import { useStyles } from './styles';

export const dataTestIds = {
  resourceInfo: 'resource-info',
  quantity: 'resource-info-material-quantity',
  units: 'resource-info-material-units',
  additionalStatus: 'resource-info-additional-status',
  additionalAttributes: 'resource-info-additional-attributes',
  containerSerialLink: 'resource-info-container-serial-link',
};

export const ResourceInfo: React.FC = React.memo(() => {
  const classes = useStyles();
  const searchResult = useSearch<SearchState['searchResult'], SearchActions>(state => state.searchResult)[0];

  if (!searchResult) {
    return null;
  }

  return (
    <Grid data-testid={dataTestIds.resourceInfo} container spacing={4}>
      <Card title="Container" isLoading={!searchResult} classes={{ grid: classes.grid }}>
        {searchResult.containerObj && (
          <>
            <CardItem name="Type">
              <Typography>{searchResult.containerObj.containerType}</Typography>
            </CardItem>
            <CardItem name="Created">
              <Typography>{new Date(searchResult.containerObj.createdAt).toLocaleString()}</Typography>
            </CardItem>
            <CardItem name="ID">
              <Typography>{searchResult.containerId}</Typography>
            </CardItem>
            <CardItem name="Serial">
              <ResourceLink
                data-testid={dataTestIds.containerSerialLink}
                resourceId={searchResult.containerObj.serial}
                openInNewTab={false}
                resourceName={<Typography>{searchResult.containerObj.serial}</Typography>}
              />
            </CardItem>
            <CardItem name="Status">
              <Typography>{searchResult.containerStatus}</Typography>
            </CardItem>
            {searchResult.containerObj.containerType?.toUpperCase() === 'TOWER' && (
              <CardItem name="Tower Cycles">
                <Typography>{searchResult.towerCycles}</Typography>
              </CardItem>
            )}
            {Object.keys(searchResult?.containerAttributes || {}).length > 0 && (
              <CardItem data-testid={dataTestIds.additionalStatus} name="Additional Status">
                <ObjectTreeView object={searchResult.containerAttributes} />
              </CardItem>
            )}
            {Object.keys(searchResult.containerObj.properties).length > 0 && (
              <CardItem name="Properties">
                <ObjectTreeView object={searchResult.containerObj.properties} />
              </CardItem>
            )}
          </>
        )}
      </Card>
      <Card title="Material" isLoading={!searchResult} classes={{ grid: classes.grid }}>
        {(searchResult.materialObj && (
          <>
            <CardItem name="Type">
              <Typography>{searchResult.materialObj?.materialType}</Typography>
            </CardItem>
            <CardItem name="ID">
              <Typography>{searchResult.materialId}</Typography>
            </CardItem>
            <CardItem name="Lot Name">
              <Typography>{searchResult.materialObj?.lotName}</Typography>
            </CardItem>
            <CardItem name="Product">
              <Typography>{searchResult.materialObj?.product}</Typography>
            </CardItem>
            <CardItem name="Status">
              <Typography>{searchResult.materialStatus}</Typography>
            </CardItem>
            <CardItem name="Quantity" data-testid={dataTestIds.quantity}>
              <Typography>{searchResult.quantity}</Typography>
            </CardItem>
            <CardItem name="Units" data-testid={dataTestIds.units}>
              <Typography>{searchResult.units}</Typography>
            </CardItem>
            {Object.keys(searchResult?.materialAttributes || {}).length > 0 && (
              <CardItem data-testid={dataTestIds.additionalAttributes} name="Additional Attributes">
                <ObjectTreeView object={searchResult.materialAttributes} formatValue />
              </CardItem>
            )}
            {Object.keys(searchResult.materialObj.properties).length > 0 && (
              <CardItem name="Properties">
                <ObjectTreeView object={searchResult.materialObj.properties} />
              </CardItem>
            )}
          </>
        )) ||
          (Object.keys(searchResult?.materialAttributes || {}).length > 0 && (
            <>
              <CardItem data-testid={dataTestIds.additionalAttributes} name="Additional Attributes">
                <ObjectTreeView object={searchResult.materialAttributes} formatValue />
              </CardItem>
            </>
          ))}
      </Card>
      <FamilyResouresCard />
    </Grid>
  );
});

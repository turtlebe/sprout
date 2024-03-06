import { AppHeader, AppLayout, Show, TabPanel } from '@plentyag/brand-ui/src/components';
import { Box, Grid, Tab, Tabs, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { useLogAxiosErrorInSnackbar, useSwrAxios } from '@plentyag/core/src/hooks';
import React from 'react';
import { RouteComponentProps, useHistory } from 'react-router-dom';

import { CropsSkusBreadcrumbs, EditSkuButton, FarmsUsingCropSku } from '../common/components';
import { useSearchSkuTypes } from '../common/hooks';
import { SkuWithFarmInfo } from '../common/types/sku-with-farm-info';
import { ROUTES } from '../constants';

import { AssociatedCropsSkus, SkuBasics } from './components';
import { useStyles } from './styles';

const dataTestIds = {
  infoTab: 'sku-page-info-tab-panel',
  noSkuFoundError: 'sku-page-no-sku-found-error',
};

export { dataTestIds as dataTestIdsSkuPage };

interface SkuPageUrlParams {
  skuName: string;
}

export const SkuPage: React.FC<RouteComponentProps<SkuPageUrlParams>> = props => {
  const { skuName } = props.match.params;

  const history = useHistory();

  const [currentTab, setCurrentTab] = React.useState('information');

  const classes = useStyles();

  const {
    isValidating,
    data: skus,
    error: skuError,
    revalidate,
  } = useSwrAxios<SkuWithFarmInfo[]>({
    url: '/api/crops-skus/skus',
  });

  const sku = skus?.find(skuItem => skuItem.name === skuName);
  useLogAxiosErrorInSnackbar(skuError);

  const { skuTypes } = useSearchSkuTypes();

  function handleTabChange(event: React.ChangeEvent<{}>, value: any) {
    setCurrentTab(value);
  }

  async function handleEditSuccess(isUpdating: boolean, skuNameEdited: string) {
    await revalidate();
    if (skuNameEdited) {
      history.push(ROUTES.sku(skuNameEdited));
    }
  }

  return (
    <AppLayout isLoading={isValidating}>
      {!sku && !isValidating && (
        <Box m={3} data-testid={dataTestIds.noSkuFoundError}>
          <Typography variant="h6">No SKU found with name: {skuName}</Typography>
        </Box>
      )}
      {sku && (
        <AppHeader flexDirection="column" paddingBottom={0}>
          <CropsSkusBreadcrumbs homePageRoute={ROUTES.skus} homePageName={'SKUs'} pageName={skuName} />
          <Box py={2} display="flex" justifyContent="space-between" alignItems="self-start">
            <Box>
              <Typography variant="h5">{sku.displayName}</Typography>
              <Box mt={2} display="flex">
                <FarmsUsingCropSku hasFarm={sku.hasFarm} />
              </Box>
            </Box>

            <Box display="flex" justifyContent="space-between" alignItems="center">
              <EditSkuButton sku={sku} skus={skus} isUpdating onEditSuccess={handleEditSuccess} />
              <Box m={0.5} />
              <EditSkuButton sku={sku} skus={skus} isUpdating={false} onEditSuccess={handleEditSuccess} />
            </Box>
          </Box>
          <Tabs className={classes.tabsContainer} value={currentTab} onChange={handleTabChange}>
            <Tab value="information" wrapped={true} label="Information" />
          </Tabs>
        </AppHeader>
      )}

      <Box padding={2}>
        <TabPanel value={currentTab} index="information">
          <Show when={Boolean(sku && skuTypes)}>
            <Grid data-testid={dataTestIds.infoTab} container spacing={2}>
              <SkuBasics sku={sku} skuTypes={skuTypes} />
              <AssociatedCropsSkus sku={sku} skuTypes={skuTypes} />
            </Grid>
          </Show>
        </TabPanel>
      </Box>
    </AppLayout>
  );
};

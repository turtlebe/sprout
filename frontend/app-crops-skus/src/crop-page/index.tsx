import { AppHeader, AppLayout, TabPanel } from '@plentyag/brand-ui/src/components';
import { Box, Tab, Tabs, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { useLogAxiosErrorInSnackbar, useSwrAxios } from '@plentyag/core/src/hooks';
import React from 'react';
import { RouteComponentProps, useHistory } from 'react-router-dom';

import { CropsSkusBreadcrumbs, EditCropButton, FarmsUsingCropSku } from '../common/components';
import { CropWithFarmInfo } from '../common/types';
import { getActiveFarms, getGrowConfiguration } from '../common/utils';
import { ROUTES } from '../constants';

import { CropInformationPanel, RecipeInformationPanel } from './components';
import { useStyles } from './styles';

const dataTestIds = {
  growConfiguration: 'crop-page-grow-configuration',
  recipesTab: (farm: string) => `crop-page-recipes-tab-${farm}`,
  recipesTabPanel: (farm: string) => `crop-page-recipes-tab-panel-${farm}`,
};

export { dataTestIds as dataTestIdsCropPage };

interface CropPageUrlParams {
  cropName: string;
}

export const CropPage: React.FC<RouteComponentProps<CropPageUrlParams>> = props => {
  const { cropName } = props.match.params;

  const history = useHistory();

  const [currentTab, setCurrentTab] = React.useState('information');

  const classes = useStyles();

  const {
    isValidating,
    data: cropData,
    error: cropError,
    revalidate,
  } = useSwrAxios<CropWithFarmInfo[]>({
    url: '/api/crops-skus/crops',
  });

  const crop = cropData?.find(cropItem => cropItem.name === cropName);

  const error = cropError || (cropData && !crop && `No crop found with name: ${cropName}`);
  useLogAxiosErrorInSnackbar(error);

  function handleTabChange(event: React.ChangeEvent<{}>, value: any) {
    setCurrentTab(value);
  }

  async function handleEditSuccess(isUpdating: boolean, cropName: string) {
    await revalidate();
    if (!isUpdating && cropName) {
      history.push(ROUTES.crop(cropName));
    }
  }

  const growConfig = crop && getGrowConfiguration(crop);

  const activeFarms = getActiveFarms(crop?.hasFarm).map(farm => farm.toLowerCase());
  const recipesWithActiveFarm = Object.keys(crop?.properties?.recipes || {}).filter(farm =>
    activeFarms.includes(farm.toLowerCase())
  );
  const recipeTabPanels = React.useMemo(
    () =>
      recipesWithActiveFarm.map(farm => (
        <TabPanel
          key={`${farm}-recipe-tab-panel`}
          data-testid={dataTestIds.recipesTabPanel(farm)}
          value={currentTab}
          index={`${farm}-recipe`}
        >
          <RecipeInformationPanel recipes={crop.properties.recipes[farm]} />
        </TabPanel>
      )),
    [currentTab, crop]
  );

  const recipeTabs = React.useMemo(
    () =>
      recipesWithActiveFarm.map(farm => (
        <Tab
          key={`${farm}-recipe-tab`}
          data-testid={dataTestIds.recipesTab(farm)}
          value={`${farm}-recipe`}
          wrapped={true}
          label={`${farm} Recipes`}
        />
      )),
    [crop]
  );

  return (
    <AppLayout isLoading={isValidating}>
      {crop && (
        <AppHeader flexDirection="column" paddingBottom={0}>
          <CropsSkusBreadcrumbs homePageRoute={ROUTES.crops} homePageName={'Crops'} pageName={cropName} />
          <Box py={2} display="flex" justifyContent="space-between" alignItems="self-start">
            <Box>
              <Typography variant="h5">{crop.displayName}</Typography>

              <Box mt={2} display="flex">
                <FarmsUsingCropSku hasFarm={crop.hasFarm} />
              </Box>

              <Typography data-testid={dataTestIds.growConfiguration}>Grow Configuration: {growConfig}</Typography>
            </Box>

            <Box display="flex" justifyContent="space-between" alignItems="center">
              <EditCropButton crop={crop} crops={cropData} isUpdating onEditSuccess={handleEditSuccess} />
              <Box m={0.5} />
              <EditCropButton crop={crop} crops={cropData} isUpdating={false} onEditSuccess={handleEditSuccess} />
            </Box>
          </Box>
          <Tabs className={classes.tabsContainer} value={currentTab} onChange={handleTabChange}>
            <Tab value="information" wrapped={true} label="Information" />
            {recipeTabs}
          </Tabs>
        </AppHeader>
      )}

      <Box padding={2}>
        <TabPanel value={currentTab} index="information">
          <CropInformationPanel crop={crop} />
        </TabPanel>
        {recipeTabPanels}
      </Box>
    </AppLayout>
  );
};

import { RadioGroup } from '@plentyag/app-production/src/actions-modules/shared/components';
import { CapacityGauge } from '@plentyag/app-production/src/actions-modules/shared/components/capacity-gauge';
import { ActionModuleProps } from '@plentyag/app-production/src/actions-modules/types';
import { Box, CircularProgress } from '@plentyag/brand-ui/src/material-ui/core';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import React from 'react';
import v from 'voca';

const dataTestIds = getScopedDataTestIds({ loading: 'loading' }, 'RoutingMode');
export { dataTestIds as dataTestIdsRoutingMode };

export const PRE_HARVEST_INSPECTION_ROUTING_MODE = 'mode';
export const PRE_HARVEST_INSPECTION_ROUTING_MODE_LABEL = 'Pre-Harvest Inspection Routing Mode';

export const routeModePath = {
  ROUTE_TO_PRE_HARVEST_LANE_1: 'sites/LAX1/areas/VerticalGrow/lines/PreHarvest/machines/PreHarvestLane1',
  ROUTE_TO_PRE_HARVEST_LANE_2: 'sites/LAX1/areas/VerticalGrow/lines/PreHarvest/machines/PreHarvestLane2',
};

const nicifyOption = (string: string) => v(string).chain().lowerCase().capitalize().words().value().join(' ');

export const RoutingMode: React.FC<ActionModuleProps> = ({ formik, actionModel, isLoading }) => {
  if (isLoading) {
    return <CircularProgress data-testid={dataTestIds.loading} />;
  }

  const hasErrors = formik.submitCount > 0 && formik.errors[PRE_HARVEST_INSPECTION_ROUTING_MODE];

  return (
    <Box data-testid={dataTestIds.root} borderRadius="8px">
      <RadioGroup
        field={PRE_HARVEST_INSPECTION_ROUTING_MODE}
        formik={formik}
        actionModel={actionModel}
        formatChoiceLabel={choice => (
          <Box display="flex" justifyContent="space-between" width="496px">
            {nicifyOption(choice)}
            <CapacityGauge
              farmDefObjectPath={routeModePath[choice]}
              containerType="TOWER"
              propertyKey="indexablePositionCount"
              colorEnabled
            />
          </Box>
        )}
        isError={hasErrors}
      />
    </Box>
  );
};

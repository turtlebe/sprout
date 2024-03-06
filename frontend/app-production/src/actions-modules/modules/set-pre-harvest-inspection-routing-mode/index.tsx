import { ActionModuleProps, ActionRequestType } from '@plentyag/app-production/src/actions-modules/types';
import { Box, CircularProgress } from '@plentyag/brand-ui/src/material-ui/core';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import React from 'react';
import v from 'voca';

import { RadioGroup } from '../../shared/components/radio-group';

export const actionName = 'SetPreHarvestInspectionRoutingMode';
export const actionRequestType: ActionRequestType = 'Requests';

const dataTestIds = getScopedDataTestIds({ loading: 'loading' }, 'SetPreHarvestInspectionRoutingMode');
export { dataTestIds as dataTestIdsSetPreHarvestInspectionRoutingMode };

export const PRE_HARVEST_INSPECTION_ROUTING_MODE = 'mode';
export const PRE_HARVEST_INSPECTION_ROUTING_MODE_LABEL = 'Pre Harvest Inspection Routing Mode';

const nicifyOption = (string: string) => v(string).chain().lowerCase().capitalize().words().value().join(' ');

export const SetPreHarvestInspectionRoutingMode: React.FC<ActionModuleProps> = ({ formik, actionModel, isLoading }) => {
  if (isLoading) {
    return <CircularProgress data-testid={dataTestIds.loading} />;
  }

  const hasErrors = formik.submitCount > 0 && formik.errors[PRE_HARVEST_INSPECTION_ROUTING_MODE];

  return (
    <Box padding={2} data-testid={dataTestIds.root}>
      <RadioGroup
        field={PRE_HARVEST_INSPECTION_ROUTING_MODE}
        formik={formik}
        actionModel={actionModel}
        formatChoiceLabel={choice => <div>{nicifyOption(choice)} dumb</div>}
        isError={hasErrors}
      />
    </Box>
  );
};

import { DropDown } from '@plentyag/app-production/src/actions-modules/shared/components';
import {
  getDataModelFieldValue,
  getDataModelValue,
  getFieldTypeFromActionModel,
} from '@plentyag/app-production/src/actions-modules/shared/utils';
import { ActionModuleProps } from '@plentyag/app-production/src/actions-modules/types';
import { Box } from '@plentyag/brand-ui/src/material-ui/core';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import React, { useState } from 'react';

import {
  PAUSE_BUFFER_OUTFLOW_MODE_FIELD,
  PAUSE_BUFFER_PLAY_COUNT_GOAL,
  PauseBufferOutflowModeChoices,
} from '../../types';

import { Display } from './display';
import { MenuChoice } from './menu-choice';

const dataTestIds = getScopedDataTestIds({ dropDown: 'drop-down' }, 'PauseBufferDropDown');

export { dataTestIds as dataTestIdsPauseBufferDropDown };

export interface PauseBufferDropDown extends ActionModuleProps {
  currentCarrierCount?: number;
}

export const PauseBufferDropDown: React.FC<PauseBufferDropDown> = ({
  actionModel,
  formik,
  isLoading,
  currentCarrierCount,
}) => {
  const fieldType = getFieldTypeFromActionModel(actionModel, PAUSE_BUFFER_OUTFLOW_MODE_FIELD);
  const initialChoice = getDataModelValue(formik.initialValues, PAUSE_BUFFER_OUTFLOW_MODE_FIELD, fieldType);

  const goalFieldType = getFieldTypeFromActionModel(actionModel, PAUSE_BUFFER_PLAY_COUNT_GOAL);
  const goalCurrentChoice = parseInt(getDataModelValue(formik.values, PAUSE_BUFFER_PLAY_COUNT_GOAL, goalFieldType));
  const currentCarrierIndex = currentCarrierCount + 1;

  const [currentGoalCount, setCurrentGoalCount] = useState(goalCurrentChoice || 0);

  const handlePlayCountChange = e => {
    e.preventDefault();
    const newGoalCount = e.target.value;
    setCurrentGoalCount(newGoalCount);
  };

  const handlePlayCountBlur = e => {
    e.preventDefault();
    formik.setFieldValue(PAUSE_BUFFER_PLAY_COUNT_GOAL, getDataModelFieldValue(`${currentGoalCount}`, goalFieldType));
    formik.setFieldValue(
      PAUSE_BUFFER_OUTFLOW_MODE_FIELD,
      getDataModelFieldValue(PauseBufferOutflowModeChoices.PLAY_WITH_GOAL_COUNT, fieldType)
    );
  };

  if (isLoading) {
    return <>Loading...</>;
  }

  return (
    <Box data-testid={dataTestIds.root}>
      <DropDown
        data-testid={dataTestIds.dropDown}
        field={PAUSE_BUFFER_OUTFLOW_MODE_FIELD}
        formik={formik}
        actionModel={actionModel}
        minWidth={200}
        renderMenuChoice={choice => (
          <MenuChoice
            initialChoice={initialChoice}
            choice={choice}
            initialGoalCount={currentGoalCount}
            goalCount={goalCurrentChoice}
            onGoalCountChange={handlePlayCountChange}
            onGoalCountBlur={handlePlayCountBlur}
          />
        )}
        renderDisplay={choice => (
          <Display
            initialChoice={initialChoice}
            choice={choice}
            goalCount={goalCurrentChoice}
            currentCount={currentCarrierIndex}
          />
        )}
      />
    </Box>
  );
};

import { InfoOutlined } from '@material-ui/icons';
import { useUnitConversion } from '@plentyag/app-environment/src/common/hooks';
import { getActionAt, getActionDefinitions } from '@plentyag/app-environment/src/common/utils';
import { Show } from '@plentyag/brand-ui/src/components';
import { Tooltip, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { ScheduleDefinition } from '@plentyag/core/src/farm-def/types';
import { Schedule } from '@plentyag/core/src/types/environment';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import { uniq } from 'lodash';
import React from 'react';

import { useStyles } from './styles';

const dataTestIds = getScopedDataTestIds(
  {
    noActions: 'no-actions',
    invalidActionDefinitionKey: 'invalid-action-definition-key',
    conflict: 'conflict',
  },
  'liveActionValue'
);

export { dataTestIds as dataTestIdsLiveActionValue };

export interface LiveActionValue {
  schedule: Schedule;
  scheduleDefinition: ScheduleDefinition;
  actionDefinitionKey?: string;
  noActionDefinitionKeyWarning?: string;
  color?: string;
}

export const LiveActionValue: React.FC<LiveActionValue> = ({
  schedule,
  scheduleDefinition,
  actionDefinitionKey,
  noActionDefinitionKeyWarning,
  color,
}) => {
  const classes = useStyles({ color });
  const { getPreferredUnit } = useUnitConversion();
  const action = getActionAt(schedule, new Date());

  const actionDefinitions = getActionDefinitions(scheduleDefinition);

  const Help = ({ title, 'data-testid': dataTestId }) => (
    <Tooltip title={title}>
      <InfoOutlined data-testid={dataTestId} />
    </Tooltip>
  );

  const TooltipMultipleValues = ({ message = '', values = {}, children }) => (
    <Tooltip
      title={
        <>
          {Object.entries(values).map(([key, value]) => (
            <Typography key={key}>
              {key}: {value}
            </Typography>
          ))}
          {message}
        </>
      }
    >
      {children}
    </Tooltip>
  );

  if (!schedule || !scheduleDefinition) {
    return null;
  }

  if (!action) {
    return <Help title="This schedule does not have any actions" data-testid={dataTestIds.noActions} />;
  }

  if (action.valueType === 'SINGLE_VALUE') {
    return (
      <Typography data-testid={dataTestIds.root} className={classes.typography}>
        {action.value}&nbsp;
        {getPreferredUnit(actionDefinitions[0].actionDefinition.measurementType).symbol}
      </Typography>
    );
  }

  if (actionDefinitionKey) {
    const actionDefinition = actionDefinitions.find(({ key }) => actionDefinitionKey === key);

    return (
      <Show
        when={Boolean(actionDefinition)}
        fallback={
          <Help
            title="Invalid configuration, please edit the Widget's content and fix this Schedule."
            data-testid={dataTestIds.invalidActionDefinitionKey}
          />
        }
      >
        <TooltipMultipleValues values={action.values}>
          <Typography data-testid={dataTestIds.root} className={classes.typography}>
            {action.values[actionDefinitionKey]}&nbsp;
            {actionDefinition ? getPreferredUnit(actionDefinition.actionDefinition.measurementType).symbol : null}
          </Typography>
        </TooltipMultipleValues>
      </Show>
    );
  }

  const distinctValues = uniq(Object.values(action.values));

  return (
    <Show
      when={distinctValues.length === 1}
      fallback={
        <TooltipMultipleValues values={action.values} message={noActionDefinitionKeyWarning}>
          <InfoOutlined data-testid={dataTestIds.conflict} />
        </TooltipMultipleValues>
      }
    >
      <Typography data-testid={dataTestIds.root} className={classes.typography}>
        {distinctValues[0]}&nbsp;{getPreferredUnit(actionDefinitions[0].actionDefinition.measurementType).symbol}
      </Typography>
    </Show>
  );
};

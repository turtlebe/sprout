import { Warning } from '@material-ui/icons';
import { Box, Chip } from '@plentyag/brand-ui/src/material-ui/core';
import { AlertRule, Schedule } from '@plentyag/core/src/types/environment';
import { isAlertRule } from '@plentyag/core/src/types/environment/type-guards';
import moment from 'moment';
import React from 'react';

const dataTestIds = {
  ended: 'inactive-chip-ended',
  inactive: 'inactive-chip-inactive',
};

export { dataTestIds as dataTestIdsInactiveChip };

export interface InactiveChip {
  alertRuleOrSchedule: Schedule | AlertRule;
  padding?: number;
}

/**
 * Chip that renders and indicate that the schedule is inactive (when the activatesAt is in the future) or has ended.
 */
export const InactiveChip: React.FC<InactiveChip> = ({ alertRuleOrSchedule, padding }) => {
  if (!alertRuleOrSchedule) {
    return null;
  }

  const { endsAt } = alertRuleOrSchedule;
  const type = isAlertRule(alertRuleOrSchedule) ? 'Alert Rule' : 'Schedule';

  if (!isAlertRule(alertRuleOrSchedule)) {
    const { activatesAt } = alertRuleOrSchedule;
    const activatesInTheFuture = new Date() < new Date(activatesAt);

    if (activatesInTheFuture) {
      return (
        <Box padding={padding}>
          <Chip
            data-testid={dataTestIds.inactive}
            icon={<Warning />}
            label={`${type} is inactive until ${moment(activatesAt).format('LLL')}`}
            color="secondary"
            style={{ paddingLeft: '0.5rem', paddingRight: '0.5rem' }}
          />
        </Box>
      );
    }
  }

  if (!endsAt) {
    return null;
  }

  const hasEnded = new Date() > new Date(endsAt);

  return (
    <Box padding={padding}>
      <Chip
        data-testid={dataTestIds.ended}
        icon={<Warning />}
        label={`${type} ${hasEnded ? 'ended' : 'ends'} on ${moment(endsAt).format('LLL')}`}
        color="secondary"
        style={{ paddingLeft: '0.5rem', paddingRight: '0.5rem' }}
      />
    </Box>
  );
};

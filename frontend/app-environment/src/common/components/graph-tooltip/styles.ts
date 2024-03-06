import { getColorForAlertRuleType } from '@plentyag/app-environment/src/common/utils';
import { COLORS } from '@plentyag/app-environment/src/common/utils/constants';
import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';
import { AlertRuleType } from '@plentyag/core/src/types/environment';

export const useStyles = makeStyles(theme => ({
  time: {
    fontWeight: theme.typography.fontWeightBold,
  },
  alertRule: {
    fontWeight: theme.typography.fontWeightBold,
    '&.SPEC_LIMIT': {
      color: getColorForAlertRuleType(AlertRuleType.specLimit),
    },
    '&.SPEC_LIMIT_DEVICES': {
      color: getColorForAlertRuleType(AlertRuleType.specLimitDevices),
    },
    '&.CONTROL_LIMIT': {
      color: getColorForAlertRuleType(AlertRuleType.controlLimit),
    },
  },
  observation: {
    fontWeight: theme.typography.fontWeightBold,
    color: COLORS.data,
  },
  schedule: {
    fontWeight: theme.typography.fontWeightBold,
    color: COLORS.schedule,
  },
  gridActionDefinitions: {
    display: 'grid',
    gridGap: '4px',
    gridTemplateColumns: 'repeat(6, fit-content(100%))',
  },
}));

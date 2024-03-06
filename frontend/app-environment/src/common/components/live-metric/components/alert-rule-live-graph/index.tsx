import { useGetLiveStatusColor } from '@plentyag/app-environment/src/common/hooks';
import {
  formatNumericalValue,
  getAlertRuleTypeLabel,
  getNumericalRuleDetails,
  getRuleAt,
  isRuleOneSided,
} from '@plentyag/app-environment/src/common/utils';
import { COLORS } from '@plentyag/app-environment/src/common/utils/constants';
import { Box, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { AlertRuleWithLiveStatus } from '@plentyag/core/src/types/environment';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import React from 'react';

import { useAlertLiveViewGraphApi, useAlertRuleLiveScale } from './hooks';

const dataTestIds = getScopedDataTestIds({ graph: 'graph', label: 'label' }, 'AlertRuleLiveGraph');

export { dataTestIds as dataTestIdsAlertRuleLiveGraph };

export interface AlertRuleLiveGraph {
  unitSymbol: string;
  alertRule: AlertRuleWithLiveStatus;
  endDateTime: Date;
  observationValue: number;
}

export const AlertRuleLiveGraph: React.FC<AlertRuleLiveGraph> = ({
  unitSymbol,
  alertRule,
  endDateTime,
  observationValue,
}) => {
  const ref = React.useRef<SVGSVGElement>(null);
  const scale = useAlertRuleLiveScale({
    alertRule,
    at: endDateTime,
    observationValue,
  });
  const chartApi = useAlertLiveViewGraphApi({ ref, scale });
  const color = useGetLiveStatusColor(alertRule.status);
  const rule = React.useMemo(() => getRuleAt(alertRule, endDateTime), [alertRule, endDateTime]);

  React.useEffect(() => {
    if (observationValue) {
      chartApi.clear();
      chartApi.renderAlertRuleLive({
        alertRule,
        at: endDateTime,
        unitSymbol,
        color,
        observationValue,
      });
    }
  }, [observationValue]);

  if (rule && isRuleOneSided(rule)) {
    return (
      <Box data-testid={dataTestIds.label} style={{ color }} paddingTop={2}>
        {getNumericalRuleDetails(rule, unitSymbol, formatNumericalValue(observationValue, unitSymbol).toString())}
      </Box>
    );
  }

  return (
    <Box data-testid={dataTestIds.graph}>
      <Box style={{ width: scale.width, height: scale.height }}>
        <svg ref={ref} viewBox={`0 0 ${scale.width} ${scale.height}`} />
      </Box>
      <Typography style={{ color: COLORS.liveMetricRange, textAlign: 'center', fontSize: '12px' }}>
        {getAlertRuleTypeLabel(alertRule.alertRuleType)}
      </Typography>
    </Box>
  );
};

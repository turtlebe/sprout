import { Check } from '@material-ui/icons';
import { LinkMetric, TabLabelAlertRule, TableAlertRuleReadOnly } from '@plentyag/app-environment/src/common/components';
import { useUnitConversion } from '@plentyag/app-environment/src/common/hooks';
import { getColorGenerator } from '@plentyag/app-environment/src/common/utils';
import { Card, TabPanel } from '@plentyag/brand-ui/src/components';
import { Box, Button, Divider, Grid, Radio, Tab, Tabs, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { AlertRule, Metric } from '@plentyag/core/src/types/environment';
import React from 'react';

const dataTestIds = {
  metricRadio: (metric: Metric) => `bulk-apply-choose-metric-radio-${metric.id}`,
  selectedMetricMinMax: 'bulk-apply-choose-selected-metric-min-max',
  selectedMetricAlertRuleTab: (alertRule: AlertRule) =>
    `bulk-apply-choose-selected-metric-alert-rule-tab-${alertRule.id}`,
  selectedMetricAlertRuleTabPanel: (alertRule: AlertRule) =>
    `bulk-apply-choose-selected-metric-alert-rule-tab-panel-${alertRule.id}`,
  bulkApply: 'bulk-apply-choose-apply',
};

export { dataTestIds as dataTestIdsBulkApplyChoose };

export interface BulkApplyChoose {
  metrics: Metric[];
  onBulkApply: (templateMetric: Metric) => void;
  isBulkApplying: boolean;
}

/**
 * First step of the BulkApply Workflow.
 *
 * The user must choose one Metric, the selected Metric's configuration (min/max + AlertRules) is displayed
 * on the right as a preview.
 *
 * On submit, we hit the EVS endpoint to bulkApply metrics from one to others.
 *
 * On success, we will show <BulkApplyComplete/>.
 */
export const BulkApplyChoose: React.FC<BulkApplyChoose> = ({ metrics = [], onBulkApply, isBulkApplying }) => {
  const [selectedMetric, setSelectedMetric] = React.useState<Metric>();
  const [currentTab, setCurrentTab] = React.useState<string>(null);
  const { convertToPreferredUnit, getPreferredUnit } = useUnitConversion();

  const color = getColorGenerator();

  /** Select the Metric and show its information as a preview. */
  const handleSelectMetric = (metric: Metric) => {
    setSelectedMetric(metric);
    setCurrentTab(metric.alertRules[0]?.id);
  };

  return (
    <Box padding={2}>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Card title="Choose a configuration to apply:" isLoading={false} doNotPadContent>
            <Box padding={2}>
              {metrics.map((metric, index) => (
                <Box display="flex" key={metric.id}>
                  <Radio
                    data-testid={dataTestIds.metricRadio(metric)}
                    checked={selectedMetric?.id === metric.id}
                    onChange={() => handleSelectMetric(metric)}
                    disabled={isBulkApplying}
                    value={metric.id}
                    name="radio-buttons-selected-metric"
                  />
                  <Box width="100%" marginTop={index === 0 ? 0 : 2}>
                    <LinkMetric key={metric.id} metric={metric} color={color.next().value[0]} />
                  </Box>
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>
        <Grid item xs={4}>
          {selectedMetric && (
            <Card title="Choosen configuration:" isLoading={false} doNotPadContent>
              <Box padding={2}>
                <Typography color="textSecondary" data-testid={dataTestIds.selectedMetricMinMax}>
                  Min:&nbsp;
                  {convertToPreferredUnit(selectedMetric.unitConfig.min, selectedMetric.measurementType)} (
                  {getPreferredUnit(selectedMetric.measurementType).symbol}), Max:&nbsp;
                  {convertToPreferredUnit(selectedMetric.unitConfig.max, selectedMetric.measurementType)} (
                  {getPreferredUnit(selectedMetric.measurementType).symbol})
                </Typography>
              </Box>
              <Tabs value={currentTab} onChange={(_, value) => setCurrentTab(value)}>
                {selectedMetric.alertRules.map(alertRule => (
                  <Tab
                    key={alertRule.id}
                    data-testid={dataTestIds.selectedMetricAlertRuleTab(alertRule)}
                    value={alertRule.id}
                    wrapped={true}
                    label={<TabLabelAlertRule metric={selectedMetric} alertRule={alertRule} readOnly />}
                  />
                ))}
              </Tabs>
              <Divider />
              {selectedMetric.alertRules.map(alertRule => (
                <TabPanel
                  key={alertRule.id}
                  data-testid={dataTestIds.selectedMetricAlertRuleTabPanel(alertRule)}
                  value={currentTab}
                  index={alertRule.id}
                >
                  <TableAlertRuleReadOnly metric={selectedMetric} alertRule={alertRule} onConfigure={() => {}} />
                </TabPanel>
              ))}
            </Card>
          )}
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="center">
            <Button
              variant="contained"
              disabled={!Boolean(selectedMetric) || isBulkApplying}
              onClick={() => onBulkApply(selectedMetric)}
              startIcon={<Check />}
              data-testid={dataTestIds.bulkApply}
            >
              Apply Selected Metric to Others
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

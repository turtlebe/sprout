import { ActionModuleProps, ActionRequestType } from '@plentyag/app-production/src/actions-modules/types';
import { CircularProgress, Grid } from '@plentyag/brand-ui/src/material-ui/core';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import React from 'react';

import { RuleRow } from './components/rule-row';
import { buildRuleRows } from './utils/build-rule-rows';
import { restackRules, unsetRule } from './utils/model-utils';

export const actionName = 'OverrideRoutingTable';
export const actionRequestType: ActionRequestType = 'Requests';

const dataTestIds = getScopedDataTestIds({ loading: 'loading' }, 'OverrideRoutingTable');
export { dataTestIds as dataTestIdsOverrideRoutingTable };

export const OverrideRoutingTable: React.FC<ActionModuleProps> = ({ formik, actionModel, isLoading }) => {
  const handleDelete = (_, { ruleNumber }) => {
    return formik.setValues(restackRules(unsetRule(formik.values, ruleNumber)));
  };

  const ruleRowNumbers = buildRuleRows(formik.values);

  if (isLoading) {
    return <CircularProgress data-testid={dataTestIds.loading} />;
  }

  const nextRuleNumber = ruleRowNumbers.length + 1;

  return (
    <Grid container direction="column" spacing={2} data-testid={dataTestIds.root}>
      {ruleRowNumbers.map(ruleNumber => (
        <Grid item key={`rule_row_${ruleNumber}`}>
          <RuleRow ruleNumber={ruleNumber} formik={formik} actionModel={actionModel} onDelete={handleDelete} />
        </Grid>
      ))}
      {formik.isValid && (
        <Grid item key={`rule_row_${nextRuleNumber}`}>
          <RuleRow ruleNumber={nextRuleNumber} formik={formik} actionModel={actionModel} onDelete={handleDelete} />
        </Grid>
      )}
    </Grid>
  );
};

export * from './additional-validation';

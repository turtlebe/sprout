import { Add, ArrowForward, Delete } from '@material-ui/icons';
import { DropDown } from '@plentyag/app-production/src/actions-modules/shared/components/drop-down';
import { ActionModuleProps } from '@plentyag/app-production/src/actions-modules/types';
import { Box, Button, IconButton, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import React, { useState } from 'react';
import v from 'voca';

import { getRuleName } from '../../utils/get-rule-name';

import { useStyles } from './styles';

const dataTestIds = getScopedDataTestIds(
  {
    ruleClosedMode: (ruleNumber: number) => `closed-${getRuleName(ruleNumber)}`,
    ruleEditMode: (ruleNumber: number) => `edit-${getRuleName(ruleNumber)}`,
    addRuleButton: 'add-rule-button',
    deleteRuleButton: (ruleNumber: number) => `delete-${getRuleName(ruleNumber)}`,
    fromDropdown: 'from-dropdown',
    conditionDropdown: 'condition-dropdown',
    toDropdown: 'to-dropdown',
  },
  'RuleRow'
);

export { dataTestIds as dataTestIdsRuleRow };

export interface RuleRow extends ActionModuleProps {
  ruleNumber: number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string, value: any) => void;
  onDelete: (e: React.MouseEvent<HTMLButtonElement>, obj: { ruleNumber: number }) => void;
}

const nicifyOption = (string: string) => v(string).chain().lowerCase().capitalize().words().value().join(' ');

export const RuleRow: React.FC<RuleRow> = ({
  formik,
  actionModel,
  ruleNumber,
  onChange = () => {},
  onDelete = () => {},
}) => {
  const classes = useStyles();

  const hasErrors = formik.submitCount > 0 && formik.errors[getRuleName(ruleNumber)];

  const [editMode, setEditMode] = useState(false);

  const handleDelete = e => {
    setEditMode(false);
    onDelete(e, { ruleNumber });
  };

  const rule = {
    from: formik?.values[`rule_${ruleNumber}_from`]?.value,
    condition: formik?.values[`rule_${ruleNumber}_condition`]?.value,
    to: formik?.values[`rule_${ruleNumber}_to`]?.value,
  };

  if (!editMode && !Object.values(rule).some(value => value)) {
    return (
      <Box display="flex" justifyContent="flex-end" data-testid={dataTestIds.ruleClosedMode(ruleNumber)}>
        <Button variant="outlined" onClick={() => setEditMode(true)} data-testid={dataTestIds.addRuleButton}>
          <Add /> Add Rule
        </Button>
      </Box>
    );
  }

  return (
    <Box className={classes.paper} data-testid={dataTestIds.ruleEditMode(ruleNumber)}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography className={classes.ruleLabel}>Rule {ruleNumber}</Typography>
        <Box display="flex" justifyContent="center" alignItems="center">
          <DropDown
            label="From"
            field={`rule_${ruleNumber}_from`}
            formik={formik}
            actionModel={actionModel}
            minWidth={150}
            isError={hasErrors}
            onChange={onChange}
          />
          <ArrowForward className={classes.arrow} />
          <DropDown
            label="Condition"
            field={`rule_${ruleNumber}_condition`}
            formik={formik}
            actionModel={actionModel}
            minWidth={350}
            renderMenuChoice={choice => nicifyOption(choice)}
            isError={hasErrors}
            onChange={onChange}
          />
          <ArrowForward className={classes.arrow} />
          <DropDown
            label="To"
            field={`rule_${ruleNumber}_to`}
            formik={formik}
            actionModel={actionModel}
            minWidth={150}
            isError={hasErrors}
            onChange={onChange}
          />
        </Box>
        <IconButton
          className={classes.button}
          aria-label="Delete rule"
          data-testid={dataTestIds.deleteRuleButton(ruleNumber)}
          icon={Delete}
          onClick={handleDelete}
        />
      </Box>
    </Box>
  );
};

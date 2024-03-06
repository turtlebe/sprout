import { useUnitConversion } from '@plentyag/app-environment/src/common/hooks';
import { validateMinMaxFieldValue } from '@plentyag/app-environment/src/common/utils';
import { SelectDropdownDown } from '@plentyag/brand-ui/src/components';
import { MenuItem, TextField } from '@plentyag/brand-ui/src/material-ui/core';
import { ActionDefinition } from '@plentyag/core/src/farm-def/types';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import React from 'react';

import { useStyles } from '../../styles';

const dataTestIds = getScopedDataTestIds(
  {
    selectDropdownValueInput: (id: string) => `select-dropdown-value-input-${id}`,
    selectMenuItemValueInput: (id: string, index: string) => `select-menu-item-value-input-${id}-${index}`,
    textFieldValueInput: (id: string) => `text-field-value-input-${id}`,
  },
  'table-schedule-edit'
);

export { dataTestIds as dataTestIdsActionValueInput };

export interface ActionValueInput {
  actionDefinition: ActionDefinition;
  actionValue: string;
  onChangeActionValue: (actionValue: string) => void;
  onBlurActionValue: (actionValue: string) => void;
  'data-testid': string;
}

export const ActionValueInput: React.FC<ActionValueInput> = ({
  actionDefinition,
  actionValue,
  onChangeActionValue,
  onBlurActionValue,
  'data-testid': dataTestId,
}) => {
  const classes = useStyles({});

  const { convertToPreferredUnit, getConcreteMeasurementType } = useUnitConversion();
  const measurementType = getConcreteMeasurementType(actionDefinition.measurementType);

  return (
    <>
      {actionDefinition.oneOf ? (
        <SelectDropdownDown
          value={actionValue}
          onChange={event => onChangeActionValue(event.target.value.toString())}
          fullWidth
          data-testid={dataTestIds.selectDropdownValueInput(dataTestId)}
          name={dataTestIds.selectDropdownValueInput(dataTestId)}
          className={classes.valueCell}
        >
          {actionDefinition.oneOf.map((item, index) => (
            <MenuItem key={index} value={item} data-testid={dataTestIds.selectMenuItemValueInput(dataTestId, index)}>
              {item}
            </MenuItem>
          ))}
        </SelectDropdownDown>
      ) : (
        <TextField
          variant="outlined"
          value={actionValue}
          onChange={event => onChangeActionValue(event.currentTarget.value.toString())}
          onBlur={event =>
            onBlurActionValue(
              validateMinMaxFieldValue(
                event.currentTarget.value.toString(),
                convertToPreferredUnit(actionDefinition.from, measurementType),
                convertToPreferredUnit(actionDefinition.to, measurementType)
              )
            )
          }
          size="small"
          inputProps={{
            type: 'number',
            min: convertToPreferredUnit(actionDefinition.from, measurementType),
            max: convertToPreferredUnit(actionDefinition.to, measurementType),
          }}
          data-testid={dataTestIds.textFieldValueInput(dataTestId)}
          name={dataTestIds.textFieldValueInput(dataTestId)}
          className={classes.valueCell}
        />
      )}
    </>
  );
};

import { KeyboardDatePicker } from '@plentyag/brand-ui/src/material-ui/pickers';
import { isValidDate } from '@plentyag/core/src/utils';
import React from 'react';

const dataTestIds = {
  root: 'plan-date-picker-root',
};

export { dataTestIds as dataTestIdsPlanDatePicker };

export interface PlanDatePicker {
  planDate: Date;
  onDateChange: (newDate: Date) => void;
}

/**
 * Date picker for workcenter page that allows user to only pick a date that is
 * greater than or equal to the current date. The "onChange" callback will
 * only be called if the entered date is valid and greater than today's date.
 */
export const PlanDatePicker: React.FC<PlanDatePicker> = ({ planDate, onDateChange }) => {
  const [internalPlanDate, setInternalPlanDate] = React.useState(planDate);

  return (
    <KeyboardDatePicker
      data-testid={dataTestIds.root}
      label="Date"
      value={internalPlanDate}
      format="MM/dd/yyyy"
      autoOk
      showTodayButton
      onChange={date => {
        setInternalPlanDate(date);
        if (isValidDate(date)) {
          onDateChange(date);
        }
      }}
    />
  );
};

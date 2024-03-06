import {
  getAdditionalDaysValue,
  getDurationInSecondsWith,
  getIntervalStartWithoutDst,
  getNonNumericalRuleSelectedOperator,
  getNonNumericalRuleValue,
  serializeArrayValue,
} from '@plentyag/app-environment/src/common/utils';
import { AlertRule, InterpolationType, Rule } from '@plentyag/core/src/types/environment';
import { isValidDate } from '@plentyag/core/src/utils';
import React from 'react';

import { copyAlertRule } from '../utils';

export type Operators = 'eq' | 'neq' | '_in' | 'nin' | 'contains' | 'ncontains';

export const operators: { label: string; value: Operators }[] = [
  { label: 'Equals To', value: 'eq' },
  { label: 'Not Equals To', value: 'neq' },
  { label: 'In', value: '_in' },
  { label: 'Not In', value: 'nin' },
  { label: 'Contains', value: 'contains' },
  { label: 'Not Contains', value: 'ncontains' },
];

export interface UseRuleHandlers {
  alertRule: AlertRule;
  onChange: (alertRule: AlertRule) => void;
  defaultRule: Rule;
}
export interface UseRuleHandlersReturn {
  selectedOperators: { [key: number]: Operators };
  handleAddRule: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  handleDeleteRule: (index: number) => (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  handleSortRules: () => void;
  handleChangeTime: (index: number) => (newDate: Date) => void;
  handleChangeDay: (index: number) => (additionalDay: number) => void;
  handleChangeMinMax: (index: number, attribute: string) => (event: any) => void;
  handleChangeInterpolationType: (newInterpolationType: InterpolationType) => void;
  handleChangeRepeatInterval: (newRepeatInterval: number) => void;
  handleChangeValue: (index: number, operator: Operators) => (value: string) => void;
  handleChangeOperator: (index: number) => (operator: Operators) => void;
}

export const useRuleHandlers = ({ alertRule, onChange, defaultRule }: UseRuleHandlers): UseRuleHandlersReturn => {
  const { rules = [] } = alertRule;

  /**
   * Copy the AlertRule and add a new Rule.
   */
  const handleAddRule: UseRuleHandlersReturn['handleAddRule'] = () => {
    const newRules = [...rules, defaultRule];

    onChange(copyAlertRule({ alertRule, newRules, sortRules: false }));
  };

  /**
   * Copy the AlertRule and remove a Rule.
   */
  const handleDeleteRule: UseRuleHandlersReturn['handleDeleteRule'] = index => () => {
    const newRules = [...rules.slice(0, index), ...rules.slice(index + 1)];

    onChange(copyAlertRule({ alertRule, newRules, sortRules: false }));
  };

  /**
   * Copy the AlertRule and sort its Rules.
   */
  const handleSortRules: UseRuleHandlersReturn['handleSortRules'] = () => {
    onChange(copyAlertRule({ alertRule }));
  };

  /**
   * --- Handlers for Numerical Rules ---
   */

  /**
   * Copy the AlertRule and change the time of a Rule.
   */
  const handleChangeTime: UseRuleHandlersReturn['handleChangeTime'] = index => newDate => {
    if (!isValidDate(newDate)) {
      return;
    }

    const time = getDurationInSecondsWith(alertRule, newDate, getAdditionalDaysValue(rules[index]));
    const newRules = [...rules.slice(0, index), { ...rules[index], time }, ...rules.slice(index + 1)];

    onChange(copyAlertRule({ alertRule, newRules, sortRules: false }));
  };

  /**
   * Copy the AlertRule and change the day of a Rule.
   */
  const handleChangeDay: UseRuleHandlersReturn['handleChangeDay'] = index => additionalDay => {
    const time = getDurationInSecondsWith(
      alertRule,
      getIntervalStartWithoutDst(alertRule).add(rules[index].time, 'seconds').toDate(),
      additionalDay
    );
    const newRules = [...rules.slice(0, index), { ...rules[index], time }, ...rules.slice(index + 1)];

    onChange(copyAlertRule({ alertRule, newRules, sortRules: false }));
  };

  /**
   * Copy the AlertRule and change the min/max of a Rule.
   */
  const handleChangeMinMax: UseRuleHandlersReturn['handleChangeMinMax'] = (index, attribute) => event => {
    const newRules = [
      ...rules.slice(0, index),
      {
        ...rules[index],
        [attribute]: event.currentTarget.value === '' ? null : parseFloat(event.currentTarget.value),
      },
      ...rules.slice(index + 1),
    ];

    onChange(copyAlertRule({ alertRule, newRules, sortRules: false }));
  };

  /**
   * Copy the AlertRule change its InterpolationType.
   */
  const handleChangeInterpolationType: UseRuleHandlersReturn['handleChangeInterpolationType'] =
    newInterpolationType => {
      onChange({
        ...alertRule,
        interpolationType: newInterpolationType,
      });
    };

  /**
   * Copy the AlertRule change its repeatInterval.
   */
  const handleChangeRepeatInterval: UseRuleHandlersReturn['handleChangeRepeatInterval'] = newRepeatInterval => {
    onChange({
      ...alertRule,
      repeatInterval: newRepeatInterval,
    });
  };

  /**
   * --- Handlers for Non Numerical Rules ---
   */

  /**
   * Copy the AlertRule and change the min/max of a Rule.
   */
  const handleChangeValue: UseRuleHandlersReturn['handleChangeValue'] = (index, operator) => value => {
    let newValue: string | string[] = value;
    if (['_in', 'nin'].includes(operator)) {
      // _in and nin expect values as a string[], parse the user input to an array of string
      newValue = serializeArrayValue(value);
    }

    const newRules = [...rules.slice(0, index), { time: 0, [operator]: newValue }, ...rules.slice(index + 1)];

    onChange(copyAlertRule({ alertRule, newRules, sortRules: false }));
  };

  const [selectedOperators, setSelectedOperators] = React.useState<UseRuleHandlersReturn['selectedOperators']>(
    rules.reduce((result, rule, index) => {
      return { ...result, [index]: getNonNumericalRuleSelectedOperator(rule) };
    }, {})
  );

  /**
   * Change the Operator for the modified Rule and call handleChangeValue.
   */
  const handleChangeOperator: UseRuleHandlersReturn['handleChangeOperator'] = index => operator => {
    setSelectedOperators({ ...selectedOperators, [index]: operator });
    handleChangeValue(index, operator)(getNonNumericalRuleValue(rules[index], { default: '' }));
  };

  return {
    selectedOperators,
    handleAddRule,
    handleDeleteRule,
    handleSortRules,
    handleChangeTime,
    handleChangeDay,
    handleChangeMinMax,
    handleChangeInterpolationType,
    handleChangeRepeatInterval,
    handleChangeValue,
    handleChangeOperator,
  };
};

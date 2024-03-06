import { mockAlertRules } from '@plentyag/app-environment/src/common/test-helpers';
import { getIntervalStart } from '@plentyag/app-environment/src/common/utils';
import { ONE_DAY } from '@plentyag/app-environment/src/common/utils/constants';
import {
  blurTextField,
  changeTextField,
  chooseFromSelectByIndex,
  getInputByName,
  openSelect,
} from '@plentyag/brand-ui/src/test-helpers';
import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsTableNonNumericalAlertRuleEdit as dataTestIds, TableNonNumericalAlertRuleEdit } from '.';

const onChange = jest.fn();
const onAlertRuleChanged = jest.fn();

const rules = [
  { time: 0, eq: 'A' },
  { time: 1200, neq: 'B' },
];
const alertRule = { ...mockAlertRules[0], rules };

describe('TableNonNumericalAlertRuleEdit', () => {
  beforeEach(() => {
    onChange.mockRestore();
    onAlertRuleChanged.mockRestore();
  });

  it('renders an empty AlertRule', () => {
    const { queryByTestId, queryAllByTestId } = render(
      <TableNonNumericalAlertRuleEdit alertRule={{ ...alertRule, rules: undefined }} onChange={onChange} />
    );

    expect(queryAllByTestId(dataTestIds.buttonAddRule)).toHaveLength(2);
    expect(queryByTestId(dataTestIds.cellOperator(0))).not.toBeInTheDocument();
  });

  it("renders the AlertRule's rules", () => {
    const { queryAllByTestId } = render(<TableNonNumericalAlertRuleEdit alertRule={alertRule} onChange={onChange} />);

    expect(queryAllByTestId(dataTestIds.buttonAddRule)).toHaveLength(1);
    expect(getInputByName(dataTestIds.cellOperator(0))).toHaveValue('eq');
    expect(getInputByName(dataTestIds.cellValue(0))).toHaveValue('A');
    expect(getInputByName(dataTestIds.cellOperator(1))).toHaveValue('neq');
    expect(getInputByName(dataTestIds.cellValue(1))).toHaveValue('B');
  });

  it('calls `onChange` when adding a new Rule', () => {
    const { queryByTestId } = render(<TableNonNumericalAlertRuleEdit alertRule={alertRule} onChange={onChange} />);

    queryByTestId(dataTestIds.buttonAddRule).click();

    expect(onChange).toHaveBeenCalledWith({ ...alertRule, rules: [...rules, { time: 0 }] });
  });

  it('calls `onChange` when removing an existing Rule', () => {
    const { queryByTestId } = render(<TableNonNumericalAlertRuleEdit alertRule={alertRule} onChange={onChange} />);

    queryByTestId(dataTestIds.cellDelete(0)).click();

    expect(onChange).toHaveBeenCalledWith({ ...alertRule, rules: [rules[1]] });
  });

  it('calls `onChange` when editing the operator of a Rule', () => {
    render(<TableNonNumericalAlertRuleEdit alertRule={alertRule} onChange={onChange} />);

    openSelect(dataTestIds.cellOperator(1));
    chooseFromSelectByIndex(0);

    expect(onChange).toHaveBeenCalledWith({ ...alertRule, rules: [rules[0], { time: 0, eq: rules[1].neq }] });
  });

  it('calls `onChange` when editing the value of a Rule, without blurring there is no change', () => {
    render(<TableNonNumericalAlertRuleEdit alertRule={alertRule} onChange={onChange} />);

    changeTextField(dataTestIds.cellValue(0), '*');

    expect(onChange).not.toHaveBeenCalled();
  });

  it('calls `onChange` when editing the value of a Rule, with blurring to trigger change', () => {
    render(<TableNonNumericalAlertRuleEdit alertRule={alertRule} onChange={onChange} />);

    changeTextField(dataTestIds.cellValue(0), '*');

    blurTextField(dataTestIds.cellValue(0));

    expect(onChange).toHaveBeenCalledWith({ ...alertRule, rules: [{ time: 0, eq: '*' }, rules[1]] });
  });

  it('calls onChange when editing the time of an existing Rule', () => {
    const { queryByTestId } = render(<TableNonNumericalAlertRuleEdit alertRule={alertRule} onChange={onChange} />);

    expect(queryByTestId(dataTestIds.cellDay(0))).not.toBeInTheDocument();
    changeTextField(
      dataTestIds.cellTime(0),
      getIntervalStart(alertRule, new Date(), 1)
        .add(alertRule.rules[0].time + 3600, 'seconds')
        .format('hh:mm A')
    );

    expect(onChange).toHaveBeenCalledWith({
      ...alertRule,
      rules: [{ ...alertRule.rules[0], time: alertRule.rules[0].time + 3600 }, ...alertRule.rules.slice(1)],
    });
  });

  it('calls onChange when editing the day of an existing Rule', () => {
    const multipleDaysAlertRule = { ...alertRule, repeatInterval: ONE_DAY * 2 };
    const { queryByTestId } = render(
      <TableNonNumericalAlertRuleEdit alertRule={multipleDaysAlertRule} onChange={onChange} />
    );

    expect(queryByTestId(dataTestIds.cellDay(0))).toBeInTheDocument();

    openSelect(dataTestIds.cellDay(0));
    chooseFromSelectByIndex(1);

    expect(onChange).toHaveBeenCalledWith({
      ...multipleDaysAlertRule,
      rules: [
        { ...multipleDaysAlertRule.rules[0], time: multipleDaysAlertRule.rules[0].time + ONE_DAY },
        ...multipleDaysAlertRule.rules.slice(1),
      ],
    });
  });

  it('calls onChange when editing the repeatInterval', () => {
    render(<TableNonNumericalAlertRuleEdit alertRule={alertRule} onChange={onChange} />);

    changeTextField(dataTestIds.cellRepeatInterval, 3600);

    expect(onChange).toHaveBeenCalledWith({
      ...alertRule,
      repeatInterval: 3600,
    });
  });

  it('sorts the rules', () => {
    const unorderedAlertRules = {
      ...alertRule,
      rules: [alertRule.rules[1], alertRule.rules[0]],
    };
    const { queryByTestId } = render(
      <TableNonNumericalAlertRuleEdit alertRule={unorderedAlertRules} onChange={onChange} />
    );

    expect(getInputByName(dataTestIds.cellTime(0))).toHaveValue(
      getIntervalStart(alertRule, new Date(), 1).add(alertRule.rules[1].time, 'seconds').format('hh:mm A')
    );
    expect(getInputByName(dataTestIds.cellTime(1))).toHaveValue(
      getIntervalStart(alertRule, new Date(), 1).add(alertRule.rules[0].time, 'seconds').format('hh:mm A')
    );

    queryByTestId(dataTestIds.buttonSortRules).click();

    expect(onChange).toHaveBeenCalledWith(alertRule);
  });
});

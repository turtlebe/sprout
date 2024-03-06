import { mockAlertRules, mockMetrics } from '@plentyag/app-environment/src/common/test-helpers';
import { getIntervalStartWithoutDst } from '@plentyag/app-environment/src/common/utils';
import { ONE_DAY } from '@plentyag/app-environment/src/common/utils/constants';
import {
  changeTextField,
  chooseFromSelectByIndex,
  getInputByName,
  openSelect,
} from '@plentyag/brand-ui/src/test-helpers';
import { mockUseFetchMeasurementTypes } from '@plentyag/core/src/hooks/use-fetch-measurement-types/test-helpers';
import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsTableAlertRuleEdit as dataTestIds, TableAlertRuleEdit } from '.';

const [metric] = mockMetrics;
const [alertRule] = mockAlertRules;

const onChange = jest.fn();
const onAlertRuleChanged = jest.fn();

mockUseFetchMeasurementTypes();

describe('TableAlertRuleEdit', () => {
  beforeEach(() => {
    onChange.mockRestore();
    onAlertRuleChanged.mockRestore();
  });

  it('renders an empty AlertRule', () => {
    const emptyAlertRule = { ...alertRule, rules: undefined };
    const { queryByTestId } = render(
      <TableAlertRuleEdit metric={metric} alertRule={emptyAlertRule} onChange={onChange} />
    );

    expect(queryByTestId(dataTestIds.cellTime(0))).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.buttonAddRule)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.cellRepeatInterval)).toBeInTheDocument();
  });

  it("renders the AlertRule's rules", () => {
    const { queryByTestId } = render(<TableAlertRuleEdit metric={metric} alertRule={alertRule} onChange={onChange} />);

    expect(alertRule.rules).toHaveLength(2);

    alertRule.rules.forEach((_, index) => {
      expect(queryByTestId(dataTestIds.cellTime(index))).toBeInTheDocument();
      expect(queryByTestId(dataTestIds.cellMin(index))).toBeInTheDocument();
      expect(queryByTestId(dataTestIds.cellMax(index))).toBeInTheDocument();
      expect(queryByTestId(dataTestIds.cellTime(index)).querySelector('input')).toHaveValue(
        getIntervalStartWithoutDst(alertRule).add(alertRule.rules[index].time, 'seconds').format('hh:mm A')
      );
      expect(queryByTestId(dataTestIds.cellMin(index)).querySelector('input')).toHaveValue(alertRule.rules[index].gte);
      expect(queryByTestId(dataTestIds.cellMax(index)).querySelector('input')).toHaveValue(alertRule.rules[index].lte);
      expect(queryByTestId(dataTestIds.cellDelete(index))).toBeInTheDocument();
    });

    expect(queryByTestId(dataTestIds.buttonAddRule)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.cellRepeatInterval)).toBeInTheDocument();
  });

  it('calls onChange when adding a new Rule', () => {
    const { queryByTestId } = render(<TableAlertRuleEdit metric={metric} alertRule={alertRule} onChange={onChange} />);

    queryByTestId(dataTestIds.buttonAddRule).click();

    expect(onChange).toHaveBeenCalledWith({
      ...alertRule,
      rules: [...alertRule.rules, { time: 0 }],
    });
  });

  it('calls onChange when removing an existing Rule', () => {
    const { queryByTestId } = render(<TableAlertRuleEdit metric={metric} alertRule={alertRule} onChange={onChange} />);

    queryByTestId(dataTestIds.cellDelete(0)).click();

    expect(onChange).toHaveBeenCalledWith({
      ...alertRule,
      rules: [...alertRule.rules.slice(1)],
    });
  });

  it('calls onChange when editing the min value of an existing Rule', () => {
    render(<TableAlertRuleEdit metric={metric} alertRule={alertRule} onChange={onChange} />);

    changeTextField(dataTestIds.cellMin(0), 0);

    expect(onChange).toHaveBeenCalledWith({
      ...alertRule,
      rules: [{ ...alertRule.rules[0], gte: 0 }, ...alertRule.rules.slice(1)],
    });
  });

  it('calls onChange when editing the max value of an existing Rule', () => {
    render(<TableAlertRuleEdit metric={metric} alertRule={alertRule} onChange={onChange} />);

    changeTextField(dataTestIds.cellMax(0), null);

    expect(onChange).toHaveBeenCalledWith({
      ...alertRule,
      rules: [{ ...alertRule.rules[0], lte: null }, ...alertRule.rules.slice(1)],
    });
  });

  it('calls onChange when editing the time of an existing Rule', () => {
    const { queryByTestId } = render(<TableAlertRuleEdit metric={metric} alertRule={alertRule} onChange={onChange} />);

    expect(queryByTestId(dataTestIds.cellDay(0))).not.toBeInTheDocument();
    changeTextField(
      dataTestIds.cellTime(0),
      getIntervalStartWithoutDst(alertRule)
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
      <TableAlertRuleEdit metric={metric} alertRule={multipleDaysAlertRule} onChange={onChange} />
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
    render(<TableAlertRuleEdit metric={metric} alertRule={alertRule} onChange={onChange} />);

    changeTextField(dataTestIds.cellRepeatInterval, 3600);

    expect(onChange).toHaveBeenCalledWith({
      ...alertRule,
      repeatInterval: 3600,
    });
  });

  it('calls onChange when editing the interpolationType', () => {
    render(<TableAlertRuleEdit metric={metric} alertRule={alertRule} onChange={onChange} />);

    changeTextField(dataTestIds.cellInterpolationType, 'LINEAR');

    expect(onChange).toHaveBeenCalledWith({
      ...alertRule,
      interpolationType: 'LINEAR',
    });
  });

  it('sorts the rules', () => {
    const unorderedAlertRules = {
      ...alertRule,
      rules: [alertRule.rules[1], alertRule.rules[0]],
    };
    const { queryByTestId } = render(
      <TableAlertRuleEdit metric={metric} alertRule={unorderedAlertRules} onChange={onChange} />
    );

    expect(getInputByName(dataTestIds.cellTime(0))).toHaveValue(
      getIntervalStartWithoutDst(alertRule).add(alertRule.rules[1].time, 'seconds').format('hh:mm A')
    );
    expect(getInputByName(dataTestIds.cellTime(1))).toHaveValue(
      getIntervalStartWithoutDst(alertRule).add(alertRule.rules[0].time, 'seconds').format('hh:mm A')
    );

    queryByTestId(dataTestIds.buttonSortRules).click();

    expect(onChange).toHaveBeenCalledWith(alertRule);
  });
});

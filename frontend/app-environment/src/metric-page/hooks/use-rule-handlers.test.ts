import { mockAlertRules } from '@plentyag/app-environment/src/common/test-helpers';
import { InterpolationType } from '@plentyag/core/src/types/environment';
import { act, renderHook } from '@testing-library/react-hooks';
import moment from 'moment';

import { useRuleHandlers } from '.';

const event = {} as unknown as React.MouseEvent<HTMLButtonElement, MouseEvent>;
const alertRule = { ...mockAlertRules[0], rules: [] };
const onChange = jest.fn();
const defaultRule = { time: 0, gte: 0, lte: 0 };
const alertRuleEqOperator = { time: 0, eq: '' };
const alertRuleInOperator = { time: 0, _in: [''] };
const alertRuleContainsOperator = { time: 0, contains: '' };

describe('useRuleHandlers', () => {
  beforeEach(() => {
    onChange.mockRestore();
  });

  it('adds a numerical rule', () => {
    const { result } = renderHook(() => useRuleHandlers({ alertRule, onChange, defaultRule }));

    act(() => result.current.handleAddRule(event));

    expect(onChange).toHaveBeenCalledWith({ ...alertRule, rules: [{ time: 0, gte: 0, lte: 0 }] });
  });

  it('adds a non numerical rule', () => {
    const { result } = renderHook(() => useRuleHandlers({ alertRule, onChange, defaultRule: alertRuleEqOperator }));

    act(() => result.current.handleAddRule(event));

    expect(onChange).toHaveBeenCalledWith({ ...alertRule, rules: [{ time: 0, eq: '' }] });
  });

  it('deletes a rule', () => {
    const { result } = renderHook(() =>
      useRuleHandlers({ alertRule: { ...alertRule, rules: [{ time: 0, gte: 0, lte: 0 }] }, onChange, defaultRule })
    );

    act(() => result.current.handleDeleteRule(0)(event));

    expect(onChange).toHaveBeenCalledWith({ ...alertRule, rules: [] });
  });

  it('sorts the rules', () => {
    const { result } = renderHook(() =>
      useRuleHandlers({
        alertRule: {
          ...alertRule,
          rules: [
            { time: 1, gte: 0, lte: 0 },
            { time: 0, gte: 0, lte: 0 },
          ],
        },
        onChange,
        defaultRule,
      })
    );

    act(() => result.current.handleSortRules());

    expect(onChange).toHaveBeenCalledWith({
      ...alertRule,
      rules: [
        { time: 0, gte: 0, lte: 0 },
        { time: 1, gte: 0, lte: 0 },
      ],
    });
  });

  it('changes the time of a rule', () => {
    const alertRule = { ...mockAlertRules[0], startsAt: moment().startOf('day').format() };
    const { result } = renderHook(() =>
      useRuleHandlers({
        alertRule: { ...alertRule, rules: [{ time: 0, gte: 0, lte: 0 }] },
        onChange,
        defaultRule,
      })
    );

    act(() => result.current.handleChangeTime(0)(moment(alertRule.startsAt).add(3600, 'seconds').toDate()));

    expect(onChange).toHaveBeenCalledWith({ ...alertRule, rules: [{ time: 3600, gte: 0, lte: 0 }] });
  });

  it('changes the day of a rule', () => {
    const { result } = renderHook(() =>
      useRuleHandlers({
        alertRule: { ...alertRule, rules: [{ time: 0, gte: 0, lte: 0 }] },
        onChange,
        defaultRule,
      })
    );

    act(() => result.current.handleChangeDay(0)(1));

    expect(onChange).toHaveBeenCalledWith({ ...alertRule, rules: [{ time: 86400, gte: 0, lte: 0 }] });
  });

  it('changes the min of a rule', () => {
    const { result } = renderHook(() =>
      useRuleHandlers({
        alertRule: { ...alertRule, rules: [{ time: 0, gte: 0, lte: 0 }] },
        onChange,
        defaultRule,
      })
    );

    act(() => result.current.handleChangeMinMax(0, 'gte')({ currentTarget: { value: 1000 } }));

    expect(onChange).toHaveBeenCalledWith({ ...alertRule, rules: [{ time: 0, gte: 1000, lte: 0 }] });
  });

  // this allows the user to clear the input and type the minus sign.
  it('changes the min of a rule with a blank value', () => {
    const { result } = renderHook(() =>
      useRuleHandlers({
        alertRule: { ...alertRule, rules: [{ time: 0, gte: 0, lte: 0 }] },
        onChange,
        defaultRule,
      })
    );

    act(() => result.current.handleChangeMinMax(0, 'gte')({ currentTarget: { value: '' } }));

    expect(onChange).toHaveBeenCalledWith({ ...alertRule, rules: [{ time: 0, gte: null, lte: 0 }] });
  });

  it('changes the min of a rule with a negative value', () => {
    const { result } = renderHook(() =>
      useRuleHandlers({
        alertRule: { ...alertRule, rules: [{ time: 0, gte: 0, lte: 0 }] },
        onChange,
        defaultRule,
      })
    );

    act(() => result.current.handleChangeMinMax(0, 'gte')({ currentTarget: { value: '-1.3' } }));

    expect(onChange).toHaveBeenCalledWith({ ...alertRule, rules: [{ time: 0, gte: -1.3, lte: 0 }] });
  });

  it('changes the max of a rule', () => {
    const { result } = renderHook(() =>
      useRuleHandlers({
        alertRule: { ...alertRule, rules: [{ time: 0, gte: 0, lte: 0 }] },
        onChange,
        defaultRule,
      })
    );

    act(() => result.current.handleChangeMinMax(0, 'lte')({ currentTarget: { value: 1000 } }));

    expect(onChange).toHaveBeenCalledWith({ ...alertRule, rules: [{ time: 0, gte: 0, lte: 1000 }] });
  });

  it('changes the interpolationType of a rule', () => {
    const { result } = renderHook(() => useRuleHandlers({ alertRule, onChange, defaultRule }));

    act(() => result.current.handleChangeInterpolationType(InterpolationType.linear));

    expect(onChange).toHaveBeenCalledWith({ ...alertRule, interpolationType: InterpolationType.linear });
  });

  it('changes the repeatInterval of a rule', () => {
    const { result } = renderHook(() => useRuleHandlers({ alertRule, onChange, defaultRule }));

    act(() => result.current.handleChangeRepeatInterval(3600));

    expect(onChange).toHaveBeenCalledWith({ ...alertRule, repeatInterval: 3600 });
  });

  it('changes the non numerical value and operator of a rule (for eq and neq operators)', () => {
    const { result } = renderHook(() =>
      useRuleHandlers({
        alertRule: { ...alertRule, rules: [alertRuleEqOperator] },
        onChange,
        defaultRule: alertRuleEqOperator,
      })
    );

    act(() => result.current.handleChangeValue(0, 'eq')('ABC'));

    expect(onChange).toHaveBeenCalledWith({ ...alertRule, rules: [{ time: 0, eq: 'ABC' }] });

    act(() => result.current.handleChangeOperator(0)('neq'));

    expect(onChange).toHaveBeenCalledWith({ ...alertRule, rules: [{ time: 0, neq: '' }] });

    act(() => result.current.handleChangeValue(0, 'neq')('XYZ'));

    expect(onChange).toHaveBeenCalledWith({ ...alertRule, rules: [{ time: 0, neq: 'XYZ' }] });

    act(() => result.current.handleChangeOperator(0)('eq'));

    expect(onChange).toHaveBeenCalledWith({ ...alertRule, rules: [{ time: 0, eq: '' }] });
  });

  it('changes the non numerical value and operator of a rule (for in and nin operators)', () => {
    const { result } = renderHook(() =>
      useRuleHandlers({
        alertRule: { ...alertRule, rules: [alertRuleInOperator] },
        onChange,
        defaultRule: alertRuleInOperator,
      })
    );

    act(() => result.current.handleChangeValue(0, '_in')('Kale,Lettuce'));

    expect(onChange).toHaveBeenCalledWith({ ...alertRule, rules: [{ time: 0, _in: ['Kale', 'Lettuce'] }] });

    act(() => result.current.handleChangeOperator(0)('nin'));

    expect(onChange).toHaveBeenCalledWith({ ...alertRule, rules: [{ time: 0, nin: [] }] });

    act(() => result.current.handleChangeValue(0, 'nin')('Strawberry,Tomato'));

    expect(onChange).toHaveBeenCalledWith({ ...alertRule, rules: [{ time: 0, nin: ['Strawberry', 'Tomato'] }] });

    act(() => result.current.handleChangeOperator(0)('_in'));

    expect(onChange).toHaveBeenCalledWith({ ...alertRule, rules: [{ time: 0, _in: [] }] });

    act(() => result.current.handleChangeValue(0, '_in')(' ,Strawberry ,, , Tomato,'));

    expect(onChange).toHaveBeenCalledWith({ ...alertRule, rules: [{ time: 0, _in: ['Strawberry', 'Tomato'] }] });

    act(() => result.current.handleChangeValue(0, 'nin')(' ,Strawberry ,, , Tomato,'));

    expect(onChange).toHaveBeenCalledWith({ ...alertRule, rules: [{ time: 0, nin: ['Strawberry', 'Tomato'] }] });
  });

  it('changes the non numerical value and operator of a rule (for contains and ncontains operators)', () => {
    const { result } = renderHook(() =>
      useRuleHandlers({
        alertRule: { ...alertRule, rules: [alertRuleContainsOperator] },
        onChange,
        defaultRule: alertRuleInOperator,
      })
    );

    act(() => result.current.handleChangeValue(0, 'contains')('ABC'));

    expect(onChange).toHaveBeenCalledWith({ ...alertRule, rules: [{ time: 0, contains: 'ABC' }] });

    act(() => result.current.handleChangeOperator(0)('ncontains'));

    expect(onChange).toHaveBeenCalledWith({ ...alertRule, rules: [{ time: 0, ncontains: '' }] });

    act(() => result.current.handleChangeValue(0, 'ncontains')('XYZ'));

    expect(onChange).toHaveBeenCalledWith({ ...alertRule, rules: [{ time: 0, ncontains: 'XYZ' }] });

    act(() => result.current.handleChangeOperator(0)('contains'));

    expect(onChange).toHaveBeenCalledWith({ ...alertRule, rules: [{ time: 0, contains: '' }] });
  });

  it('changes the non numerical value when spaces & empty elements are added to in and nin operators', () => {
    const { result } = renderHook(() =>
      useRuleHandlers({
        alertRule: { ...alertRule, rules: [alertRuleInOperator] },
        onChange,
        defaultRule: alertRuleInOperator,
      })
    );

    // Leading spaces in list element should be stripped
    act(() => result.current.handleChangeValue(0, '_in')('Kale,    Lettuce'));

    expect(onChange).toHaveBeenCalledWith({ ...alertRule, rules: [{ time: 0, _in: ['Kale', 'Lettuce'] }] });

    // Intermediate spaces in list element should remain
    act(() => result.current.handleChangeOperator(0)('nin'));
    act(() => result.current.handleChangeValue(0, 'nin')('Strawberry,Lettuce    and   Tomato'));

    expect(onChange).toHaveBeenCalledWith({
      ...alertRule,
      rules: [{ time: 0, nin: ['Strawberry', 'Lettuce    and   Tomato'] }],
    });

    // Multiple commas (representing empty elements) and leading and trailing spaces should be removed
    act(() => result.current.handleChangeOperator(0)('_in'));
    act(() => result.current.handleChangeValue(0, '_in')('    Arugula,, ,    ,Mizuna Mix      ,,Kale'));

    expect(onChange).toHaveBeenCalledWith({
      ...alertRule,
      rules: [{ time: 0, _in: ['Arugula', 'Mizuna Mix', 'Kale'] }],
    });
  });
});

import { Action, Rule } from '@plentyag/core/src/types/environment';

import { getCurrentAndNextPoints } from './get-current-and-next-points';

const repeatInterval = 86400;
const rules: Rule[] = [
  { time: 3600, gte: 10, lte: 20 },
  { time: 7200, gte: 15, lte: 25 },
];
const actions: Action[] = [
  { time: 3600, valueType: 'SINGLE_VALUE', value: '10' },
  { time: 7200, valueType: 'SINGLE_VALUE', value: '15' },
];

describe('getCurrentAndNextPoints', () => {
  it('returns null', () => {
    expect(
      getCurrentAndNextPoints({
        points: undefined,
        repeatInterval,
        secondsSinceIntervalStart: 0,
      })
    ).toBeNull();
    expect(
      getCurrentAndNextPoints({
        points: [],
        repeatInterval,
        secondsSinceIntervalStart: 0,
      })
    ).toBeNull();
    expect(
      getCurrentAndNextPoints<Rule>({
        points: rules,
        repeatInterval,
        secondsSinceIntervalStart: undefined,
      })
    ).toBeNull();
    expect(
      getCurrentAndNextPoints<Rule>({
        points: rules,
        repeatInterval: undefined,
        secondsSinceIntervalStart: 0,
      })
    ).toBeNull();
  });

  it('returns a pair of rules', () => {
    expect(
      getCurrentAndNextPoints({
        points: rules,
        repeatInterval,
        secondsSinceIntervalStart: 3600,
      })
    ).toEqual({
      left: rules[0],
      right: rules[1],
    });

    expect(
      getCurrentAndNextPoints({
        points: rules,
        repeatInterval,
        secondsSinceIntervalStart: 0,
      })
    ).toEqual({
      left: { ...rules[1], time: rules[1].time - repeatInterval },
      right: rules[0],
    });

    expect(
      getCurrentAndNextPoints({
        points: rules,
        repeatInterval,
        secondsSinceIntervalStart: repeatInterval,
      })
    ).toEqual({
      left: rules[1],
      right: { ...rules[0], time: rules[0].time + repeatInterval },
    });
  });

  it('returns a pair of actions', () => {
    expect(
      getCurrentAndNextPoints({
        points: actions,
        repeatInterval,
        secondsSinceIntervalStart: 3600,
      })
    ).toEqual({
      left: actions[0],
      right: actions[1],
    });

    expect(
      getCurrentAndNextPoints({
        points: actions,
        repeatInterval,
        secondsSinceIntervalStart: 0,
      })
    ).toEqual({
      left: { ...actions[1], time: actions[1].time - repeatInterval },
      right: actions[0],
    });

    expect(
      getCurrentAndNextPoints({
        points: actions,
        repeatInterval,
        secondsSinceIntervalStart: repeatInterval,
      })
    ).toEqual({
      left: actions[1],
      right: { ...actions[0], time: actions[0].time + repeatInterval },
    });
  });
});

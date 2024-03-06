import { mockScheduleDefinitions, mockSchedules } from '@plentyag/app-environment/src/common/test-helpers';
import { Schedule } from '@plentyag/core/src/types/environment';
import { omit } from 'lodash';

import { convertUnitForSchedule } from './convert-unit-for-schedule';

const [schedule] = mockSchedules;
const [scheduleDefinition] = mockScheduleDefinitions;
const conversionFn = values => values * 10;

describe('convertUnitForSchedule', () => {
  it('does not modify the schedule when actions is null', () => {
    expect(convertUnitForSchedule(conversionFn)({ ...schedule, actions: null }, scheduleDefinition)).toHaveProperty(
      'actions',
      null
    );
  });

  it('does not modify the schedule when actions is null', () => {
    expect(
      convertUnitForSchedule(conversionFn)({ ...schedule, actions: undefined }, scheduleDefinition)
    ).toHaveProperty('actions', undefined);
  });

  it('returns a copy of the Schedule', () => {
    const input = { ...schedule, actions: undefined };
    const output = convertUnitForSchedule(conversionFn)(input, scheduleDefinition);

    expect(output).not.toBe(input);
    expect(output).toEqual(input);
  });

  it('converts the value of the Action using the conversion function', () => {
    const scheduleDefinition = mockScheduleDefinitions.find(sd => sd.action?.supportedKeys?.length === 0);

    const input: Schedule = {
      ...schedule,
      actions: [
        {
          time: 3600,
          value: '10',
          valueType: 'SINGLE_VALUE',
        },
        {
          time: 7200,
          value: '20',
          valueType: 'SINGLE_VALUE',
        },
      ],
    };
    const output = convertUnitForSchedule(conversionFn)(input, scheduleDefinition);

    expect(output.actions).toEqual([
      {
        time: 3600,
        value: '100',
        valueType: 'SINGLE_VALUE',
      },
      {
        time: 7200,
        value: '200',
        valueType: 'SINGLE_VALUE',
      },
    ]);
    expect(omit(output, ['actions'])).toEqual(omit(input, ['actions']));
  });

  it('converts the values of the Action using the conversion function', () => {
    const scheduleDefinition = mockScheduleDefinitions.find(
      sd => sd.action?.supportedKeys?.includes('zone1') && sd.action?.supportedKeys?.includes('zone2')
    );

    const input: Schedule = {
      ...schedule,
      actions: [
        {
          time: 3600,
          values: {
            zone1: '10',
            zone2: '20',
          },
          valueType: 'MULTIPLE_VALUE',
        },
        {
          time: 7200,
          values: {
            zone1: '30',
            zone2: '40',
          },
          valueType: 'MULTIPLE_VALUE',
        },
      ],
    };
    const output = convertUnitForSchedule(conversionFn)(input, scheduleDefinition);

    expect(output.actions).toEqual([
      {
        time: 3600,
        values: {
          zone1: '100',
          zone2: '200',
        },
        valueType: 'MULTIPLE_VALUE',
      },
      {
        time: 7200,
        values: {
          zone1: '300',
          zone2: '400',
        },
        valueType: 'MULTIPLE_VALUE',
      },
    ]);
    expect(omit(output, ['actions'])).toEqual(omit(input, ['actions']));
  });

  it('gets the actionDefinition in the conversion function', () => {
    const actionDefinition = {
      measurementType: scheduleDefinition.action.measurementType,
      graphable: true,
      defaultValue: undefined,
      ...scheduleDefinition.action.supportedValues,
    };
    const conversionFn = jest.fn().mockReturnValue(0);
    const input: Schedule = {
      ...schedule,
      actions: [
        {
          time: 3600,
          value: '10',
          valueType: 'SINGLE_VALUE',
        },
        {
          time: 7200,
          value: '20',
          valueType: 'SINGLE_VALUE',
        },
      ],
    };

    expect(conversionFn).toHaveBeenCalledTimes(0);

    convertUnitForSchedule(conversionFn)(input, scheduleDefinition);

    expect(conversionFn).toHaveBeenCalledTimes(2);
    expect(conversionFn).toHaveBeenNthCalledWith(1, '10', actionDefinition);
    expect(conversionFn).toHaveBeenNthCalledWith(2, '20', actionDefinition);
  });
});

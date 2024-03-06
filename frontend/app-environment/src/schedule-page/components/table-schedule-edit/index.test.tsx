import {
  buildSchedule,
  mockScheduleDefinitions,
  mockSchedules,
} from '@plentyag/app-environment/src/common/test-helpers';
import { getIntervalStartWithoutDst } from '@plentyag/app-environment/src/common/utils';
import { ONE_DAY } from '@plentyag/app-environment/src/common/utils/constants';
import {
  blurTextField,
  changeTextField,
  chooseFromSelect,
  chooseFromSelectByIndex,
  getInputByName,
  openSelect,
} from '@plentyag/brand-ui/src/test-helpers';
import { mockUseFetchMeasurementTypes } from '@plentyag/core/src/hooks/use-fetch-measurement-types/test-helpers';
import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsTableScheduleEdit as dataTestIds, TableScheduleEdit } from '.';

import { dataTestIdsActionValueInput as dataTestValueInputIds } from './components';

const [schedule, scheduleUsingOneOf] = mockSchedules;
const [scheduleDefinition] = mockScheduleDefinitions;

const onChange = jest.fn();

mockUseFetchMeasurementTypes();

describe('TableScheduleEdit', () => {
  beforeEach(() => {
    onChange.mockRestore();
  });

  it('renders a schedule without Actions', () => {
    const { queryByTestId } = render(
      <TableScheduleEdit
        schedule={{ ...schedule, actions: [] }}
        scheduleDefinition={scheduleDefinition}
        onChange={onChange}
      />
    );

    expect(queryByTestId(dataTestIds.tableRow(0))).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.buttonAddAction)).toBeInTheDocument();
  });

  it('renders a schedule with Actions', () => {
    const { queryByTestId } = render(
      <TableScheduleEdit schedule={schedule} scheduleDefinition={scheduleDefinition} onChange={onChange} />
    );

    expect(schedule.actions).toHaveLength(2);
    schedule.actions.forEach((action, index) => {
      expect(queryByTestId(dataTestIds.tableRow(index))).toBeInTheDocument();
      expect(queryByTestId(dataTestIds.cellTime(index)).querySelector('input')).toHaveValue(
        getIntervalStartWithoutDst(schedule).add(action.time, 'seconds').format('hh:mm A')
      );
      expect(
        queryByTestId(dataTestValueInputIds.textFieldValueInput(dataTestIds.cellValue(index))).querySelector('input')
      ).toHaveValue(parseFloat(action.value));
      expect(queryByTestId(dataTestIds.cellDelete(index))).toBeInTheDocument();
    });

    expect(queryByTestId(dataTestIds.buttonAddAction)).toBeInTheDocument();
  });

  it('adds an Action', () => {
    const { queryByTestId } = render(
      <TableScheduleEdit schedule={schedule} scheduleDefinition={scheduleDefinition} onChange={onChange} />
    );

    queryByTestId(dataTestIds.buttonAddAction).click();

    expect(onChange).toHaveBeenCalledWith({
      ...schedule,
      actions: [...schedule.actions, { time: 0, value: '0', valueType: 'SINGLE_VALUE' }],
    });

    expect(schedule.actions).toHaveLength(2);
    schedule.actions.forEach((action, index) => {
      expect(queryByTestId(dataTestIds.cellDelete(index))).toBeInTheDocument();
      expect(queryByTestId(dataTestIds.cellCopy(index))).not.toBeInTheDocument();
    });
  });

  it('updates the time of an Action', () => {
    const newTime = 60 * 100;

    const { queryByTestId } = render(
      <TableScheduleEdit schedule={schedule} scheduleDefinition={scheduleDefinition} onChange={onChange} />
    );

    expect(queryByTestId(dataTestIds.cellDay(0))).not.toBeInTheDocument();

    changeTextField(
      dataTestIds.cellTime(0),
      getIntervalStartWithoutDst(schedule).add(newTime, 'seconds').format('hh:mm A')
    );

    expect(onChange).toHaveBeenCalledWith({
      ...schedule,
      actions: [{ ...schedule.actions[0], time: newTime }, schedule.actions[1]],
    });
  });

  it('updates the day of an Action', () => {
    const multipleDaysSchedule = { ...schedule, repeatInterval: ONE_DAY * 2 };

    const { queryByTestId } = render(
      <TableScheduleEdit schedule={multipleDaysSchedule} scheduleDefinition={scheduleDefinition} onChange={onChange} />
    );

    expect(queryByTestId(dataTestIds.cellDay(0))).toBeInTheDocument();

    openSelect(dataTestIds.cellDay(0));
    chooseFromSelectByIndex(1);

    expect(onChange).toHaveBeenCalledWith({
      ...multipleDaysSchedule,
      actions: [
        { ...multipleDaysSchedule.actions[0], time: multipleDaysSchedule.actions[0].time + ONE_DAY },
        multipleDaysSchedule.actions[1],
      ],
    });
  });

  it('updates the repeatInterval of a Schedule', () => {
    const { queryByTestId } = render(
      <TableScheduleEdit schedule={schedule} scheduleDefinition={scheduleDefinition} onChange={onChange} />
    );

    expect(queryByTestId(dataTestIds.cellRepeatInterval)).toBeInTheDocument();

    expect(getInputByName(dataTestIds.cellRepeatInterval)).toHaveValue(undefined);

    changeTextField(dataTestIds.cellRepeatInterval, 3600);

    expect(onChange).toHaveBeenCalledWith({
      ...schedule,
      repeatInterval: 3600,
    });
  });

  it('updates the interpolationType of a Schedule', () => {
    const { queryByTestId } = render(
      <TableScheduleEdit schedule={schedule} scheduleDefinition={scheduleDefinition} onChange={onChange} />
    );

    expect(queryByTestId(dataTestIds.cellInterpolationType)).toBeInTheDocument();

    expect(getInputByName(dataTestIds.cellInterpolationType)).toHaveValue('NONE');

    changeTextField(dataTestIds.cellInterpolationType, 'LINEAR');

    expect(onChange).toHaveBeenCalledWith({
      ...schedule,
      interpolationType: 'LINEAR',
    });
  });

  const scheduleWithNewValue = newValue => ({
    ...schedule,
    actions: [schedule.actions[0], { ...schedule.actions[1], value: newValue }],
  });

  it('updates the value of an Action', () => {
    const newValue = 100;
    const updatedSchedule = scheduleWithNewValue(newValue.toString());

    const { rerender } = render(
      <TableScheduleEdit schedule={schedule} scheduleDefinition={scheduleDefinition} onChange={onChange} />
    );

    expect(onChange).toHaveBeenCalledTimes(0);

    changeTextField(dataTestValueInputIds.textFieldValueInput(dataTestIds.cellValue(1)), newValue);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenNthCalledWith(1, updatedSchedule);

    rerender(
      <TableScheduleEdit schedule={updatedSchedule} scheduleDefinition={scheduleDefinition} onChange={onChange} />
    );

    expect(getInputByName(dataTestValueInputIds.textFieldValueInput(dataTestIds.cellValue(1)))).toHaveValue(newValue);

    // -> On blur, the value remains the same
    blurTextField(dataTestValueInputIds.textFieldValueInput(dataTestIds.cellValue(1)));

    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenNthCalledWith(2, scheduleWithNewValue(newValue.toString()));
  });

  it('updates the value of an Action with the max value on blur', () => {
    const newValue = 10000;
    const updatedSchedule = scheduleWithNewValue(newValue.toString());

    const { rerender } = render(
      <TableScheduleEdit schedule={schedule} scheduleDefinition={scheduleDefinition} onChange={onChange} />
    );

    expect(onChange).toHaveBeenCalledTimes(0);

    changeTextField(dataTestValueInputIds.textFieldValueInput(dataTestIds.cellValue(1)), newValue);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenNthCalledWith(1, scheduleWithNewValue(newValue.toString()));

    rerender(
      <TableScheduleEdit schedule={updatedSchedule} scheduleDefinition={scheduleDefinition} onChange={onChange} />
    );

    expect(getInputByName(dataTestValueInputIds.textFieldValueInput(dataTestIds.cellValue(1)))).toHaveValue(newValue);

    // -> On blur, the value changes to the maximum value.
    blurTextField(dataTestValueInputIds.textFieldValueInput(dataTestIds.cellValue(1)));

    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenNthCalledWith(
      2,
      scheduleWithNewValue(scheduleDefinition.action.supportedValues.to.toString())
    );
  });

  it('updates the value of an Action with the min value on blur when typing letters', () => {
    const newValue = 'ABC';
    const updatedSchedule = scheduleWithNewValue('');

    const { rerender } = render(
      <TableScheduleEdit schedule={schedule} scheduleDefinition={scheduleDefinition} onChange={onChange} />
    );

    expect(onChange).toHaveBeenCalledTimes(0);

    changeTextField(dataTestValueInputIds.textFieldValueInput(dataTestIds.cellValue(1)), newValue);

    expect(onChange).toHaveBeenCalledTimes(1);
    // -> On change, the value changes to empty string because only numbers are allowed on the input.
    expect(onChange).toHaveBeenNthCalledWith(1, scheduleWithNewValue(''));

    rerender(
      <TableScheduleEdit schedule={updatedSchedule} scheduleDefinition={scheduleDefinition} onChange={onChange} />
    );

    expect(getInputByName(dataTestValueInputIds.textFieldValueInput(dataTestIds.cellValue(1)))).toHaveValue(null);

    // -> On blur, the value changes to the min value
    blurTextField(dataTestValueInputIds.textFieldValueInput(dataTestIds.cellValue(1)));

    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenNthCalledWith(
      2,
      scheduleWithNewValue(scheduleDefinition.action.supportedValues.from.toString())
    );
  });

  it('updates the value of an Action and trims leading zeros on blur', () => {
    const newValue = '034';
    const updatedSchedule = scheduleWithNewValue(newValue);

    const { rerender } = render(
      <TableScheduleEdit schedule={schedule} scheduleDefinition={scheduleDefinition} onChange={onChange} />
    );

    expect(onChange).toHaveBeenCalledTimes(0);

    changeTextField(dataTestValueInputIds.textFieldValueInput(dataTestIds.cellValue(1)), newValue);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenNthCalledWith(1, scheduleWithNewValue(newValue.toString()));

    rerender(
      <TableScheduleEdit schedule={updatedSchedule} scheduleDefinition={scheduleDefinition} onChange={onChange} />
    );

    expect(getInputByName(dataTestValueInputIds.textFieldValueInput(dataTestIds.cellValue(1)))).toHaveValue(34);

    // -> On blur, the leading zeros are removed
    blurTextField(dataTestValueInputIds.textFieldValueInput(dataTestIds.cellValue(1)));

    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenNthCalledWith(2, scheduleWithNewValue('34'.toString()));
  });

  it('removes an Action', () => {
    const { queryByTestId } = render(
      <TableScheduleEdit schedule={schedule} scheduleDefinition={scheduleDefinition} onChange={onChange} />
    );

    queryByTestId(dataTestIds.cellDelete(0)).click();

    expect(onChange).toHaveBeenCalledWith({
      ...schedule,
      actions: [...schedule.actions.slice(1)],
    });
  });

  it('renders a schedule using a ScheduleDefinition with `oneOf`', () => {
    const newValue = 'on';
    const scheduleDefinition = mockScheduleDefinitions.find(
      scheduleDefinition => scheduleDefinition.action.supportedValues.oneOf
    );
    const schedule = scheduleUsingOneOf;

    const { queryByTestId } = render(
      <TableScheduleEdit schedule={schedule} scheduleDefinition={scheduleDefinition} onChange={onChange} />
    );

    expect(schedule.actions).toHaveLength(2);

    schedule.actions.forEach((action, index) => {
      expect(queryByTestId(dataTestIds.tableRow(index))).toBeInTheDocument();
      expect(queryByTestId(dataTestIds.cellTime(index)).querySelector('input')).toHaveValue(
        getIntervalStartWithoutDst(schedule).add(action.time, 'seconds').format('hh:mm A')
      );
      expect(
        queryByTestId(dataTestValueInputIds.selectDropdownValueInput(dataTestIds.cellValue(index))).querySelector(
          'input'
        )
      ).toHaveValue(action.value);
      expect(queryByTestId(dataTestIds.cellDelete(index))).toBeInTheDocument();
    });

    expect(queryByTestId(dataTestIds.buttonAddAction)).toBeInTheDocument();

    openSelect(dataTestValueInputIds.selectDropdownValueInput(dataTestIds.cellValue(1)));
    chooseFromSelect(newValue);

    expect(onChange).toHaveBeenCalledWith({
      ...schedule,
      actions: [schedule.actions[0], { ...schedule.actions[1], value: newValue }],
    });
  });

  it('renders a schedule with multiple values', () => {
    const newValue = '60';
    const scheduleDefinition = mockScheduleDefinitions.find(sd => sd.name === 'SetLightIntensity');
    const schedule = mockSchedules.find(s => s.path === scheduleDefinition.path);

    const { queryByTestId } = render(
      <TableScheduleEdit schedule={schedule} scheduleDefinition={scheduleDefinition} onChange={onChange} />
    );

    expect(schedule.actions).toHaveLength(2);
    expect(scheduleDefinition.action.supportedKeys).toEqual(['zone1', 'zone2']);

    schedule.actions.forEach((action, index) => {
      expect(queryByTestId(dataTestIds.tableRow(index))).toBeInTheDocument();
      expect(queryByTestId(dataTestIds.cellTime(index)).querySelector('input')).toHaveValue(
        getIntervalStartWithoutDst(schedule).add(action.time, 'seconds').format('hh:mm A')
      );

      expect(
        queryByTestId(
          dataTestValueInputIds.selectDropdownValueInput(dataTestIds.cellValue(index, 'zone1'))
        ).querySelector('input')
      ).toHaveValue(action.values.zone1);
      expect(
        queryByTestId(
          dataTestValueInputIds.selectDropdownValueInput(dataTestIds.cellValue(index, 'zone2'))
        ).querySelector('input')
      ).toHaveValue(action.values.zone2);
      expect(queryByTestId(dataTestIds.cellDelete(index))).toBeInTheDocument();
    });

    expect(queryByTestId(dataTestIds.buttonAddAction)).toBeInTheDocument();

    openSelect(dataTestValueInputIds.selectDropdownValueInput(dataTestIds.cellValue(1, 'zone2')));
    chooseFromSelect(newValue);

    expect(onChange).toHaveBeenCalledWith({
      ...schedule,
      actions: [
        schedule.actions[0],
        { ...schedule.actions[1], values: { ...schedule.actions[1].values, zone2: newValue } },
      ],
    });
  });

  it('adds an Action to a schedule with multiple values, having action definitions with same measurement types', () => {
    const scheduleDefinition = mockScheduleDefinitions.find(sd => sd.name === 'SetLightIntensity');
    const schedule = mockSchedules.find(s => s.path === scheduleDefinition.path);

    const { queryByTestId } = render(
      <TableScheduleEdit schedule={schedule} scheduleDefinition={scheduleDefinition} onChange={onChange} />
    );

    queryByTestId(dataTestIds.buttonAddAction).click();

    expect(onChange).toHaveBeenCalledWith({
      ...schedule,
      actions: [...schedule.actions, { time: 0, values: { zone1: '20', zone2: '20' }, valueType: 'MULTIPLE_VALUE' }],
    });

    expect(schedule.actions).toHaveLength(2);
    schedule.actions.forEach((action, index) => {
      expect(queryByTestId(dataTestIds.cellDelete(index))).toBeInTheDocument();
      expect(queryByTestId(dataTestIds.cellCopy(index))).toBeInTheDocument();
    });
  });

  it('adds an Action to a schedule with multiple values, having action definitions with different measurement types', () => {
    // mock SetIrrigationWithMultipleValues has different actionDefinitions
    const scheduleDefinition = mockScheduleDefinitions.find(sd => sd.name === 'SetIrrigationMultipleValue');
    const schedule = buildSchedule({
      path: 'sites/TEST/areas/SEED/lines/SeederLine/scheduleDefinitions/SetIrrigationMultipleValue',
      actions: [
        {
          valueType: 'MULTIPLE_VALUE',
          time: 3600,
          values: { drain: '30', duration: '40', frequency: '60', irrigation: 'off' },
        },
        {
          valueType: 'MULTIPLE_VALUE',
          time: 7200,
          values: { drain: '20', duration: '60', frequency: '90', irrigation: 'off' },
        },
      ],
    });

    const { queryByTestId } = render(
      <TableScheduleEdit schedule={schedule} scheduleDefinition={scheduleDefinition} onChange={onChange} />
    );

    queryByTestId(dataTestIds.buttonAddAction).click();

    expect(onChange).toHaveBeenCalledWith({
      ...schedule,
      actions: [
        ...schedule.actions,
        {
          time: 0,
          values: { drain: '0', duration: '0', frequency: '0', irrigation: 'on' },
          valueType: 'MULTIPLE_VALUE',
        },
      ],
    });

    expect(schedule.actions).toHaveLength(2);
    schedule.actions.forEach((action, index) => {
      expect(queryByTestId(dataTestIds.cellDelete(index))).toBeInTheDocument();
      expect(queryByTestId(dataTestIds.cellCopy(index))).not.toBeInTheDocument();
    });
  });
});

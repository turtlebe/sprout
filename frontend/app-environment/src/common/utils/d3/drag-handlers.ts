import { renderAlertRuleD3Area } from '@plentyag/app-environment/src/common/hooks/use-metric-graph-api/render-alert-rule-area';
import { YAxisScaleType } from '@plentyag/core/src/types';
import { Action, Rule } from '@plentyag/core/src/types/environment';
import { isScaleLinear } from '@plentyag/core/src/types/environment/type-guards';
import { nearestValue } from '@plentyag/core/src/utils';
import * as d3 from 'd3';
import { get, set } from 'lodash';
import { MutableRefObject } from 'react';

import { d3Classes } from '../constants';

import { getCoordX, getCoordY, getElement, setDataOnHandleInfo, setDataOnLine } from '.';

export interface DragHandler<Data> {
  d: d3.D3DragEvent<Element, string, string>;
  that: d3.BaseType;
  x: d3.ScaleTime<number, number>;
  y: d3.AxisScale<YAxisScaleType>;
  startDateTime: Date;
  endDateTime: Date;
  minY: number;
  maxY: number;
  data: Data[];
  ref: MutableRefObject<SVGSVGElement>;
  unitSymbol: string;
}

type DragHandlerAlertRule = DragHandler<Rule<Date>>;

interface DragHandlerSchedule extends DragHandler<Action<Date>> {
  key: string;
  dataForHandles: Action<Date>[];
  oneOf: string[];
  yValues: number[];
}

export function dragHandlerLinearInterpolationAlertRule({
  d,
  that,
  x,
  y,
  startDateTime,
  endDateTime,
  minY,
  maxY,
  data,
  ref,
  unitSymbol,
}: DragHandlerAlertRule) {
  if (!isScaleLinear(y)) {
    throw new Error('Non linear Scale is not supported to render AlertRules in Edit mode.');
  }

  // Get CoordX and CoordY bounded by the view.
  const coordX = getCoordX({ x, i: d.x, min: startDateTime, max: endDateTime });
  const coordY = getCoordY({ y, i: d.y, min: minY, max: maxY });

  // drag the current handle.
  d3.select(that).attr('cx', coordX);
  d3.select(that).attr('cy', coordY);

  // prepare to mutate `data` that the objects are drawn from.
  const index = parseInt(d3.select(that).attr('index'), 10);
  const gteOrLte = d3.select(that).attr('gte-or-lte');
  const oppositeMinOrMax = gteOrLte == 'gte' ? 'lte' : 'gte';
  const newX = x.invert(coordX);
  const newY = Math.round(y.invert(coordY) * 10) / 10;

  // mutate the data
  data[index + 1].time = newX;
  data[index + 1][gteOrLte] = newY;
  // when the last gte or lte handle is dragged, we need to update the first invisible point (padding).
  if (index === data.length - 3) {
    data[0][gteOrLte] = newY;
  }

  // re-draw the alertRule are.
  d3.selectAll(getElement('path', d3Classes.alertRuleArea)).attr('d', renderAlertRuleD3Area({ x, y }));

  // re-draw the opposite handle (gte or lte) on the X axis.
  d3.select(`circle[index="${index}"][gte-or-lte="${oppositeMinOrMax}"]`).attr('cx', coordX);

  // re-draw the lines between handles
  setDataOnLine({ ref, data, x, y, classes: ['gte'], xValue: d => d.time, yValue: d => d.gte ?? minY });
  setDataOnLine({ ref, data, x, y, classes: ['lte'], xValue: d => d.time, yValue: d => d.lte ?? maxY });

  // re-draw handlers info
  setDataOnHandleInfo({
    svg: ref.current,
    selector: `.${d3Classes.handleInfo}.${gteOrLte}[index="${index}"]`,
    data: data[index + 1],
    yAttribute: gteOrLte,
    unitSymbol,
    coordX,
    coordY,
  });
  setDataOnHandleInfo({
    svg: ref.current,
    selector: `.${d3Classes.handleInfo}.${oppositeMinOrMax}[index="${index}"]`,
    data: data[index + 1],
    yAttribute: gteOrLte,
    unitSymbol,
    coordX,
    coordY: parseFloat(d3.select(`circle[index="${index}"][gte-or-lte="${oppositeMinOrMax}"]`).attr('cy')),
  });
}

export function dragHandlerLinearInterpolationSchedule({
  d,
  that,
  x,
  y,
  startDateTime,
  endDateTime,
  minY,
  maxY,
  data,
  ref,
  unitSymbol,
  key,
  dataForHandles,
}: DragHandlerSchedule) {
  if (!isScaleLinear(y)) {
    throw new Error('Non linear Scale is not supported to render Schedule in Edit mode.');
  }

  // Get CoordX and CoordY bounded by the view.
  const coordX = getCoordX({ x, i: d.x, min: startDateTime, max: endDateTime });
  const coordY = getCoordY({ y, i: d.y, min: minY, max: maxY });

  // drag the current handle.
  d3.select(that).attr('cx', coordX);
  d3.select(that).attr('cy', coordY);

  // prepare to mutate `data` that the objects are drawn from.
  const index = parseInt(d3.select(that).attr('index'), 10);
  const handleData = dataForHandles[index];
  const actionValueKey = key ? `values.${key}` : 'value';
  const newX = x.invert(coordX);
  const newY = Math.round(y.invert(coordY) * 10) / 10;

  // mutate the data
  const indexInData = data.findIndex(d => d === handleData);
  set(data[index + 1], 'time', newX);
  set(data[index + 1], actionValueKey, newY);
  // when the last setPointValueKey handle is dragged, we need to update the first invisible point (padding).
  if (index === data.length - 3) {
    set(data[0], actionValueKey, newY);
  }

  // re-draw the lines between handles
  setDataOnLine({
    ref,
    data,
    x,
    y,
    classes: ['value'],
    xValue: d => d.time,
    yValue: d => (key && d.values ? d.values[key] : d.value),
  });

  // re-draw other handler info when Schedule has multiple values
  if (key) {
    Object.keys(data[indexInData].values)
      .filter(k => k !== key)
      .forEach(otherKey => {
        setDataOnHandleInfo({
          svg: ref.current,
          selector: `.${d3Classes.handleInfo}.${otherKey}[index="${index}"]`,
          data: handleData,
          yAttribute: `values.${otherKey}`,
          unitSymbol,
          coordX,
        });
      });
  }

  // re-draw handlers info
  setDataOnHandleInfo({
    svg: ref.current,
    selector: `.${[d3Classes.handleInfo, key].filter(Boolean).join('.')}[index="${index}"]`,
    data: data[index + 1],
    yAttribute: actionValueKey,
    unitSymbol,
    coordX,
    coordY,
  });
}

export function dragHandlerNoInterpolationAlertRule({
  d,
  that,
  x,
  y,
  startDateTime,
  endDateTime,
  minY,
  maxY,
  data,
  ref,
  unitSymbol,
}: DragHandlerAlertRule) {
  if (!isScaleLinear(y)) {
    throw new Error('Non linear Scale is not supported to render AlertRules in Edit mode.');
  }

  // Get CoordX and CoordY bounded by the view.
  const coordX = getCoordX({ x, i: d.x, min: startDateTime, max: endDateTime });
  const coordY = getCoordY({ y, i: d.y, min: minY, max: maxY });

  // drag the current handle.
  d3.select(that).attr('cx', coordX);
  d3.select(that).attr('cy', coordY);

  // prepare to mutate `data` that the objects are drawn from.
  const index = parseInt(d3.select(that).attr('index'), 10);
  const dataIndex = index * 2 + 2;
  const gteOrLte = d3.select(that).attr('gte-or-lte');
  const oppositeMinOrMax = gteOrLte == 'gte' ? 'lte' : 'gte';
  const newX = x.invert(coordX);
  const newY = Math.round(y.invert(coordY) * 10) / 10;

  // mutate the data!
  data[dataIndex].time = newX;
  data[dataIndex][gteOrLte] = newY;
  data[dataIndex + 1][gteOrLte] = newY;
  data[dataIndex - 1].time = newX;

  // re-draw the alertRule are.
  d3.selectAll(getElement('path', d3Classes.alertRuleArea)).attr('d', renderAlertRuleD3Area({ x, y }));

  // re-draw the opposite handle (gte or lte) on the X axis.
  d3.select(`circle[index="${index}"][gte-or-lte="${oppositeMinOrMax}"]`).attr('cx', coordX);

  // re-draw lines between handles.
  setDataOnLine({ ref, data, x, y, classes: ['horizontal', 'gte'], xValue: d => d.time, yValue: d => d.gte ?? minY });
  setDataOnLine({ ref, data, x, y, classes: ['horizontal', 'lte'], xValue: d => d.time, yValue: d => d.lte ?? maxY });
  setDataOnLine({ ref, data, x, y, classes: ['vertical', 'gte'], xValue: d => d.time, yValue: d => d.gte ?? minY });
  setDataOnLine({ ref, data, x, y, classes: ['vertical', 'lte'], xValue: d => d.time, yValue: d => d.lte ?? maxY });

  // re-draw handlers info
  setDataOnHandleInfo({
    svg: ref.current,
    selector: `.${d3Classes.handleInfo}.${gteOrLte}[index="${index}"]`,
    data: data[dataIndex],
    yAttribute: gteOrLte,
    unitSymbol,
    coordX,
    coordY,
  });
  setDataOnHandleInfo({
    svg: ref.current,
    selector: `.${d3Classes.handleInfo}.${oppositeMinOrMax}[index="${index}"]`,
    data: data[dataIndex],
    yAttribute: oppositeMinOrMax,
    unitSymbol,
    coordX,
    coordY: parseFloat(d3.select(`circle[index="${index}"][gte-or-lte="${oppositeMinOrMax}"]`).attr('cy')),
  });
}

export function dragHandlerNoInterpolationSchedule({
  d,
  that,
  x,
  y,
  startDateTime,
  endDateTime,
  minY,
  maxY,
  data,
  ref,
  unitSymbol,
  key,
  dataForHandles,
  oneOf,
  yValues,
}: DragHandlerSchedule) {
  // Get CoordX and CoordY bounded by the view.
  const nearestYValue = nearestValue(yValues, d.y);
  const coordX = getCoordX({ x, i: d.x, min: startDateTime, max: endDateTime });
  const coordY = isScaleLinear(y) ? getCoordY({ y, i: d.y, min: minY, max: maxY }) : nearestYValue;

  // prepare to mutate `data` that the objects are drawn from.
  const index = parseInt(d3.select(that).attr('index'), 10);
  const handleData = dataForHandles[index];
  const newX = x.invert(coordX);
  const newY = isScaleLinear(y)
    ? `${Math.round(y.invert(coordY) * 10) / 10}`
    : oneOf.find(item => y(item) === nearestYValue);

  // drag the current handle.
  d3.select(ref.current).selectAll(`circle[index="${index}"]`).attr('cx', coordX);
  d3.select(that).attr('cy', coordY);

  // mutate data based on the item in dataForHandles dragged.
  const indexInData = data.findIndex(d => d === handleData);
  data[indexInData].time = newX;
  const actionValueKey = key ? `values.${key}` : 'value';
  set(data[indexInData], actionValueKey, newY);

  // re-draw lines between handles.
  const setDateOnLineArgs = {
    ref,
    data,
    x,
    y,
    xValue: d => d.time,
    yValue: d => get(d, actionValueKey),
  };
  setDataOnLine({ ...setDateOnLineArgs, classes: ['horizontal', key] });
  setDataOnLine({ ...setDateOnLineArgs, classes: ['vertical', key] });

  // re-draw other handler info when Schedule has multiple values
  if (key) {
    Object.keys(data[indexInData].values)
      .filter(k => k !== key)
      .forEach(otherKey => {
        setDataOnHandleInfo({
          svg: ref.current,
          selector: `.${d3Classes.handleInfo}.${otherKey}[index="${index}"]`,
          data: handleData,
          yAttribute: `values.${otherKey}`,
          unitSymbol,
          coordX,
        });
      });
  }

  // re-draw handler info
  setDataOnHandleInfo({
    svg: ref.current,
    selector: `.${[d3Classes.handleInfo, key].filter(Boolean).join('.')}[index="${index}"]`,
    data: handleData,
    yAttribute: actionValueKey,
    unitSymbol,
    coordX,
    coordY,
  });
}

import {
  drawContainer,
  drawLine,
  getElement,
  SetDataOnLine,
  setDataOnLine,
} from '@plentyag/app-environment/src/common/utils/d3';
import { RolledUpByTimeObservation } from '@plentyag/core/src/types';
import { Metric } from '@plentyag/core/src/types/environment';
import moment from 'moment';

import { COLORS } from '../../utils/constants';

import { RenderFunction } from '.';

const d3Classes = {
  frame: (metric: Metric) => `frame-${metric.id}`,
  handleFrame: (metric: Metric) => `handle-frame-${metric.id}`,
  handleInfo: (metric: Metric) => `handle-info-${metric.id}`,
};

export interface RenderNonNumericalObservationsStepInterpolation {
  metric: Metric;
  observations: RolledUpByTimeObservation[];
}

export const renderNonNumericalObservationsStepInterpolation: RenderFunction<
  RenderNonNumericalObservationsStepInterpolation
> =
  ({ ref, scale }) =>
  ({ metric, observations = [] }) => {
    const { x, y, paddingX, paddingY } = scale;

    const data = observations.map<RolledUpByTimeObservation<Date>>(o => ({
      ...o,
      rolledUpAt: moment(o.rolledUpAt).toDate(),
    }));

    // Draw container for Lines
    drawContainer({ svg: ref.current, class: d3Classes.frame(metric), paddingX, paddingY });

    const id = `metric-${metric.id}`;

    // Draw Lines
    const drawLineArgs = {
      ref,
      selector: getElement('g', d3Classes.frame(metric)),
      data,
      color: COLORS.data,
    };
    drawLine({ ...drawLineArgs, classes: [id, 'horizontal'] });

    // Set data on Lines drawn previously
    const setDataOnLineArgs: Omit<SetDataOnLine<RolledUpByTimeObservation<Date>>, 'classes'> = {
      ref,
      data,
      x,
      y,
      xValue: d => d.rolledUpAt,
      yValue: d => d.value,
    };
    setDataOnLine({ ...setDataOnLineArgs, classes: [id, 'horizontal'] });

    drawLine({
      ref,
      selector: getElement('g', d3Classes.frame(metric)),
      data,
      classes: [id, 'vertical'],
      color: COLORS.data,
    });

    setDataOnLine({ ...setDataOnLineArgs, classes: [id, 'vertical'] });
  };

import { IrrigationStatus } from '@plentyag/app-production/src/maps-interactive-page/types';
import * as d3 from 'd3';

import { drawIrrigationIcon } from './draw-irrigation-icon';

describe('drawIrrigationIcon', () => {
  let node, el;

  const commonProps = {
    x: 12,
    y: 15,
    width: 23,
    height: 32,
  };

  beforeEach(() => {
    // ARRANGE
    node = document.createElement('svg');
    el = d3.select(node);
  });

  it('draws an irrigation cancelled icon, when execution status is cancelled', () => {
    // ACT
    drawIrrigationIcon({
      el,
      ...commonProps,
      status: IrrigationStatus.CANCELLED,
    });
    // ASSERT
    expect(node.innerHTML).toContain(
      '<g data-testid="draw-irrigation-icon-cancelled"><image href="irrigation-cancelled-icon.svg" width="23" height="32" x="12" y="15"></image></g>'
    );
  });

  it('draws an irrigation pending icon, when execution status is created', () => {
    // ACT
    drawIrrigationIcon({
      el,
      ...commonProps,
      status: IrrigationStatus.CREATED,
    });
    // ASSERT
    expect(node.innerHTML).toContain(
      '<g data-testid="draw-irrigation-icon-pending"><image href="irrigation-pending-icon.svg" width="23" height="32" x="12" y="15"></image></g>'
    );
  });

  it('draws an irrigation failure icon, when execution status is failure', () => {
    // ACT
    drawIrrigationIcon({
      el,
      ...commonProps,
      status: IrrigationStatus.FAILURE,
    });
    // ASSERT
    expect(node.innerHTML).toContain(
      '<g data-testid="draw-irrigation-icon-failure"><image href="irrigation-failure-icon.svg" width="23" height="32" x="12" y="15"></image></g>'
    );
  });

  it('draws an irrigation pending icon, when execution status is ongoing', () => {
    // ACT
    drawIrrigationIcon({
      el,
      ...commonProps,
      status: IrrigationStatus.ONGOING,
    });
    // ASSERT
    expect(node.innerHTML).toContain(
      '<g data-testid="draw-irrigation-icon-pending"><image href="irrigation-pending-icon.svg" width="23" height="32" x="12" y="15"></image></g>'
    );
  });

  it('draws an irrigation success icon, when execution status is success', () => {
    // ACT
    drawIrrigationIcon({
      el,
      ...commonProps,
      status: IrrigationStatus.SUCCESS,
    });
    // ASSERT
    expect(node.innerHTML).toContain(
      '<g data-testid="draw-irrigation-icon-success"><image href="irrigation-success-icon.svg" width="23" height="32" x="12" y="15"></image></g>'
    );
  });
});

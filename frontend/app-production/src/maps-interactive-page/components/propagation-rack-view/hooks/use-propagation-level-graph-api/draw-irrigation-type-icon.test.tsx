import { IrrigationExecutionType } from '@plentyag/app-production/src/maps-interactive-page/types';
import * as d3 from 'd3';

import { drawIrrigationTypeIcon } from './draw-irrigation-type-icon';

describe('drawIrrigationTypeIcon', () => {
  let node, el;

  const commonProps = {
    x: 12,
    y: 15,
    width: 20,
    height: 17,
  };

  beforeEach(() => {
    // ARRANGE
    node = document.createElement('svg');
    el = d3.select(node);
  });

  it('draws no irrigation type icon, when irrigation type is scheduled', () => {
    // ACT
    drawIrrigationTypeIcon({
      el,
      ...commonProps,
      irrigationType: IrrigationExecutionType.SCHEDULED,
    });
    // ASSERT
    expect(node.innerHTML).toContain('');
  });

  it('draws a manual irrigation icon, when irrigation type is manual', () => {
    // ACT
    drawIrrigationTypeIcon({
      el,
      ...commonProps,
      irrigationType: IrrigationExecutionType.MANUAL,
    });
    // ASSERT
    expect(node.innerHTML).toContain(
      '<g data-testid="draw-irrigation-icon-manual"><image href="irrigation-manual-icon.svg" width="20" height="17" x="12" y="15"></image></g>'
    );
  });
});

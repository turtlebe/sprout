import IrrigationManualIcon from '@plentyag/app-production/src/maps-interactive-page/assets/irrigation-manual-icon.svg';
import { IrrigationExecutionType } from '@plentyag/app-production/src/maps-interactive-page/types';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';

interface DrawIrrigationTypeIcon {
  el: d3.Selection<any, any, any, any>;
  x: number;
  y: number;
  irrigationType: IrrigationExecutionType;
}

const dataTestIds = getScopedDataTestIds(
  {
    irrigationManualIcon: 'icon-manual',
  },
  'draw-irrigation'
);

export { dataTestIds as dataTestIdsDrawIrrigationTypeIcon };

// Defaults to IrrigationExecutionType.Manual which is the only irrigation type icon requested by users
export const drawIrrigationTypeIcon = ({ el, x, y, irrigationType }: DrawIrrigationTypeIcon): void => {
  if (irrigationType == IrrigationExecutionType.MANUAL) {
    el.append('g')
      .attr('data-testid', dataTestIds.irrigationManualIcon)
      .append('svg:image')
      .attr('xlink:href', IrrigationManualIcon)
      .attr('width', '20')
      .attr('height', '17')
      .attr('x', x)
      .attr('y', y);
  }
};

import IrrigationCancelledIcon from '@plentyag/app-production/src/maps-interactive-page/assets/irrigation-cancelled-icon.svg';
import IrrigationFailureIcon from '@plentyag/app-production/src/maps-interactive-page/assets/irrigation-failure-icon.svg';
import IrrigationPendingIcon from '@plentyag/app-production/src/maps-interactive-page/assets/irrigation-pending-icon.svg';
import IrrigationSuccessIcon from '@plentyag/app-production/src/maps-interactive-page/assets/irrigation-success-icon.svg';
import { IrrigationStatus } from '@plentyag/app-production/src/maps-interactive-page/types';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import * as d3 from 'd3';

interface DrawIrrigationIcon {
  el: d3.Selection<any, any, any, any>;
  x: number;
  y: number;
  status: IrrigationStatus;
}

const dataTestIds = getScopedDataTestIds(
  {
    irrigationCancelledIcon: 'icon-cancelled',
    irrigationFailureIcon: 'icon-failure',
    irrigationPendingIcon: 'icon-pending',
    irrigationSuccessIcon: 'icon-success',
  },
  'draw-irrigation'
);

const getIrrigationStatusIcon = status => {
  switch (status) {
    case 'CANCELLED':
      return IrrigationCancelledIcon;
    case 'FAILURE':
      return IrrigationFailureIcon;
    case 'SUCCESS':
      return IrrigationSuccessIcon;
    // All other statuses (i.e. CREATED, ONGOING) default to Pending icon
    // until new icons are requested
    default:
      return IrrigationPendingIcon;
  }
};

const getIrrigationStatusIconTestId = status => {
  switch (status) {
    case 'CANCELLED':
      return dataTestIds.irrigationCancelledIcon;
    case 'FAILURE':
      return dataTestIds.irrigationFailureIcon;
    case 'SUCCESS':
      return dataTestIds.irrigationSuccessIcon;
    // All other statuses (i.e. CREATED, ONGOING) default to Pending icon
    // until new icons are requested
    default:
      return dataTestIds.irrigationPendingIcon;
  }
};

export { dataTestIds as dataTestIdsDrawIrrigationIcon };

export const drawIrrigationIcon = ({ el, x, y, status }: DrawIrrigationIcon): void => {
  el.append('g')
    .attr('data-testid', getIrrigationStatusIconTestId(status))
    .append('svg:image')
    .attr('xlink:href', getIrrigationStatusIcon(status))
    .attr('width', '23')
    .attr('height', '32')
    .attr('x', x)
    .attr('y', y);
};

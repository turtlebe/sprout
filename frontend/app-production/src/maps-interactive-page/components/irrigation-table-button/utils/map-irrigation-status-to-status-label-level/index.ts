import { InternalIrrigationStatus, IrrigationStatus } from '@plentyag/app-production/src/maps-interactive-page/types';
import { StatusLabelLevel } from '@plentyag/brand-ui/src/components';

/**
 * This mapping is performed so we can use the StatusLabel component to display the status of the irrigation
 */
export function mapIrrigationStatusToStatusLabelLevel(
  status: IrrigationStatus | InternalIrrigationStatus
): StatusLabelLevel {
  switch (status) {
    case 'SUCCESS':
      return StatusLabelLevel.SUCCESS;
    case 'CREATED':
      return StatusLabelLevel.PENDING;
    case 'CANCELLED':
      return StatusLabelLevel.IDLE;
    case 'FAILURE':
      return StatusLabelLevel.FAILED;
    case 'ONGOING':
      return StatusLabelLevel.PROGRESSING;
    case 'UNSCHEDULED':
    default:
      return StatusLabelLevel.IDLE;
  }
}

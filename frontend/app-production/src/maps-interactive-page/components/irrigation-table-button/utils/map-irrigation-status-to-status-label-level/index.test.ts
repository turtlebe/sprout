import { InternalIrrigationStatus, IrrigationStatus } from '@plentyag/app-production/src/maps-interactive-page/types';
import { StatusLabelLevel } from '@plentyag/brand-ui/src/components';

import { mapIrrigationStatusToStatusLabelLevel } from './index';

describe('mapIrrigationStatusToStatusLabelLevel', () => {
  it('should return the correct status label level for the given irrigation status', () => {
    expect(mapIrrigationStatusToStatusLabelLevel(IrrigationStatus.SUCCESS)).toBe(StatusLabelLevel.SUCCESS);
    expect(mapIrrigationStatusToStatusLabelLevel(IrrigationStatus.CREATED)).toBe(StatusLabelLevel.PENDING);
    expect(mapIrrigationStatusToStatusLabelLevel(IrrigationStatus.CANCELLED)).toBe(StatusLabelLevel.IDLE);
    expect(mapIrrigationStatusToStatusLabelLevel(IrrigationStatus.FAILURE)).toBe(StatusLabelLevel.FAILED);
    expect(mapIrrigationStatusToStatusLabelLevel(IrrigationStatus.ONGOING)).toBe(StatusLabelLevel.PROGRESSING);
    expect(mapIrrigationStatusToStatusLabelLevel(InternalIrrigationStatus.UNSCHEDULED)).toBe(StatusLabelLevel.IDLE);

    // default for unknown status or some new status we don't have mapping yet.
    // @ts-ignore
    expect(mapIrrigationStatusToStatusLabelLevel('')).toBe(StatusLabelLevel.IDLE);
  });
});

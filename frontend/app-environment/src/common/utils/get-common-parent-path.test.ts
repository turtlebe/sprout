import { buildMetric, buildSchedule } from '../test-helpers';

import { getCommonParentPath } from './get-common-parent-path';

describe('getCommonParentPath', () => {
  it('returns the common parent path and the remaining variations for schedules', () => {
    const schedules = [
      buildSchedule({
        path: 'sites/LAX1/areas/Propagation/lines/PropagationRack1/machines/LightRow1/scheduleDefinitions/SetLightIntensity',
      }),
      buildSchedule({
        path: 'sites/LAX1/areas/Propagation/lines/PropagationRack1/machines/LightRow2/scheduleDefinitions/SetLightIntensity',
      }),
      buildSchedule({
        path: 'sites/LAX1/areas/Propagation/lines/PropagationRack1/machines/LightRow3/scheduleDefinitions/SetLightIntensity',
      }),
      buildSchedule({
        path: 'sites/LAX1/areas/Propagation/lines/PropagationRack1/machines/LightRow4/scheduleDefinitions/SetLightIntensity',
      }),
    ];

    expect(getCommonParentPath(schedules)).toEqual({
      commonParentPath: 'sites/LAX1/areas/Propagation/lines/PropagationRack1',
      remainingPaths: [
        'LightRow1/SetLightIntensity',
        'LightRow2/SetLightIntensity',
        'LightRow3/SetLightIntensity',
        'LightRow4/SetLightIntensity',
      ],
    });
  });

  it('returns the common parent path and the remaining variations for schedules with different schedule definitions', () => {
    const schedules = [
      buildSchedule({
        path: 'sites/LAX1/areas/VerticalGrow/lines/GrowRoom1/machines/GrowLine1Nutrient/scheduleDefinitions/SetIrrigationModeA',
      }),
      buildSchedule({
        path: 'sites/LAX1/areas/VerticalGrow/lines/GrowRoom1/machines/GrowLine1Nutrient/scheduleDefinitions/SetIrrigationModeB',
      }),
      buildSchedule({
        path: 'sites/LAX1/areas/VerticalGrow/lines/GrowRoom1/machines/GrowLine2Nutrient/scheduleDefinitions/SetIrrigationModeA',
      }),
      buildSchedule({
        path: 'sites/LAX1/areas/VerticalGrow/lines/GrowRoom1/machines/GrowLine2Nutrient/scheduleDefinitions/SetIrrigationModeB',
      }),
    ];

    expect(getCommonParentPath(schedules)).toEqual({
      commonParentPath: 'sites/LAX1/areas/VerticalGrow/lines/GrowRoom1',
      remainingPaths: [
        'GrowLine1Nutrient/SetIrrigationModeA',
        'GrowLine1Nutrient/SetIrrigationModeB',
        'GrowLine2Nutrient/SetIrrigationModeA',
        'GrowLine2Nutrient/SetIrrigationModeB',
      ],
    });
  });

  it('returns the last segement of the path when all the paths are identical', () => {
    const metrics = [
      buildMetric({
        path: 'sites/LAX1/areas/Propagation/lines/PropagationRack1/machines/ThermalSystem',
      }),
      buildMetric({
        path: 'sites/LAX1/areas/Propagation/lines/PropagationRack1/machines/ThermalSystem',
      }),
    ];

    expect(getCommonParentPath(metrics)).toEqual({
      commonParentPath: 'sites/LAX1/areas/Propagation/lines/PropagationRack1/machines/ThermalSystem',
      remainingPaths: ['ThermalSystem', 'ThermalSystem'],
    });
  });

  it('returns the common parent paths and the remaining variations for metrics', () => {
    const metrics = [
      buildMetric({
        path: 'sites/LAX1/areas/Propagation/lines/PropagationRack1/machines/ThermalSystem',
      }),
      buildMetric({
        path: 'sites/LAX2/areas/Propagation/lines/PropagationRack1/machines/ThermalSystem',
      }),
      buildMetric({
        path: 'sites/LAX3/areas/Propagation/lines/PropagationRack1/machines/ThermalSystem',
      }),
      buildMetric({
        path: 'sites/LAX4/areas/Propagation/lines/PropagationRack1/machines/ThermalSystem',
      }),
    ];

    expect(getCommonParentPath(metrics)).toEqual({
      commonParentPath: null,
      remainingPaths: [
        'LAX1/Propagation/PropagationRack1/ThermalSystem',
        'LAX2/Propagation/PropagationRack1/ThermalSystem',
        'LAX3/Propagation/PropagationRack1/ThermalSystem',
        'LAX4/Propagation/PropagationRack1/ThermalSystem',
      ],
    });
  });
});
